import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { emergencyLimiter } from '../middleware/rateLimiter';
import { SOSRequest, SOSStatus } from '../../../shared';

const router = Router();

// POST /api/sos - Trigger emergency SOS distress request
router.post('/sos', emergencyLimiter, async (req: Request, res: Response) => {
  try {
    const {
      userName = 'Citizen',
      contactNumber = '+91-98765-43210',
      emergencyType = 'Flood Inundation',
      coordinates,
      trappedCount = 1,
      hasElderlyOrInfants = false,
      hasMedicalEmergency = false,
      waterLevelMeters = 0,
      notes = '',
    } = req.body;

    if (!coordinates || coordinates.lat === undefined || coordinates.lng === undefined) {
      return sendError(res, 'Missing required coordinates (lat, lng)', 400);
    }

    const id = `sos_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO sos_requests (
        id, user_name, contact_number, emergency_type, status,
        lat, lng, address, landmark, trapped_count, has_elderly_or_infants,
        has_medical_emergency, water_level_meters, notes, estimated_arrival, timestamp, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userName,
        contactNumber,
        emergencyType,
        'SOS ACTIVATED',
        coordinates.lat,
        coordinates.lng,
        coordinates.address || 'User GPS Sector',
        coordinates.landmark || '',
        trappedCount,
        hasElderlyOrInfants ? 1 : 0,
        hasMedicalEmergency ? 1 : 0,
        waterLevelMeters,
        notes,
        '15-25 mins (Simulated Rescue Dispatch)',
        now,
        now,
      ]
    );

    // Append to notifications table
    await db.run(
      `INSERT INTO notifications (id, type, title, message, severity, timestamp, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `notif_sos_${Date.now()}`,
        'DISASTER_ALERT',
        `🚨 SOS BEACON ACTIVE: ${emergencyType}`,
        `Distress beacon broadcast from ${coordinates.address || 'your location'}. Trapped count: ${trappedCount}.`,
        'CRITICAL',
        now,
        0,
      ]
    );

    // Audit in history table
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}`,
        'SOS_ACTIVATED',
        `SOS Beacon Broadcasted (${emergencyType})`,
        `Distress packet transmitted from [${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}]. People trapped: ${trappedCount}. Water level: ${waterLevelMeters}m.`,
        now,
      ]
    );

    const sosRecord: SOSRequest = {
      id,
      userName,
      contactNumber,
      emergencyType,
      status: 'SOS ACTIVATED',
      coordinates,
      trappedCount,
      hasElderlyOrInfants,
      hasMedicalEmergency,
      waterLevelMeters,
      notes,
      timestamp: now,
      updatedAt: now,
      estimatedArrival: '15-25 mins (Simulated Rescue Dispatch)',
    };

    return sendSuccess(res, sosRecord, { source: 'LOCAL_DB' }, 201);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/sos/latest - Fetch latest active SOS request
router.get('/sos/latest', async (_req: Request, res: Response) => {
  try {
    const r = await db.get<any>(
      `SELECT * FROM sos_requests WHERE status != 'RESOLVED' ORDER BY timestamp DESC LIMIT 1`
    );
    if (!r) {
      return sendSuccess(res, null);
    }
    const sos: SOSRequest = {
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      contactNumber: r.contact_number,
      emergencyType: r.emergency_type,
      status: r.status as SOSStatus,
      coordinates: { lat: r.lat, lng: r.lng, address: r.address, landmark: r.landmark },
      trappedCount: r.trapped_count,
      hasElderlyOrInfants: Boolean(r.has_elderly_or_infants),
      hasMedicalEmergency: Boolean(r.has_medical_emergency),
      waterLevelMeters: r.water_level_meters,
      notes: r.notes,
      timestamp: r.timestamp,
      updatedAt: r.updated_at,
      estimatedArrival: r.estimated_arrival,
    };
    return sendSuccess(res, sos);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/sos/:id - Check specific SOS request status
router.get('/sos/:id', async (req: Request, res: Response) => {
  try {
    const r = await db.get<any>('SELECT * FROM sos_requests WHERE id = ?', [req.params.id]);
    if (!r) {
      return sendError(res, 'SOS request not found', 404);
    }
    const sos: SOSRequest = {
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      contactNumber: r.contact_number,
      emergencyType: r.emergency_type,
      status: r.status as SOSStatus,
      coordinates: { lat: r.lat, lng: r.lng, address: r.address, landmark: r.landmark },
      trappedCount: r.trapped_count,
      hasElderlyOrInfants: Boolean(r.has_elderly_or_infants),
      hasMedicalEmergency: Boolean(r.has_medical_emergency),
      waterLevelMeters: r.water_level_meters,
      notes: r.notes,
      timestamp: r.timestamp,
      updatedAt: r.updated_at,
      estimatedArrival: r.estimated_arrival,
    };
    return sendSuccess(res, sos);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// PATCH /api/sos/:id/status - Update SOS request lifecycle status (Cancel or Advance)
router.patch('/sos/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const now = new Date().toISOString();

    const existing = await db.get<any>('SELECT * FROM sos_requests WHERE id = ?', [req.params.id]);
    if (!existing) {
      return sendError(res, 'SOS request not found', 404);
    }

    await db.run(
      `UPDATE sos_requests SET status = ?, updated_at = ? WHERE id = ?`,
      [status, now, req.params.id]
    );

    // Audit status update
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}`,
        'SOS_ACTIVATED',
        `SOS Status Update: ${status}`,
        `SOS request ${req.params.id} updated to [${status}].`,
        now,
      ]
    );

    const updated = await db.get<any>('SELECT * FROM sos_requests WHERE id = ?', [req.params.id]);
    const sos: SOSRequest = {
      id: updated.id,
      userId: updated.user_id,
      userName: updated.user_name,
      contactNumber: updated.contact_number,
      emergencyType: updated.emergency_type,
      status: updated.status as SOSStatus,
      coordinates: { lat: updated.lat, lng: updated.lng, address: updated.address, landmark: updated.landmark },
      trappedCount: updated.trapped_count,
      hasElderlyOrInfants: Boolean(updated.has_elderly_or_infants),
      hasMedicalEmergency: Boolean(updated.has_medical_emergency),
      waterLevelMeters: updated.water_level_meters,
      notes: updated.notes,
      timestamp: updated.timestamp,
      updatedAt: updated.updated_at,
      estimatedArrival: updated.estimated_arrival,
    };

    return sendSuccess(res, sos);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
