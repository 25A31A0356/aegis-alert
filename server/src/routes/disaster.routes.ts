import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { DisasterEvent } from '../../../shared';

const router = Router();

// GET /api/disasters
router.get('/disasters', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM disaster_events ORDER BY timestamp DESC');
    const events: DisasterEvent[] = rows.map((r) => ({
      id: r.id,
      hazardType: r.hazard_type,
      title: r.title,
      location: r.location,
      coordinates: { lat: r.lat, lng: r.lng },
      severity: r.severity,
      status: r.status,
      timestamp: r.timestamp,
      details: r.details,
      affectedCount: r.affected_count,
      dataSource: r.data_source,
    }));
    sendSuccess(res, events, { total: events.length, source: 'DEMO DATA' });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
