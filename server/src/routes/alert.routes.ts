import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { DisasterAlert } from '../../../shared';

const router = Router();

// GET /api/alerts - List active alerts
router.get('/alerts', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM alerts ORDER BY created_at DESC');
    const alerts: DisasterAlert[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      hazardType: r.hazard_type,
      severity: r.severity,
      urgency: r.urgency,
      headline: r.headline,
      description: r.description,
      instruction: r.instruction,
      affectedRegions: JSON.parse(r.affected_regions || '[]'),
      effectiveFrom: r.effective_from,
      expiresAt: r.expires_at,
      issuedBy: r.issued_by,
      isLive: Boolean(r.is_live),
      coordinates: r.lat && r.lng ? { lat: r.lat, lng: r.lng } : undefined,
    }));

    sendSuccess(res, alerts, { total: alerts.length, source: 'DEMO DATA' });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// GET /api/alerts/:id
router.get('/alerts/:id', async (req: Request, res: Response) => {
  try {
    const r = await db.get<any>('SELECT * FROM alerts WHERE id = ?', [req.params.id]);
    if (!r) {
      return sendError(res, 'Alert not found', 404);
    }
    const alert: DisasterAlert = {
      id: r.id,
      title: r.title,
      hazardType: r.hazard_type,
      severity: r.severity,
      urgency: r.urgency,
      headline: r.headline,
      description: r.description,
      instruction: r.instruction,
      affectedRegions: JSON.parse(r.affected_regions || '[]'),
      effectiveFrom: r.effective_from,
      expiresAt: r.expires_at,
      issuedBy: r.issued_by,
      isLive: Boolean(r.is_live),
      coordinates: r.lat && r.lng ? { lat: r.lat, lng: r.lng } : undefined,
    };
    sendSuccess(res, alert);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
