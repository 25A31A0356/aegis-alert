import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { HistoryEvent, HistoryActionType } from '../../../shared';

const router = Router();

// GET /api/history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM history_events ORDER BY timestamp DESC');
    const events: HistoryEvent[] = rows.map((r) => ({
      id: r.id,
      actionType: r.action_type as HistoryActionType,
      title: r.title,
      details: r.details,
      timestamp: r.timestamp,
      metadata: r.metadata ? JSON.parse(r.metadata) : undefined,
    }));
    sendSuccess(res, events, { total: events.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
