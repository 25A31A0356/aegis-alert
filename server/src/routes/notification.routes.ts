import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { NotificationItem, SeverityLevel } from '../../../shared';

const router = Router();

// GET /api/notifications
router.get('/notifications', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM notifications ORDER BY timestamp DESC');
    const notifications: NotificationItem[] = rows.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      message: r.message,
      severity: r.severity as SeverityLevel,
      isRead: Boolean(r.is_read),
      linkAction: r.link_action,
      timestamp: r.timestamp,
    }));
    sendSuccess(res, notifications, { total: notifications.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// PATCH /api/notifications/:id/read
router.patch('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    sendSuccess(res, { id: req.params.id, isRead: true });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
