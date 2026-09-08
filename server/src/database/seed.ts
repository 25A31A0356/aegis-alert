import { Database } from './db';

export async function seedDatabase(db: Database): Promise<void> {
  try {
    // Check if alerts already exist
    const existingAlerts = await db.all('SELECT id FROM alerts LIMIT 1');
    if (existingAlerts && existingAlerts.length > 0) {
      return; // Already seeded
    }

    console.log('[DATABASE] Seeding initial realistic emergency data...');

    // 1. Seed User Profile
    await db.run(
      `INSERT OR IGNORE INTO users (
        id, name, phone, blood_group, medical_conditions, emergency_contact_name,
        emergency_contact_phone, emergency_contact_relation, preferred_language,
        city, state, pincode, auto_detect_location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'usr_default_01',
        'Sai Teja',
        '+91 98765 43210',
        'O+ Positive',
        JSON.stringify(['Asthma (Inhaler needed)']),
        'Kalyan Kumar (Father)',
        '+91 98765 00001',
        'Father',
        'en',
        'Visakhapatnam',
        'Andhra Pradesh',
        '530001',
        1,
      ]
    );

    // 2. Seed Realistic Alerts
    await db.run(
      `INSERT INTO alerts (
        id, title, hazard_type, severity, urgency, headline, description,
        instruction, affected_regions, effective_from, expires_at, issued_by, is_live, lat, lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'alt_flood_01',
        'Severe Flash Flood & Coastal Inundation Warning',
        'Flood',
        'RED',
        'Immediate',
        'Catastrophic rainfall exceeding 180mm/6h with high tide storm surge.',
        'Low-lying coastal zones and drainage basins in Visakhapatnam are experiencing rapid inundation. NDRF flood rescue teams deployed.',
        'Evacuate immediately to designated high-ground multi-purpose cyclone shelters. Do not drive through flooded roads or underpasses.',
        JSON.stringify(['Visakhapatnam Coastal Sector', 'Rushikonda Lowlands', 'Gajuwaka Basin']),
        new Date().toISOString(),
        new Date(Date.now() + 86400000 * 2).toISOString(),
        'State Disaster Management Authority (SDMA) & IMD',
        0,
        17.6868,
        83.2185,
      ]
    );

    await db.run(
      `INSERT INTO alerts (
        id, title, hazard_type, severity, urgency, headline, description,
        instruction, affected_regions, effective_from, expires_at, issued_by, is_live, lat, lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'alt_cyclone_02',
        'Severe Cyclonic Storm Alert (Category 3)',
        'Cyclone',
        'ORANGE',
        'Expected',
        'Cyclone approaching coast with sustained winds 110-120 km/h.',
        'High wind gusts expected to cause structural damage to thatched roofs, uproot trees, and snap overhead power lines.',
        'Secure loose outdoor items. Store 72 hours of clean drinking water and dry rations. Keep mobile devices and power banks fully charged.',
        JSON.stringify(['Bheemunipatnam', 'Anakapalli', 'Kakinada Belt']),
        new Date().toISOString(),
        new Date(Date.now() + 86400000 * 3).toISOString(),
        'India Meteorological Department (IMD Cyclone Warning Center)',
        0,
        17.8868,
        83.4185,
      ]
    );

    // 3. Seed Shelters
    await db.run(
      `INSERT INTO shelters (
        id, name, type, location, lat, lng, total_capacity, occupied_capacity, available_capacity,
        elevation_meters, drinking_water, medical_station, power_backup, food_supply, sanitation,
        contact_person, contact_number, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'shl_01',
        'APSDMA Central Multi-Purpose Cyclone Relief Shelter',
        'Government Cyclone Shelter',
        'Hilltop Rd, Kailasagiri Sector, Visakhapatnam',
        17.7495,
        83.3422,
        850,
        240,
        610,
        48.5,
        1,
        1,
        1,
        1,
        1,
        'Capt. R. Sharma (Relief Officer)',
        '+91 891 2568901',
        'OPEN',
      ]
    );

    await db.run(
      `INSERT INTO shelters (
        id, name, type, location, lat, lng, total_capacity, occupied_capacity, available_capacity,
        elevation_meters, drinking_water, medical_station, power_backup, food_supply, sanitation,
        contact_person, contact_number, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'shl_02',
        'St. Aloysius High-Ground Emergency Center',
        'School / College',
        'Beach Rd Elevated Campus, Old Town',
        17.6975,
        83.2985,
        500,
        180,
        320,
        32.0,
        1,
        1,
        1,
        1,
        1,
        'Dr. V. Prasad (Civil Medical Officer)',
        '+91 891 2568902',
        'OPEN',
      ]
    );

    // 4. Seed Evacuation Route
    await db.run(
      `INSERT INTO evacuation_routes (
        id, name, origin_lat, origin_lng, destination_lat, destination_lng,
        destination_shelter_id, distance_km, estimated_time_minutes, safety_status,
        hazards_en_route, waypoints, is_simulated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'rte_01',
        'Ridge Highway to APSDMA Cyclone Shelter',
        17.6868,
        83.2185,
        17.7495,
        83.3422,
        'shl_01',
        6.4,
        18,
        'Recommended Route',
        JSON.stringify(['Elevated ridge path avoiding waterlogged Beach Road underpasses']),
        JSON.stringify([
          [17.6868, 83.2185],
          [17.705, 83.25],
          [17.728, 83.3],
          [17.7495, 83.3422],
        ]),
        1,
      ]
    );

    // 5. Seed Notifications
    await db.run(
      `INSERT INTO notifications (id, type, title, message, severity, is_read, link_action, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'notif_01',
        'DISASTER_ALERT',
        'RED ALERT: Flood Risk High in Your Sector',
        'Severe rainfall warning active for next 24 hours. Check nearby shelter availability.',
        'CRITICAL',
        0,
        'safe_evacuation',
        new Date().toISOString(),
      ]
    );

    await db.run(
      `INSERT INTO notifications (id, type, title, message, severity, is_read, link_action, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'notif_02',
        'SHELTER_UPDATE',
        'APSDMA Central Shelter has 610 beds open',
        'Drinking water, medical triage, and power backup fully operational.',
        'LOW',
        1,
        'safe_evacuation',
        new Date(Date.now() - 3600000).toISOString(),
      ]
    );

    // 6. Seed Downloadable Resources
    await db.run(
      `INSERT INTO downloads (id, title, category, size_bytes, size_formatted, status, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'dl_01',
        'NDMA Flood & Cyclone Offline Survival Protocols',
        'Survival Guide',
        1048576,
        '1.0 MB',
        'Downloaded',
        new Date().toISOString(),
      ]
    );

    await db.run(
      `INSERT INTO downloads (id, title, category, size_bytes, size_formatted, status, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'dl_02',
        'Visakhapatnam District Offline Topographic & Shelter Map',
        'Offline Maps',
        3670016,
        '3.5 MB',
        'Available',
        new Date().toISOString(),
      ]
    );

    await db.run(
      `INSERT INTO downloads (id, title, category, size_bytes, size_formatted, status, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'dl_03',
        '72-Hour Family Disaster Emergency Checklist',
        'Emergency Checklist',
        524288,
        '512 KB',
        'Downloaded',
        new Date().toISOString(),
      ]
    );

    console.log('[DATABASE] Initial realistic data seeded successfully.');
  } catch (error: any) {
    console.error('[DATABASE] Seed failed:', error.message);
  }
}
