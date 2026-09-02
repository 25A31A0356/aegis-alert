/**
 * AegisAlert National Multi-Hazard Knowledge Base & Pan-India Theaters
 * National Emergency Operations Centre (NEOC) - Ministry of Home Affairs (MHA) & NDMA
 * Supports 7 Major Disasters: Floods, Landslides, Cloudbursts, Cyclones/Toofans, Tornados, Heatwaves, Earthquakes
 */

export const CONFIG = {
  SYSTEM_NAME: "AegisAlert National",
  SYSTEM_SUBTITLE: "Apex Multi-Ministry Disaster Early Warning & Life-Saving Command Grid of India",
  VERSION: "5.0.0-ALL-HAZARD",
  APEX_BODY: "National Disaster Management Authority (NDMA) & Ministry of Home Affairs (MHA)",
  OPERATIONAL_HQ: "National Emergency Operations Centre (NEOC), New Delhi",
  DEFAULT_MAP_CENTER: [22.5, 82.0],
  DEFAULT_ZOOM: 5,

  // Verified Multi-Platform Data Sources
  DATA_PLATFORMS: [
    { name: "Open-Meteo API", type: "Global Meteorological & Heatwave Index", liveUrl: "https://api.open-meteo.com", verified: true },
    { name: "USGS Seismology", type: "Real-time Tectonic & Seismic Feed", liveUrl: "https://earthquake.usgs.gov", verified: true },
    { name: "NASA EONET", type: "Earth Observatory Natural Event Tracker", liveUrl: "https://eonet.gsfc.nasa.gov", verified: true },
    { name: "Central Water Commission (CWC)", type: "National 5,300-Dam Hydrographs", liveUrl: "https://cwc.gov.in", verified: true },
    { name: "IMD Doppler Radar", type: "Tornado, Cyclone & Cloudburst Nowcasting", liveUrl: "https://mausam.imd.gov.in", verified: true },
    { name: "Geological Survey of India (GSI)", type: "National Landslide Early Warning (NLWS)", liveUrl: "https://gsi.gov.in", verified: true }
  ],

  // Pan-India State Posture across multiple disasters
  ALL_INDIA_STATES_POSTURE: [
    { code: "AS", name: "Assam", status: "RED", hazard: "Brahmaputra Embankment Breach (Flood)", populationAtRisk: "1.42 Lakh", ndrfUnits: "1st Bn (6 Teams)" },
    { code: "KL", name: "Kerala", status: "RED", hazard: "Wayanad Slope Failure & Mudflow (Landslide)", populationAtRisk: "54,000", ndrfUnits: "4th Bn + Madras Regt" },
    { code: "UK", name: "Uttarakhand", status: "RED", hazard: "Kedarnath 110mm/hr Torrent (Cloudburst)", populationAtRisk: "68,000", ndrfUnits: "Army Engineers + 8th Bn" },
    { code: "OD", name: "Odisha", status: "RED", hazard: "Super Cyclone 185km/h Landfall (Toofan)", populationAtRisk: "2.60 Lakh", ndrfUnits: "3rd Bn + Coast Guard" },
    { code: "WB", name: "West Bengal", status: "ORANGE", hazard: "Kalbaishakhi 190km/h Vortex (Tornado)", populationAtRisk: "95,000", ndrfUnits: "2nd Bn Haringhata" },
    { code: "RJ", name: "Rajasthan", status: "RED", hazard: "49.4°C Scorching Heat Emergency (Heatwave)", populationAtRisk: "4.20 Lakh", ndrfUnits: "Civil Defense & Health" },
    { code: "MH", name: "Maharashtra", status: "ORANGE", hazard: "High-Tide Urban Estuary Inundation", populationAtRisk: "3.10 Lakh", ndrfUnits: "5th Bn Pune" },
    { code: "HP", name: "Himachal Pradesh", status: "ORANGE", hazard: "Beas Valley Highway Rockslide (Landslide)", populationAtRisk: "35,000", ndrfUnits: "14th Bn Jaspur" },
    { code: "DL", name: "Delhi NCR", status: "RED", hazard: "48.2°C Thermal Heatstroke Alert (Heatwave)", populationAtRisk: "5.80 Lakh", ndrfUnits: "SDMA Cooling Network" },
    { code: "AP", name: "Andhra Pradesh", status: "ORANGE", hazard: "Godavari Downstream Surge", populationAtRisk: "85,000", ndrfUnits: "10th Bn Vijayawada" }
  ],

  // 7 Multi-Hazard Scenarios Covering India
  SCENARIOS: [
    {
      id: "assam_brahmaputra_surge",
      theater: "EASTERN THEATER",
      hazardBadge: "🌊 FLOOD & EMBANKMENT BREACH",
      title: "Brahmaputra Basin Flood & Majuli Breach (Assam)",
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
        recommendedAction: "Evacuate 14 riverine chaporis to elevated highland (+28m). Pre-position NDRF 1st Battalion with 40 inflatable zodiacs.",
        impactedPopulation: 142000,
        safeShelter: "Garmur Elevated Multi-Purpose Highland Complex (+28m Elevation)"
      }
    },
    {
      id: "wayanad_mountain_landslide",
      theater: "SOUTHERN WESTERN GHATS",
      hazardBadge: "⛰️ MOUNTAIN LANDSLIDE & DEBRIS FLOW",
      title: "Wayanad Slope Collapse & Mudflow Surge (Kerala)",
      type: "LANDSLIDE",
      coordinates: [11.5540, 76.1265],
      zoom: 10,
      leadMinistry: "MHA (NDMA) + Geological Survey of India (GSI) + Indian Army",
      telemetry: {
        rainfall24h: 310.0,
        rainfall72h: 580.0, // Massive saturation
        slopeAngle: 42, // Extreme slope
        porePressureKPa: 56, // Critical soil saturation
        windSpeed: 40
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 20,
        floodWaveSpeedKmh: 45,
        recommendedAction: "Critical slope failure detected above Chooralmala. Evacuate downstream valley settlements perpendicular to riverbed immediately.",
        impactedPopulation: 54000,
        safeShelter: "Meppadi Community Elevated Relief Camp (+45m Elevation)"
      }
    },
    {
      id: "kedarnath_intense_cloudburst",
      theater: "NORTHERN HIMALAYAN THEATER",
      hazardBadge: "⛈️ EXTREME CLOUDBURST (>100mm/hr)",
      title: "Kedarnath & Mandakini River Intense Cloudburst (Uttarakhand)",
      type: "CLOUDBURST",
      coordinates: [30.7268, 78.4354],
      zoom: 9,
      leadMinistry: "MHA (NDMA) + MoD (Indian Army Central Command) + MoES",
      telemetry: {
        rainfall1h: 112.0, // True cloudburst (>100mm/h)
        rainfall15m: 38.0,
        flashSurgeVelocityKmh: 48,
        windSpeed: 45
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 12,
        floodWaveSpeedKmh: 48,
        recommendedAction: "Torrential mountain runoff active. Sound valley warning beacons. Direct pilgrims to high ridge lines above Mandakini gorge.",
        impactedPopulation: 68000,
        safeShelter: "Uttarkashi Elevated Sports Complex & Administrative Safe Ground"
      }
    },
    {
      id: "bay_of_bengal_super_cyclone",
      theater: "EASTERN COASTAL THEATER",
      hazardBadge: "🌀 SUPER CYCLONE & TOOFAN (185 km/h)",
      title: "Bay of Bengal Super Cyclone Landfall (Puri to Andhra)",
      type: "CYCLONE",
      coordinates: [19.8135, 85.8312],
      zoom: 8,
      leadMinistry: "MHA (NDMA) + Indian Navy (Eastern Fleet) + Coast Guard",
      telemetry: {
        windSpeed: 185, // Destructive Toofan
        centralPressure: 938, // Severe depression
        stormSurgeHeight: 4.8,
        rainfall24h: 380.0
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 60,
        floodWaveSpeedKmh: 55,
        recommendedAction: "Category 5 equivalent landfall. Complete evacuation within 5km of coastline to reinforced concrete cyclone shelters.",
        impactedPopulation: 260000,
        safeShelter: "Puri Multi-Purpose Cyclone Shelter Network (#01 to #24)"
      }
    },
    {
      id: "bengal_violent_tornado",
      theater: "EASTERN GANGETIC PLAINS",
      hazardBadge: "🌪️ TORNADO & VIOLENT SQUALL (KALBAISHAKHI)",
      title: "Bengal & Odisha Severe Convective Tornado Squall (Kalbaishakhi)",
      type: "TORNADO",
      coordinates: [22.9868, 87.8550],
      zoom: 9,
      leadMinistry: "MHA (NDMA) + IMD Radar Network + West Bengal SDMA",
      telemetry: {
        vortexWindSpeed: 195, // km/h rotating funnel
        radarReflectivityDbz: 71, // Intense hook echo
        lightningFlashesPerMin: 155,
        centralPressure: 980
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 8,
        floodWaveSpeedKmh: 65,
        recommendedAction: "Tornado touchdown alert. Sound 120dB immediate alarms. Direct citizens to interior windowless ground rooms, away from tin roofs.",
        impactedPopulation: 95000,
        safeShelter: "Burdwan District Concrete Civil Defense Hall"
      }
    },
    {
      id: "rajasthan_extreme_heatwave",
      theater: "WESTERN ARID BELT",
      hazardBadge: "☀️ EXTREME HEATWAVE & THERMAL EMERGENCY (49.4°C)",
      title: "North-Western Severe Heatwave Emergency (Rajasthan / Delhi / Vidarbha)",
      type: "HEATWAVE",
      coordinates: [28.0229, 73.3119], // Bikaner, Rajasthan
      zoom: 8,
      leadMinistry: "MHA (NDMA) + Ministry of Health & Family Welfare + MoES",
      telemetry: {
        temperatureMax: 49.4, // Extreme heat
        normalClimateTemp: 41.5,
        relativeHumidity: 18,
        windSpeed: 28 // Hot dry Loo wind
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 0,
        floodWaveSpeedKmh: 0,
        recommendedAction: "Code Red Heat Emergency. Prohibit outdoor labor 11 AM - 4:30 PM. Open 24/7 Air-Cooled Hydration Centers with ORS and ice wards.",
        impactedPopulation: 420000,
        safeShelter: "Bikaner 24/7 Air-Cooled District Emergency Cooling Complex"
      }
    },
    {
      id: "himalayan_seismic_rupture",
      theater: "NORTHERN HIMALAYAS",
      hazardBadge: "⚡ M7.1 SEISMIC FAULT RUPTURE",
      title: "Main Central Thrust Severe Earthquake (Uttarakhand / Himachal)",
      type: "EARTHQUAKE",
      coordinates: [30.4000, 78.8000],
      zoom: 8,
      leadMinistry: "MHA (NDMA) + National Center for Seismology + NDRF USAR",
      telemetry: {
        magnitude: 7.1,
        depthKm: 10, // Very shallow
        windSpeed: 10
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 0,
        floodWaveSpeedKmh: 0,
        recommendedAction: "Major fault rupture. Direct 'Drop, Cover, and Hold On'. Automatically shut down gas distribution and railway corridors.",
        impactedPopulation: 350000,
        safeShelter: "Dehradun Parade Ground Open-Air Assembly Safe Zone"
      }
    }
  ],

  DEPLOYED_BEACONS: [
    { id: "BEACON-NE-01", name: "Majuli Ferry Ghat Mast (Assam - Flood)", lat: 26.9450, lng: 94.2100, status: "ONLINE", battery: 98, theater: "EASTERN" },
    { id: "BEACON-KL-01", name: "Wayanad Slope Sensor Mast (Kerala - Landslide)", lat: 11.5540, lng: 76.1265, status: "ONLINE", battery: 97, theater: "SOUTHERN" },
    { id: "BEACON-UK-01", name: "Kedarnath Gorge Mast (Uttarakhand - Cloudburst)", lat: 30.7310, lng: 78.4410, status: "ONLINE", battery: 92, theater: "NORTHERN" },
    { id: "BEACON-OD-01", name: "Puri Coastal Lightpost (Odisha - Cyclone)", lat: 19.7983, lng: 85.8249, status: "ONLINE", battery: 99, theater: "EASTERN" },
    { id: "BEACON-WB-01", name: "Burdwan Radar Mast (West Bengal - Tornado)", lat: 23.2324, lng: 87.8615, status: "ONLINE", battery: 95, theater: "EASTERN" },
    { id: "BEACON-RJ-01", name: "Bikaner Solar Thermal Kiosk (Rajasthan - Heatwave)", lat: 28.0229, lng: 73.3119, status: "ONLINE", battery: 100, theater: "WESTERN" }
  ]
};
