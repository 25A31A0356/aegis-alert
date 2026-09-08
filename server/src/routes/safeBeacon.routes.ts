import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { emergencyLimiter } from '../middleware/rateLimiter';
import { SafeBeacon, SafeBeaconStatus } from '../../../shared';

const router = Router();

const VALID_BEACON_STATUSES: SafeBeaconStatus[] = ['SAFE', 'NEED HELP', 'UNABLE TO MOVE'];

// 1. POST /api/safe-beacon (Broadcast & persist safety status)
router.post('/safe-beacon', emergencyLimiter, async (req: Request, res: Response) => {
  try {
    const { userName = 'Citizen', status, coordinates, notes = '' } = req.body;

    if (!status || !VALID_BEACON_STATUSES.includes(status)) {
      return sendError(
        res,
        `Invalid status '${status}'. Must be one of: ${VALID_BEACON_STATUSES.join(', ')}`,
        400
      );
    }

    const lat = coordinates && typeof coordinates.lat === 'number' ? coordinates.lat : 17.6868;
    const lng = coordinates && typeof coordinates.lng === 'number' ? coordinates.lng : 83.2185;
    const address = coordinates?.address || 'Current Disaster Sector Location';

    const id = `safe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // 1. Insert into safe_beacons table
    await db.run(
      `INSERT INTO safe_beacons (id, user_name, status, lat, lng, address, is_shared, notes, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userName, status, lat, lng, address, 1, notes, now]
    );

    // 2. Add event to history_events table
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        'SAFE_BEACON_SENT',
        `Safe Beacon Broadcast: ${status}`,
        `${userName} communicated status '${status}' from ${address} [${lat.toFixed(4)}°, ${lng.toFixed(4)}°]. ${notes ? `Note: ${notes}` : ''}`,
        now,
      ]
    );

    const record: SafeBeacon = {
      id,
      userName,
      status: status as SafeBeaconStatus,
      coordinates: { lat, lng, address },
      timestamp: now,
      notes,
      isShared: true,
    };

    sendSuccess(res, record, { source: 'LOCAL_DB' }, 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 2. GET /api/safe-beacon/latest (Fetch most recent active beacon)
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

// 3. GET /api/safe-beacon/history (Fetch all broadcasted beacon logs)
router.get('/safe-beacon/history', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM safe_beacons ORDER BY timestamp DESC LIMIT 50');
    const beacons: SafeBeacon[] = rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      status: r.status as SafeBeaconStatus,
      coordinates: { lat: r.lat, lng: r.lng, address: r.address },
      timestamp: r.timestamp,
      notes: r.notes,
      isShared: Boolean(r.is_shared),
    }));
    sendSuccess(res, beacons, { total: beacons.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
