import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { CommunityReport, CommunityReportCategory, CommunityReportStatus, SeverityLevel } from '../../../shared';

const router = Router();

const VALID_CATEGORIES = [
  'Flooding',
  'Road blockage',
  'Fallen trees',
  'Infrastructure damage',
  'People needing assistance',
  'Shelter issues',
  'Other emergency situations',
  'Road Blockage',
  'Fallen Trees',
  'Infrastructure Damage',
  'People Needing Assistance',
  'Shelter Issues',
  'Other',
];

const VALID_STATUSES: CommunityReportStatus[] = [
  'Submitted',
  'Under Review',
  'Verified',
  'Resolved',
];

const VALID_SEVERITIES: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

// 1. GET /api/community-reports (with optional filtering)
router.get('/community-reports', async (req: Request, res: Response) => {
  try {
    const { category, status, severity, search } = req.query;

    let query = 'SELECT * FROM community_reports WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'ALL') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      query += ' AND LOWER(status) = LOWER(?)';
      params.push(status);
    }

    if (severity && typeof severity === 'string' && severity !== 'ALL') {
      query += ' AND severity = ?';
      params.push(severity);
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY timestamp DESC';

    const rows = await db.all<any>(query, params);
    const reports: CommunityReport[] = rows.map((r) => ({
      id: r.id,
      category: r.category as CommunityReportCategory,
      title: r.title,
      description: r.description,
      location: r.location,
      coordinates: { lat: r.lat, lng: r.lng },
      severity: r.severity as SeverityLevel,
      imageUrl: r.image_url || undefined,
      status: r.status as CommunityReportStatus,
      upvotes: r.upvotes || 0,
      timestamp: r.timestamp,
    }));

    sendSuccess(res, reports, { total: reports.length, source: 'LOCAL_DB' });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 2. GET /api/community-reports/:id
router.get('/community-reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const r = await db.get<any>('SELECT * FROM community_reports WHERE id = ?', [id]);

    if (!r) {
      return sendError(res, `Community report '${id}' not found`, 404);
    }

    const report: CommunityReport = {
      id: r.id,
      category: r.category as CommunityReportCategory,
      title: r.title,
      description: r.description,
      location: r.location,
      coordinates: { lat: r.lat, lng: r.lng },
      severity: r.severity as SeverityLevel,
      imageUrl: r.image_url || undefined,
      status: r.status as CommunityReportStatus,
      upvotes: r.upvotes || 0,
      timestamp: r.timestamp,
    };

    sendSuccess(res, report);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 3. POST /api/community-reports (Validation, strict initial 'Submitted' status)
router.post('/community-reports', async (req: Request, res: Response) => {
  try {
    const {
      category,
      title,
      description,
      location,
      coordinates,
      severity = 'MEDIUM',
      imageUrl,
    } = req.body;

    const rawCategory = category || req.body.disasterType || req.body.hazardType;

    // Field validations
    if (!rawCategory || typeof rawCategory !== 'string') {
      return sendError(res, 'Disaster type (category) is required', 400);
    }
    const safeCategory = rawCategory.trim();

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return sendError(res, 'Description must be at least 5 characters long', 400);
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return sendError(res, 'Incident location is required', 400);
    }

    const reportSeverity: SeverityLevel = VALID_SEVERITIES.includes(severity)
      ? severity
      : 'MEDIUM';

    const lat = coordinates && typeof coordinates.lat === 'number' ? coordinates.lat : 17.6868;
    const lng = coordinates && typeof coordinates.lng === 'number' ? coordinates.lng : 83.2185;

    const reportTitle =
      title && typeof title === 'string' && title.trim().length > 0
        ? title.trim()
        : `${safeCategory} reported at ${location.trim()}`;

    const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // IMPORTANT: Initial status MUST be 'Submitted' (never auto-verified)
    const initialStatus: CommunityReportStatus = 'Submitted';

    await db.run(
      `INSERT INTO community_reports (
        id, category, title, description, location, lat, lng, severity, image_url, status, upvotes, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        safeCategory,
        reportTitle,
        description.trim(),
        location.trim(),
        lat,
        lng,
        reportSeverity,
        imageUrl || null,
        initialStatus,
        1,
        now,
      ]
    );

    // Audit in history events
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}`,
        'COMMUNITY_REPORT_SUBMITTED',
        `Incident Filed: ${reportTitle}`,
        `${safeCategory} reported at ${location.trim()} (${reportSeverity} Severity). Status: ${initialStatus}.`,
        now,
      ]
    );

    const createdReport: CommunityReport = {
      id,
      category: safeCategory as CommunityReportCategory,
      title: reportTitle,
      description: description.trim(),
      location: location.trim(),
      coordinates: { lat, lng },
      severity: reportSeverity,
      imageUrl: imageUrl || undefined,
      status: initialStatus,
      upvotes: 1,
      timestamp: now,
    };

    sendSuccess(res, createdReport, undefined, 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 4. PATCH /api/community-reports/:id/status (Transition status: Submitted -> Under Review -> Verified -> Resolved)
router.patch('/community-reports/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return sendError(
        res,
        `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`,
        400
      );
    }

    const existing = await db.get<any>('SELECT * FROM community_reports WHERE id = ?', [id]);
    if (!existing) {
      return sendError(res, `Community report '${id}' not found`, 404);
    }

    await db.run('UPDATE community_reports SET status = ? WHERE id = ?', [status, id]);

    // Audit status update
    const now = new Date().toISOString();
    await db.run(
      `INSERT INTO history_events (id, action_type, title, details, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `hist_${Date.now()}`,
        'COMMUNITY_REPORT_SUBMITTED',
        `Report Status Updated: ${existing.title}`,
        `Status transitioned from '${existing.status}' to '${status}'. ${reviewNotes ? `Notes: ${reviewNotes}` : ''}`,
        now,
      ]
    );

    const updated = await db.get<any>('SELECT * FROM community_reports WHERE id = ?', [id]);
    const updatedReport: CommunityReport = {
      id: updated.id,
      category: updated.category as CommunityReportCategory,
      title: updated.title,
      description: updated.description,
      location: updated.location,
      coordinates: { lat: updated.lat, lng: updated.lng },
      severity: updated.severity as SeverityLevel,
      imageUrl: updated.image_url || undefined,
      status: updated.status as CommunityReportStatus,
      upvotes: updated.upvotes || 0,
      timestamp: updated.timestamp,
    };

    sendSuccess(res, updatedReport);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 5. POST /api/community-reports/:id/upvote (Confirm hazard observation)
router.post('/community-reports/:id/upvote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await db.get<any>('SELECT * FROM community_reports WHERE id = ?', [id]);
    if (!existing) {
      return sendError(res, `Community report '${id}' not found`, 404);
    }

    await db.run('UPDATE community_reports SET upvotes = upvotes + 1 WHERE id = ?', [id]);
    const updated = await db.get<any>('SELECT * FROM community_reports WHERE id = ?', [id]);

    const updatedReport: CommunityReport = {
      id: updated.id,
      category: updated.category as CommunityReportCategory,
      title: updated.title,
      description: updated.description,
      location: updated.location,
      coordinates: { lat: updated.lat, lng: updated.lng },
      severity: updated.severity as SeverityLevel,
      imageUrl: updated.image_url || undefined,
      status: updated.status as CommunityReportStatus,
      upvotes: updated.upvotes,
      timestamp: updated.timestamp,
    };

    sendSuccess(res, updatedReport);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// 6. DELETE /api/community-reports/:id
router.delete('/community-reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await db.get<any>('SELECT * FROM community_reports WHERE id = ?', [id]);
    if (!existing) {
      return sendError(res, `Community report '${id}' not found`, 404);
    }

    await db.run('DELETE FROM community_reports WHERE id = ?', [id]);
    sendSuccess(res, { message: `Report '${id}' deleted successfully` });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
