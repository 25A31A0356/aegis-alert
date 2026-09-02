/**
 * AegisAlert National Disaster Knowledge Base & Pan-India Theaters
 * National Emergency Operations Centre (NEOC) - Ministry of Home Affairs (MHA) & NDMA
 * Coordinates across all 28 States, 8 UTs, and 7 Central Ministries
 */

export const CONFIG = {
  SYSTEM_NAME: "AegisAlert National",
  SYSTEM_SUBTITLE: "Apex Multi-Ministry Disaster Early Warning & Life-Saving Command Grid of India",
  VERSION: "4.5.0-NATIONAL-APEX",
  APEX_BODY: "National Disaster Management Authority (NDMA) & Ministry of Home Affairs (MHA)",
  OPERATIONAL_HQ: "National Emergency Operations Centre (NEOC), New Delhi",
  DEFAULT_MAP_CENTER: [22.5, 82.0], // Centered on India
  DEFAULT_ZOOM: 5,

  // Verified Multi-Platform Data Sources
  DATA_PLATFORMS: [
    { name: "Open-Meteo API", type: "Global Meteorological & Radar", liveUrl: "https://api.open-meteo.com", verified: true },
    { name: "USGS Seismology", type: "Real-time Tectonic & Seismic Feed", liveUrl: "https://earthquake.usgs.gov", verified: true },
    { name: "NASA EONET", type: "Earth Observatory Natural Event Tracker", liveUrl: "https://eonet.gsfc.nasa.gov", verified: true },
    { name: "Central Water Commission (CWC)", type: "National 5,300-Dam Hydrographs", liveUrl: "https://cwc.gov.in", verified: true },
    { name: "IMD Pan-India Radar", type: "National Doppler Nowcasting Grid", liveUrl: "https://mausam.imd.gov.in", verified: true },
    { name: "ISRO / NESAC", type: "Space-Based Satellite Flood Inundation", liveUrl: "https://nesac.gov.in", verified: true }
  ],

  // Pan-India State-by-State Strategic Disaster Posture for NDMA Head
  ALL_INDIA_STATES_POSTURE: [
    { code: "AS", name: "Assam", status: "RED", hazard: "Brahmaputra Embankment Breach", populationAtRisk: "1.42 Lakh", ndrfUnits: "1st Bn (6 Teams)" },
    { code: "UK", name: "Uttarakhand", status: "ORANGE", hazard: "Char Dham Cloudburst & Debris", populationAtRisk: "68,000", ndrfUnits: "Army Engineers + 8th Bn" },
    { code: "OD", name: "Odisha", status: "RED", hazard: "Bay of Bengal Super Cyclone Surge", populationAtRisk: "2.60 Lakh", ndrfUnits: "3rd Bn + Coast Guard" },
    { code: "MH", name: "Maharashtra", status: "ORANGE", hazard: "High-Tide Urban Estuary Inundation", populationAtRisk: "3.10 Lakh", ndrfUnits: "5th Bn Pune" },
    { code: "KL", name: "Kerala", status: "YELLOW", hazard: "Western Ghats Flash Runoff", populationAtRisk: "42,000", ndrfUnits: "4th Bn Arakkonam" },
    { code: "HP", name: "Himachal Pradesh", status: "ORANGE", hazard: "Beas Basin Landslide Cutoff", populationAtRisk: "35,000", ndrfUnits: "14th Bn Jaspur" },
    { code: "WB", name: "West Bengal", status: "ORANGE", hazard: "Sundarbans Tidal Crest", populationAtRisk: "1.15 Lakh", ndrfUnits: "2nd Bn Haringhata" },
    { code: "GJ", name: "Gujarat", status: "YELLOW", hazard: "Kutch Coastal Low Pressure", populationAtRisk: "28,000", ndrfUnits: "6th Bn Vadodara" },
    { code: "AP", name: "Andhra Pradesh", status: "ORANGE", hazard: "Godavari Downstream Surge", populationAtRisk: "85,000", ndrfUnits: "10th Bn Vijayawada" },
    { code: "SK", name: "Sikkim", status: "RED", hazard: "Teesta Glacial Lake Moraine Breach", populationAtRisk: "22,000", ndrfUnits: "NDRF + Army Eastern Cmd" }
  ],

  // 4 Pan-India Theaters
  SCENARIOS: [
    {
      id: "assam_brahmaputra_surge",
      theater: "EASTERN & NORTH-EASTERN THEATER",
      title: "Brahmaputra Basin Flood & Embankment Breach (Assam / NE)",
      type: "FLASH_FLOOD",
      coordinates: [26.6528, 92.7926],
      zoom: 8,
      leadMinistry: "MHA (NDMA) + MDoNER + Ministry of Jal Shakti",
      telemetry: {
        rainfall1h: 52.0,
        rainfall24h: 245.0,
        riverLevel: 86.8,
        riverDangerMark: 85.5,
        damCapacity: 94.0,
        windSpeed: 38
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 35,
        floodWaveSpeedKmh: 20,
        recommendedAction: "National Executive Committee (NEC) alert: Task IAF Eastern Air Command (Mi-17s) from Tezpur. Pre-position NDRF 1st & 12th Battalions with 40 inflatable zodiacs.",
        impactedPopulation: 142000,
        safeShelter: "Garmur Elevated Multi-Purpose Highland Complex (+28m Elevation)"
      }
    },
    {
      id: "himalayan_cloudburst_surge",
      theater: "NORTHERN HIMALAYAN THEATER",
      title: "Himalayan Cloudburst & Flash Flood (Kedarnath / Uttarkashi / HP)",
      type: "FLASH_FLOOD",
      coordinates: [30.7268, 78.4354],
      zoom: 9,
      leadMinistry: "MHA (NDMA) + MoD (Indian Army Central Command) + MoES",
      telemetry: {
        rainfall1h: 88.0,
        rainfall24h: 340.0,
        riverLevel: 44.5,
        riverDangerMark: 41.0,
        damCapacity: 91.2,
        windSpeed: 45
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 20,
        floodWaveSpeedKmh: 42,
        recommendedAction: "Activate Op Sadbhavana: Task Indian Army Corps of Engineers (Bailey Bridge erection). Divert Char Dham pilgrim traffic to designated high-altitude camps.",
        impactedPopulation: 68000,
        safeShelter: "Uttarkashi Elevated Sports Complex & Administrative Safe Ground"
      }
    },
    {
      id: "bay_of_bengal_super_cyclone",
      theater: "SOUTHERN & EASTERN COASTAL THEATER",
      title: "Bay of Bengal Severe Super Cyclone (Puri Coast to Andhra)",
      type: "CYCLONE",
      coordinates: [19.8135, 85.8312],
      zoom: 8,
      leadMinistry: "MHA (NDMA) + Indian Navy (Eastern Fleet) + Indian Coast Guard",
      telemetry: {
        rainfall1h: 65.0,
        rainfall24h: 380.0,
        centralPressure: 948,
        windSpeed: 175,
        stormSurgeHeight: 4.2
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 60,
        floodWaveSpeedKmh: 55,
        recommendedAction: "Issue National Cell Broadcast warning to all 6 coastal districts. Mobilize Indian Coast Guard offshore patrol vessels for fisherman safety. Evacuate low-lying coastal belts.",
        impactedPopulation: 260000,
        safeShelter: "Puri Multi-Purpose Cyclone Shelter Network (#01 to #24)"
      }
    },
    {
      id: "western_ghats_mumbai_inundation",
      theater: "WESTERN PENINSULAR THEATER",
      title: "Western Ghats Intense Cloudburst & Urban Estuary Surge (Mumbai / Konkan)",
      type: "FLASH_FLOOD",
      coordinates: [18.9220, 72.8347],
      zoom: 9,
      leadMinistry: "MHA (NDMA) + Ministry of Railways + Maharashtra SDMA",
      telemetry: {
        rainfall1h: 92.0,
        rainfall24h: 390.0,
        riverLevel: 6.8,
        riverDangerMark: 5.2,
        highTideMeter: 4.85,
        damCapacity: 98.2
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 15,
        floodWaveSpeedKmh: 28,
        recommendedAction: "High-tide sync flash flood alert: Close railway low causeways. Regulate Khadakwasla & Tansa dam discharges. Pre-position NDRF 5th Battalion (Pune).",
        impactedPopulation: 310000,
        safeShelter: "Bandra Elevated Disaster Evacuation Center"
      }
    }
  ],

  DEPLOYED_BEACONS: [
    { id: "BEACON-NE-01", name: "Majuli Ferry Ghat Mast (Assam)", lat: 26.9450, lng: 94.2100, status: "ONLINE", battery: 98, theater: "EASTERN" },
    { id: "BEACON-SK-01", name: "Chungthang Teesta Mast (Sikkim)", lat: 27.6040, lng: 88.6470, status: "ONLINE", battery: 94, theater: "EASTERN" },
    { id: "BEACON-UK-01", name: "Uttarkashi Town Mast (Uttarakhand)", lat: 30.7310, lng: 78.4410, status: "ONLINE", battery: 92, theater: "NORTHERN" },
    { id: "BEACON-OD-01", name: "Puri Coastal Lightpost (Odisha)", lat: 19.7983, lng: 85.8249, status: "ONLINE", battery: 99, theater: "SOUTHERN" },
    { id: "BEACON-MH-01", name: "Mumbai Estuary Mast (Maharashtra)", lat: 19.0760, lng: 72.8777, status: "ONLINE", battery: 96, theater: "WESTERN" },
    { id: "BEACON-KL-01", name: "Wayanad Valley Mast (Kerala)", lat: 11.5540, lng: 76.1265, status: "ONLINE", battery: 97, theater: "SOUTHERN" }
  ]
};
