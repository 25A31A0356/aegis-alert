import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { DownloadResource, DownloadStatus } from '../../../shared';

const router = Router();

// GET /api/downloads
router.get('/downloads', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM downloads ORDER BY title ASC');
    const downloads: DownloadResource[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      sizeBytes: r.size_bytes,
      sizeFormatted: r.size_formatted,
      status: r.status as DownloadStatus,
      lastUpdated: r.last_updated,
      cachedUrl: r.cached_url,
    }));
    sendSuccess(res, downloads, { total: downloads.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// POST /api/downloads/:id/toggle - Toggle downloaded state
router.post('/downloads/:id/toggle', async (req: Request, res: Response) => {
  try {
    const item = await db.get<any>('SELECT * FROM downloads WHERE id = ?', [req.params.id]);
    if (!item) {
      return sendError(res, 'Resource not found', 404);
    }
    const nextStatus = item.status === 'Downloaded' ? 'Available' : 'Downloaded';
    await db.run('UPDATE downloads SET status = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?', [
      nextStatus,
      req.params.id,
    ]);
    sendSuccess(res, { id: req.params.id, status: nextStatus });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
