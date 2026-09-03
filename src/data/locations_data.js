/**
 * AEGIS ALERT - Comprehensive Multi-Hazard Environmental Dataset
 * Covers 9 strategic locations across India with high-fidelity simulated environmental variables.
 * Designed for SIH26001 - SIH26192 Multi-Hazard Demonstrations.
 *
 * NOTE: PROTOTYPE DEMO DATA - NOT FOR REAL-WORLD EMERGENCY DECISION MAKING
 */

export const LOCATIONS_DATA = [
  {
    id: "LOC-HYD",
    name: "Hyderabad",
    state: "Telangana",
    coordinates: [17.3850, 78.4867],
    elevation_m: 542,
    terrain: "Deccan Plateau Urban Basin",
    description: "High-density urban metropolis vulnerable to urban stormwater flooding, Musi river swell, lake overflow, and pre-monsoon convective thunderstorms.",
    primary_hazards: ["Urban Flood", "Heatwave", "Lightning"],
    current: {
      rainfall_mmh: 42.5,
      accumulated_24h_mm: 94.0,
      temperature_c: 34.2,
      humidity_pct: 78,
      wind_speed_kmh: 32.0,
      pressure_hpa: 1004.2,
      slope_deg: 4.2,
      drainage_proximity_m: 120,
      lightning_strikes_10m: 18,
      cape_index: 2450,
      pm25: 68,
      pm10: 112,
      aqi: 138,
      water_level_m: 4.8,
      danger_mark_m: 5.2,
      soil_moisture_pct: 82,
      population_exposed: 185000,
      vulnerable_habitations: 24,
      station_status: "NORMAL"
    },
    scenarios: {
      "normal": {
        rainfall_mmh: 2.0, accumulated_24h_mm: 12.0, temperature_c: 31.0, humidity_pct: 55,
        wind_speed_kmh: 14.0, lightning_strikes_10m: 0, pm25: 45, pm10: 75, water_level_m: 2.1, soil_moisture_pct: 40
      },
      "heavy_rain": {
        rainfall_mmh: 65.0, accumulated_24h_mm: 145.0, temperature_c: 26.5, humidity_pct: 92,
        wind_speed_kmh: 45.0, lightning_strikes_10m: 24, pm25: 28, pm10: 42, water_level_m: 4.9, soil_moisture_pct: 88
      },
      "flash_flood": {
        rainfall_mmh: 92.0, accumulated_24h_mm: 210.0, temperature_c: 24.0, humidity_pct: 98,
        wind_speed_kmh: 52.0, lightning_strikes_10m: 36, pm25: 18, pm10: 30, water_level_m: 5.8, soil_moisture_pct: 96
      },
      "thunderstorm": {
        rainfall_mmh: 48.0, accumulated_24h_mm: 70.0, temperature_c: 27.0, humidity_pct: 86,
        wind_speed_kmh: 68.0, lightning_strikes_10m: 58, cape_index: 3800, water_level_m: 3.8, soil_moisture_pct: 75
      },
      "heatwave": {
        rainfall_mmh: 0.0, accumulated_24h_mm: 0.0, temperature_c: 44.8, humidity_pct: 28,
        wind_speed_kmh: 22.0, lightning_strikes_10m: 0, pm25: 95, pm10: 160, water_level_m: 1.2, soil_moisture_pct: 18
      },
      "multi_hazard": {
        rainfall_mmh: 88.0, accumulated_24h_mm: 195.0, temperature_c: 25.0, humidity_pct: 95,
        wind_speed_kmh: 72.0, lightning_strikes_10m: 64, pm25: 110, pm10: 180, water_level_m: 5.6, soil_moisture_pct: 94
      }
    }
  },
  {
    id: "LOC-GHY",
    name: "Guwahati",
    state: "Assam",
    coordinates: [26.1445, 91.7362],
    elevation_m: 55,
    terrain: "Brahmaputra River Floodplain & Foothills",
    description: "Critical riverine basin subject to major Brahmaputra flooding, embankment breaches, river island inundation (Majuli), and hillside mudslides.",
    primary_hazards: ["Flash Flood", "Landslide", "Heavy Rainfall"],
    current: {
      rainfall_mmh: 68.4,
      accumulated_24h_mm: 182.0,
      temperature_c: 27.8,
      humidity_pct: 94,
      wind_speed_kmh: 38.0,
      pressure_hpa: 998.5,
      slope_deg: 28.5,
      drainage_proximity_m: 45,
      lightning_strikes_10m: 22,
      cape_index: 2800,
      pm25: 32,
      pm10: 54,
      aqi: 72,
      water_level_m: 106.8,
      danger_mark_m: 105.7,
      soil_moisture_pct: 94,
      population_exposed: 142000,
      vulnerable_habitations: 38,
      station_status: "NORMAL"
    }
  },
  {
    id: "LOC-DED",
    name: "Dehradun",
    state: "Uttarakhand",
    coordinates: [30.3165, 78.0322],
    elevation_m: 640,
    terrain: "Doon Valley Himalayan Foothills",
    description: "Himalayan fragile ecology exposed to violent cloudbursts, debris flows, riverbed flash surges (Rispana/Bindal), and slope instability.",
    primary_hazards: ["Landslide", "Cloudburst", "Flash Flood"],
    current: {
      rainfall_mmh: 78.0,
      accumulated_24h_mm: 215.0,
      temperature_c: 22.4,
      humidity_pct: 96,
      wind_speed_kmh: 42.0,
      pressure_hpa: 988.0,
      slope_deg: 38.0,
      drainage_proximity_m: 80,
      lightning_strikes_10m: 34,
      cape_index: 3100,
      pm25: 22,
      pm10: 38,
      aqi: 45,
      water_level_m: 6.2,
      danger_mark_m: 5.5,
      soil_moisture_pct: 96,
      population_exposed: 48000,
      vulnerable_habitations: 19,
      station_status: "NORMAL"
    }
  },
  {
    id: "LOC-VSP",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    coordinates: [17.6868, 83.2185],
    elevation_m: 45,
    terrain: "Eastern Ghats Coastal Seaboard",
    description: "Vulnerable to severe Bay of Bengal tropical cyclones, storm surge tidal ingress, coastal gale squalls, and industrial emission air trapping.",
    primary_hazards: ["Cyclone", "Air Pollution", "Heavy Rainfall"],
    current: {
      rainfall_mmh: 52.0,
      accumulated_24h_mm: 130.0,
      temperature_c: 30.5,
      humidity_pct: 88,
      wind_speed_kmh: 85.0,
      pressure_hpa: 992.0,
      slope_deg: 12.0,
      drainage_proximity_m: 60,
      lightning_strikes_10m: 14,
      cape_index: 2200,
      pm25: 115,
      pm10: 195,
      aqi: 220,
      water_level_m: 3.4,
      danger_mark_m: 3.8,
      soil_moisture_pct: 78,
      population_exposed: 210000,
      vulnerable_habitations: 31,
      station_status: "SENSOR_DRIFT"
    }
  },
  {
    id: "LOC-VJA",
    name: "Vijayawada",
    state: "Andhra Pradesh",
    coordinates: [16.5062, 80.6480],
    elevation_m: 22,
    terrain: "Krishna River Delta Plain & Low Ridges",
    description: "Susceptible to Prakasam Barrage discharge overtopping, Budameru rivulet flash inundation, extreme summer heat stress (>46°C), and lightning.",
    primary_hazards: ["Flood", "Heatwave", "Lightning"],
    current: {
      rainfall_mmh: 38.0,
      accumulated_24h_mm: 88.0,
      temperature_c: 39.5,
      humidity_pct: 72,
      wind_speed_kmh: 24.0,
      pressure_hpa: 1002.0,
      slope_deg: 6.0,
      drainage_proximity_m: 90,
      lightning_strikes_10m: 12,
      cape_index: 2600,
      pm25: 58,
      pm10: 98,
      aqi: 124,
      water_level_m: 12.4,
      danger_mark_m: 12.0,
      soil_moisture_pct: 74,
      population_exposed: 125000,
      vulnerable_habitations: 22,
      station_status: "NORMAL"
    }
  },
  {
    id: "LOC-SHL",
    name: "Shillong",
    state: "Meghalaya",
    coordinates: [25.5788, 91.8933],
    elevation_m: 1525,
    terrain: "High-Altitude Khasi Hills Plateau",
    description: "World's highest precipitation belt; acute vulnerability to high-velocity slope shear failure, road washouts, and valley isolation.",
    primary_hazards: ["Landslide", "Heavy Rainfall", "Thunderstorm"],
    current: {
      rainfall_mmh: 84.0,
      accumulated_24h_mm: 310.0,
      temperature_c: 18.2,
      humidity_pct: 98,
      wind_speed_kmh: 36.0,
      pressure_hpa: 845.0,
      slope_deg: 44.0,
      drainage_proximity_m: 150,
      lightning_strikes_10m: 28,
      cape_index: 2900,
      pm25: 14,
      pm10: 24,
      aqi: 28,
      water_level_m: 4.1,
      danger_mark_m: 3.8,
      soil_moisture_pct: 98,
      population_exposed: 32000,
      vulnerable_habitations: 16,
      station_status: "NORMAL"
    }
  },
  {
    id: "LOC-MUM",
    name: "Mumbai",
    state: "Maharashtra",
    coordinates: [19.0760, 72.8777],
    elevation_m: 14,
    terrain: "Coastal Lowland & Mithi River Basin",
    description: "Extreme urban density subject to simultaneous high-tide sea lock, Mithi river backflow, urban stormwater stagnation, and coastal lightning storms.",
    primary_hazards: ["Urban Flood", "Lightning", "Air Pollution"],
    current: {
      rainfall_mmh: 58.0,
      accumulated_24h_mm: 165.0,
      temperature_c: 29.2,
      humidity_pct: 92,
      wind_speed_kmh: 48.0,
      pressure_hpa: 1000.5,
      slope_deg: 2.5,
      drainage_proximity_m: 30,
      lightning_strikes_10m: 42,
      cape_index: 3400,
      pm25: 84,
      pm10: 142,
      aqi: 168,
      water_level_m: 4.6,
      danger_mark_m: 4.2,
      soil_moisture_pct: 90,
      population_exposed: 480000,
      vulnerable_habitations: 45,
      station_status: "NORMAL"
    }
  },
  {
    id: "LOC-CHE",
    name: "Chennai",
    state: "Tamil Nadu",
    coordinates: [13.0827, 80.2707],
    elevation_m: 6,
    terrain: "Coromandel Coastal Plain & Adyar/Cooum Basin",
    description: "Vulnerable to Northeast Monsoon depressions, Adyar/Cooum river basin inundation, severe coastal storm surges, and high ambient humidity heat index.",
    primary_hazards: ["Flood", "Cyclone", "Heatwave"],
    current: {
      rainfall_mmh: 48.0,
      accumulated_24h_mm: 118.0,
      temperature_c: 33.8,
      humidity_pct: 84,
      wind_speed_kmh: 55.0,
      pressure_hpa: 1003.0,
      slope_deg: 1.8,
      drainage_proximity_m: 40,
      lightning_strikes_10m: 16,
      cape_index: 2500,
      pm25: 62,
      pm10: 108,
      aqi: 132,
      water_level_m: 3.6,
      danger_mark_m: 3.5,
      soil_moisture_pct: 82,
      population_exposed: 310000,
      vulnerable_habitations: 34,
      station_status: "NORMAL"
    }
  },
  {
    id: "LOC-BLR",
    name: "Bengaluru",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946],
    elevation_m: 920,
    terrain: "Ridge-Valley System & Interconnected Lakes",
    description: "Valley-zone bottlenecks subject to stormwater drain overflow (Rajakaluves), Bellandur/Varthur lake cascade flooding, and intense evening convective lightning.",
    primary_hazards: ["Urban Flood", "Lightning", "Air Pollution"],
    current: {
      rainfall_mmh: 36.0,
      accumulated_24h_mm: 76.0,
      temperature_c: 28.4,
      humidity_pct: 74,
      wind_speed_kmh: 26.0,
      pressure_hpa: 915.0,
      slope_deg: 5.5,
      drainage_proximity_m: 75,
      lightning_strikes_10m: 38,
      cape_index: 3200,
      pm25: 48,
      pm10: 82,
      aqi: 98,
      water_level_m: 3.1,
      danger_mark_m: 3.4,
      soil_moisture_pct: 68,
      population_exposed: 160000,
      vulnerable_habitations: 20,
      station_status: "NORMAL"
    }
  }
];

