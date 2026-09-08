import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { UserProfile } from '../../../shared';

const router = Router();

// GET /api/profile
router.get('/profile', async (_req: Request, res: Response) => {
  try {
    const r = await db.get<any>('SELECT * FROM users LIMIT 1');
    if (!r) {
      return sendError(res, 'Profile not found', 404);
    }
    const profile: UserProfile = {
      id: r.id,
      name: r.name,
      phone: r.phone,
      bloodGroup: r.blood_group,
      medicalConditions: JSON.parse(r.medical_conditions || '[]'),
      emergencyContact: {
        name: r.emergency_contact_name,
        phone: r.emergency_contact_phone,
        relationship: r.emergency_contact_relation,
      },
      preferredLanguage: r.preferred_language || 'en',
      locationPreferences: {
        city: r.city,
        state: r.state,
        pincode: r.pincode,
        autoDetect: Boolean(r.auto_detect_location),
      },
    };
    sendSuccess(res, profile);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// PUT /api/profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const { name, phone, bloodGroup, medicalConditions, emergencyContact, preferredLanguage, locationPreferences } =
      req.body;

    const safeName = name || req.body.fullName || null;
    const safeBloodGroup = bloodGroup || req.body.blood_group || null;

    await db.run(
      `UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        blood_group = COALESCE(?, blood_group),
        medical_conditions = COALESCE(?, medical_conditions),
        emergency_contact_name = COALESCE(?, emergency_contact_name),
        emergency_contact_phone = COALESCE(?, emergency_contact_phone),
        emergency_contact_relation = COALESCE(?, emergency_contact_relation),
        preferred_language = COALESCE(?, preferred_language),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        pincode = COALESCE(?, pincode),
        auto_detect_location = COALESCE(?, auto_detect_location),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = 'usr_default_01'`,
      [
        safeName,
        phone,
        safeBloodGroup,
        medicalConditions ? JSON.stringify(medicalConditions) : null,
        emergencyContact?.name,
        emergencyContact?.phone,
        emergencyContact?.relationship,
        preferredLanguage,
        locationPreferences?.city,
        locationPreferences?.state,
        locationPreferences?.pincode,
        locationPreferences?.autoDetect !== undefined ? (locationPreferences.autoDetect ? 1 : 0) : null,
      ]
    );

    const updated = await db.get<any>('SELECT * FROM users WHERE id = "usr_default_01"');
    const profile: UserProfile = {
      id: updated.id,
      name: updated.name,
      phone: updated.phone,
      bloodGroup: updated.blood_group,
      medicalConditions: JSON.parse(updated.medical_conditions || '[]'),
      emergencyContact: {
        name: updated.emergency_contact_name,
        phone: updated.emergency_contact_phone,
        relationship: updated.emergency_contact_relation,
      },
      preferredLanguage: updated.preferred_language || 'en',
      locationPreferences: {
        city: updated.city,
        state: updated.state,
        pincode: updated.pincode,
        autoDetect: Boolean(updated.auto_detect_location),
      },
    };

    sendSuccess(res, profile);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
