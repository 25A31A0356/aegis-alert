import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { NotificationItem, SeverityLevel } from '../../../shared';

const router = Router();

// 1. GET /api/notifications (Fetch all notifications ordered by timestamp)
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

// 2. PATCH /api/notifications/:id/read (Mark single notification as read)
router.patch('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    sendSuccess(res, { id, isRead: true });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 3. PATCH /api/notifications/read-all (Mark all notifications as read)
router.patch('/notifications/read-all', async (_req: Request, res: Response) => {
  try {
    await db.run('UPDATE notifications SET is_read = 1');
    sendSuccess(res, { message: 'All notifications marked as read' });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 4. DELETE /api/notifications/:id (Delete/Clear single notification)
router.delete('/notifications/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM notifications WHERE id = ?', [id]);
    sendSuccess(res, { id, deleted: true });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 5. DELETE /api/notifications (Clear all notifications)
router.delete('/notifications', async (_req: Request, res: Response) => {
  try {
    await db.run('DELETE FROM notifications');
    sendSuccess(res, { message: 'All notifications cleared' });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