export const VULNERABILITY_RED_ZONES = [
  {
    id: "ZONE-01",
    name: "Garmur–Kamlabari Embankment Sector",
    location: "Majuli, Assam",
    coordinates: [26.945, 94.210],
    population_exposure: 42000,
    vulnerable_habitations: 14,
    flood_risk: "CRITICAL (96%)",
    landslide_risk: "LOW (12%)",
    composite_risk: "CRITICAL",
    critical_infrastructure: ["Garmur Primary Substation", "Kamlabari Ferry Pier", "Major PWD Bund Road"],
    evacuation_corridor: "North-East elevated highland corridor to Garmur Relief Complex (+38m MSL)"
  },
  {
    id: "ZONE-02",
    name: "Chooralmala–Meppadi Hill Slopes",
    location: "Wayanad, Kerala",
    coordinates: [11.554, 76.126],
    population_exposure: 18500,
    vulnerable_habitations: 11,
    flood_risk: "HIGH (72%)",
    landslide_risk: "CRITICAL (98%)",
    composite_risk: "CRITICAL",
    critical_infrastructure: ["Meppadi Valley Bridge", "Primary Tea Plantation Quarters", "Hill Feeder Powerline"],
    evacuation_corridor: "Ridge evacuation path ascending to Meppadi Community Hospital Shelter"
  },
  {
    id: "ZONE-03",
    name: "Puri Coastal Tidal Corridor",
    location: "Puri, Odisha",
    coordinates: [19.798, 85.825],
    population_exposure: 120000,
    vulnerable_habitations: 28,
    flood_risk: "CRITICAL (92%)",
    landslide_risk: "LOW (05%)",
    composite_risk: "CRITICAL",
    critical_infrastructure: ["Marine Drive Coastal Highway", "Puri District Hospital", "Grid Feeder #3"],
    evacuation_corridor: "Inland Highway NH-316 to Concrete Multi-Purpose Cyclone Shelter #04"
  },
  {
    id: "ZONE-04",
    name: "Musi Riverbank Low-Lying Habitations",
    location: "Hyderabad, Telangana",
    coordinates: [17.375, 78.475],
    population_exposure: 65000,
    vulnerable_habitations: 18,
    flood_risk: "HIGH (78%)",
    landslide_risk: "LOW (08%)",
    composite_risk: "HIGH",
    critical_infrastructure: ["Moosarambagh Causeways", "Chaderghat Low-Bridge", "Water Works Pump House"],
    evacuation_corridor: "Amberpet Elevated Green Zone Community Hall"
  },
  {
    id: "ZONE-05",
    name: "Mandakini Valley Pilgrim Ridge",
    location: "Rudraprayag / Kedarnath, Uttarakhand",
    coordinates: [30.731, 78.441],
    population_exposure: 14200,
    vulnerable_habitations: 8,
    flood_risk: "HIGH (84%)",
    landslide_risk: "CRITICAL (91%)",
    composite_risk: "CRITICAL",
    critical_infrastructure: ["Gaurikund Trek Footbridge", "Helipad Ground Station", "Mountain Highway Route 107"],
    evacuation_corridor: "Highland bedrock spurs away from gorge flash path"
  },
  {
    id: "ZONE-06",
    name: "Mithi River Kurla–Bandra Inundation Basin",
    location: "Mumbai, Maharashtra",
    coordinates: [19.065, 72.868],
    population_exposure: 180000,
    vulnerable_habitations: 32,
    flood_risk: "CRITICAL (88%)",
    landslide_risk: "LOW (06%)",
    composite_risk: "HIGH",
    critical_infrastructure: ["Kurla Railway Junction Tracks", "Bandra-Kurla Complex Substation", "Airport Outfall"],
    evacuation_corridor: "Bandra Elevated Terminal & BMC Relief Schools"
  }
];

