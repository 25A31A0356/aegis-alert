import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { emergencyLimiter } from '../middleware/rateLimiter';
import { SOSRequest, SOSStatus } from '../../../shared';

const router = Router();

// POST /api/sos - Trigger emergency SOS request
router.post('/sos', emergencyLimiter, async (req: Request, res: Response) => {
  try {
    const {
      userName,
      contactNumber,
      emergencyType,
      coordinates,
      trappedCount = 1,
      hasElderlyOrInfants = false,
      hasMedicalEmergency = false,
      waterLevelMeters = 0,
      notes = '',
    } = req.body;

    if (!userName || !contactNumber || !coordinates || coordinates.lat === undefined || coordinates.lng === undefined) {
      return sendError(res, 'Missing required fields: userName, contactNumber, coordinates (lat, lng)', 400);
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
        emergencyType || 'Flood',
        'HELP REQUEST RECEIVED',
        coordinates.lat,
        coordinates.lng,
        coordinates.address || 'User GPS Sector',
        coordinates.landmark || '',
        trappedCount,
        hasElderlyOrInfants ? 1 : 0,
        hasMedicalEmergency ? 1 : 0,
        waterLevelMeters,
        notes,
        '15-25 mins (NDRF Dispatching)',
        now,
        now,
      ]
    );

    // Audit in history
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}`,
        'SOS_ACTIVATED',
        `SOS Activated: ${emergencyType || 'Emergency'}`,
        `Distress beacon broadcasted from [${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}]. Trapped persons: ${trappedCount}.`,
        now,
      ]
    );

    const sosRecord: SOSRequest = {
      id,
      userName,
      contactNumber,
      emergencyType: emergencyType || 'Flood',
      status: 'HELP REQUEST RECEIVED',
      coordinates,
      trappedCount,
      hasElderlyOrInfants,
      hasMedicalEmergency,
      waterLevelMeters,
      notes,
      timestamp: now,
      updatedAt: now,
      estimatedArrival: '15-25 mins (NDRF Dispatching)',
    };

    sendSuccess(res, sosRecord, { source: 'LOCAL_DB' }, 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// GET /api/sos/:id - Check SOS request status
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
    sendSuccess(res, sos);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
