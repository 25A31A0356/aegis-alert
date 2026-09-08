import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { CommunityReport, CommunityReportCategory, CommunityReportStatus, SeverityLevel } from '../../../shared';

const router = Router();

// GET /api/community-reports
router.get('/community-reports', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM community_reports ORDER BY timestamp DESC');
    const reports: CommunityReport[] = rows.map((r) => ({
      id: r.id,
      category: r.category as CommunityReportCategory,
      title: r.title,
      description: r.description,
      location: r.location,
      coordinates: { lat: r.lat, lng: r.lng },
      severity: r.severity as SeverityLevel,
      imageUrl: r.image_url,
      status: r.status as CommunityReportStatus,
      upvotes: r.upvotes,
      timestamp: r.timestamp,
    }));
    sendSuccess(res, reports, { total: reports.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// POST /api/community-reports
router.post('/community-reports', async (req: Request, res: Response) => {
  try {
    const { category, title, description, location, coordinates, severity = 'MEDIUM', imageUrl } = req.body;

    if (!category || !title || !description || !location || !coordinates || coordinates.lat === undefined) {
      return sendError(res, 'Missing required report fields (category, title, description, location, coordinates)', 400);
    }

    const id = `rep_${Date.now()}`;
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO community_reports (
        id, category, title, description, location, lat, lng, severity, image_url, status, upvotes, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category, title, description, location, coordinates.lat, coordinates.lng, severity, imageUrl || null, 'Submitted', 0, now]
    );

    // Audit in history
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [`hist_${Date.now()}`, 'COMMUNITY_REPORT_SUBMITTED', `Incident Reported: ${title}`, `${category} reported at ${location}.`, now]
    );

    const createdReport: CommunityReport = {
      id,
      category: category as CommunityReportCategory,
      title,
      description,
      location,
      coordinates,
      severity: severity as SeverityLevel,
      imageUrl,
      status: 'Submitted',
      upvotes: 0,
      timestamp: now,
    };

    sendSuccess(res, createdReport, undefined, 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
