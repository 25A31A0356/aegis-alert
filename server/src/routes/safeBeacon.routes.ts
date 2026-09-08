import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { emergencyLimiter } from '../middleware/rateLimiter';
import { SafeBeacon, SafeBeaconStatus } from '../../../shared';

const router = Router();

// POST /api/safe-beacon
router.post('/safe-beacon', emergencyLimiter, async (req: Request, res: Response) => {
  try {
    const { userName, status, coordinates, notes = '' } = req.body;

    if (!userName || !status || !coordinates || coordinates.lat === undefined || coordinates.lng === undefined) {
      return sendError(res, 'Missing required fields: userName, status, coordinates (lat, lng)', 400);
    }

    const id = `safe_${Date.now()}`;
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO safe_beacons (id, user_name, status, lat, lng, address, is_shared, notes, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userName, status, coordinates.lat, coordinates.lng, coordinates.address || '', 1, notes, now]
    );

    // Audit in history
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}`,
        'SAFE_BEACON_SENT',
        `Safe Status Broadcasted: ${status}`,
        `Location ping shared: [${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}]`,
        now,
      ]
    );

    const record: SafeBeacon = {
      id,
      userName,
      status: status as SafeBeaconStatus,
      coordinates,
      timestamp: now,
      notes,
      isShared: true,
    };

    sendSuccess(res, record, { source: 'LOCAL_DB' }, 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// GET /api/safe-beacon/latest
router.get('/safe-beacon/latest', async (_req: Request, res: Response) => {
  try {
    const r = await db.get<any>('SELECT * FROM safe_beacons ORDER BY timestamp DESC LIMIT 1');
    if (!r) {
      return sendSuccess(res, null);
    }
    const beacon: SafeBeacon = {
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      status: r.status as SafeBeaconStatus,
      coordinates: { lat: r.lat, lng: r.lng, address: r.address },
      timestamp: r.timestamp,
      notes: r.notes,
      isShared: Boolean(r.is_shared),
    };
    sendSuccess(res, beacon);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