export const WEATHER_STATIONS_DATA = [
  { id: "STN-AWS-101", name: "Hyderabad Begumpet IMD AWS", lat: 17.453, lng: 78.467, status: "ONLINE", temp_c: 34.2, rain_mmh: 42.5, wind_kmh: 32.0, anomaly_detected: false, confidence: 99.4 },
  { id: "STN-AWS-102", name: "Guwahati Borjhar Met Observatory", lat: 26.106, lng: 91.585, status: "ONLINE", temp_c: 27.8, rain_mmh: 68.4, wind_kmh: 38.0, anomaly_detected: false, confidence: 98.9 },
  { id: "STN-AWS-103", name: "Visakhapatnam Dolphin Nose Coastal AWS", lat: 17.683, lng: 83.298, status: "DEGRADED", temp_c: 30.5, rain_mmh: 52.0, wind_kmh: 85.0, anomaly_detected: true, anomaly_type: "Sensor Drift (Barometric Sensor stuck at -8.2hPa offset)", confidence: 74.2 },
  { id: "STN-AWS-104", name: "Dehradun Forest Research Inst. AWS", lat: 30.342, lng: 77.998, status: "ONLINE", temp_c: 22.4, rain_mmh: 78.0, wind_kmh: 42.0, anomaly_detected: false, confidence: 99.1 },
  { id: "STN-AWS-105", name: "Wayanad Meppadi Hill Telemeter", lat: 11.554, lng: 76.126, status: "ONLINE", temp_c: 21.0, rain_mmh: 92.0, wind_kmh: 34.0, anomaly_detected: false, confidence: 99.6 },
  { id: "STN-AWS-106", name: "Mumbai Santacruz Doppler AWS", lat: 19.090, lng: 72.855, status: "ONLINE", temp_c: 29.2, rain_mmh: 58.0, wind_kmh: 48.0, anomaly_detected: false, confidence: 98.7 },
  { id: "STN-AWS-107", name: "Puri Marine Drive Coastal AWS", lat: 19.800, lng: 85.830, status: "ONLINE", temp_c: 28.5, rain_mmh: 64.0, wind_kmh: 94.0, anomaly_detected: false, confidence: 99.2 },
  { id: "STN-AWS-108", name: "Shillong Peak High Altitude AWS", lat: 25.535, lng: 91.850, status: "ONLINE", temp_c: 18.2, rain_mmh: 84.0, wind_kmh: 36.0, anomaly_detected: false, confidence: 98.4 },
  { id: "STN-AWS-109", name: "Vijayawada Gannavaram Met Station", lat: 16.530, lng: 80.796, status: "ONLINE", temp_c: 39.5, rain_mmh: 38.0, wind_kmh: 24.0, anomaly_detected: false, confidence: 99.0 },
  { id: "STN-AWS-110", name: "Bikaner Thar Desert High Heat AWS", lat: 28.022, lng: 73.311, status: "ONLINE", temp_c: 49.4, rain_mmh: 0.0, wind_kmh: 28.0, anomaly_detected: false, confidence: 99.5 }
];
