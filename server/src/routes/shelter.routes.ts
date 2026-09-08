import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { Shelter, EvacuationRoute } from '../../../shared';

const router = Router();

// GET /api/shelters
router.get('/shelters', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM shelters ORDER BY available_capacity DESC');
    const shelters: Shelter[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      location: r.location,
      coordinates: { lat: r.lat, lng: r.lng },
      totalCapacity: r.total_capacity,
      occupiedCapacity: r.occupied_capacity,
      availableCapacity: r.available_capacity,
      elevationMeters: r.elevation_meters,
      amenities: {
        drinkingWater: Boolean(r.drinking_water),
        medicalStation: Boolean(r.medical_station),
        powerBackup: Boolean(r.power_backup),
        foodSupply: Boolean(r.food_supply),
        sanitation: Boolean(r.sanitation),
      },
      contactPerson: r.contact_person,
      contactNumber: r.contact_number,
      status: r.status,
    }));
    sendSuccess(res, shelters, { total: shelters.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// GET /api/routes
router.get('/routes', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM evacuation_routes');
    const routes: EvacuationRoute[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      origin: { lat: r.origin_lat, lng: r.origin_lng },
      destination: { lat: r.destination_lat, lng: r.destination_lng },
      destinationShelterId: r.destination_shelter_id,
      distanceKm: r.distance_km,
      estimatedTimeMinutes: r.estimated_time_minutes,
      safetyStatus: r.safety_status,
      hazardsEnRoute: JSON.parse(r.hazards_en_route || '[]'),
      waypoints: JSON.parse(r.waypoints || '[]'),
      isSimulated: Boolean(r.is_simulated),
    }));
    sendSuccess(res, routes, { total: routes.length });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
