/**
 * AEGIS ALERT - Pan-India Multi-Hazard Environmental Dataset
 * Covers all 28 States, National Capital Territory of Delhi, and Major Union Territories of India.
 * Implements real-time coordinates, terrain classifications, air pollution baselines, and disaster histories.
 * Designed for SIH26001 - SIH26192 Multi-Hazard Situational Awareness.
 */

export const LOCATIONS_DATA = [
  // =========================================================================
  // 1. TELANGANA (South-Central Deccan)
  // =========================================================================
  {
    id: "LOC-TG-HYD",
    name: "Hyderabad",
    state: "Telangana",
    coordinates: [17.3850, 78.4867],
    elevation_m: 542,
    terrain: "Deccan Plateau Urban Basin",
    description: "High-density metropolis vulnerable to Musi River overflow, Hussain Sagar stormwater inundation, and severe convective lightning strikes.",
    primary_hazards: ["Urban Flood", "Lightning", "Heatwave"],
    historical_disasters: "2000 & 2020 Hyderabad Flash Floods (190mm in 24h, 80+ casualties)",
    current: {
      rainfall_mmh: 42.5, accumulated_24h_mm: 94.0, temperature_c: 33.2, humidity_pct: 74,
      wind_speed_kmh: 24.0, pressure_hpa: 1006.2, slope_deg: 4.2, drainage_proximity_m: 120,
      lightning_strikes_10m: 18, cape_index: 2450, pm25: 58, pm10: 98, aqi: 128,
      water_level_m: 4.8, danger_mark_m: 5.2, soil_moisture_pct: 78,
      population_exposed: 185000, vulnerable_habitations: 24, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 2. ANDHRA PRADESH (Bay of Bengal Coastal Corridor)
  // =========================================================================
  {
    id: "LOC-AP-VSP",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    coordinates: [17.6868, 83.2185],
    elevation_m: 45,
    terrain: "Eastern Ghats Coastal Ingress",
    description: "Deep-water seaport and industrial hub prone to severe cyclonic surges (Category 4/5), coastal storm surges, and chemical industrial dispersion.",
    primary_hazards: ["Cyclone & Storm Surge", "Heavy Rainfall", "Industrial Air Hazard"],
    historical_disasters: "2014 Super Cyclone Hudhud (260 km/h winds, ₹21,000 Cr damage)",
    current: {
      rainfall_mmh: 28.0, accumulated_24h_mm: 88.0, temperature_c: 32.5, humidity_pct: 85,
      wind_speed_kmh: 42.0, pressure_hpa: 1002.5, slope_deg: 8.5, drainage_proximity_m: 80,
      lightning_strikes_10m: 14, cape_index: 2800, pm25: 64, pm10: 105, aqi: 135,
      water_level_m: 3.8, danger_mark_m: 4.5, soil_moisture_pct: 82,
      population_exposed: 240000, vulnerable_habitations: 38, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 3. ANDHRA PRADESH - KRISHNA BASIN
  // =========================================================================
  {
    id: "LOC-AP-VJA",
    name: "Vijayawada",
    state: "Andhra Pradesh",
    coordinates: [16.5062, 80.6480],
    elevation_m: 39,
    terrain: "Krishna Delta Floodplain",
    description: "Prakasam Barrage catchment area subject to sudden heavy river influx, Budameru rivulet overflow, and agricultural inundation.",
    primary_hazards: ["Riverine Flood", "Extreme Heatwave", "Thunderstorm"],
    historical_disasters: "2009 & 2024 Krishna River Mega-Floods (11.8 Lakh cusecs inflow)",
    current: {
      rainfall_mmh: 36.0, accumulated_24h_mm: 110.0, temperature_c: 34.0, humidity_pct: 82,
      wind_speed_kmh: 28.0, pressure_hpa: 1004.8, slope_deg: 3.1, drainage_proximity_m: 60,
      lightning_strikes_10m: 16, cape_index: 2600, pm25: 52, pm10: 88, aqi: 115,
      water_level_m: 4.9, danger_mark_m: 5.4, soil_moisture_pct: 86,
      population_exposed: 195000, vulnerable_habitations: 32, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 4. ASSAM (Brahmaputra Valley)
  // =========================================================================
  {
    id: "LOC-AS-GHY",
    name: "Guwahati",
    state: "Assam",
    coordinates: [26.1445, 91.7362],
    elevation_m: 55,
    terrain: "Brahmaputra Riverine Basin & Hilly Enclaves",
    description: "Brahmaputra river flood corridor, vulnerable to chronic annual river overtopping, hill-cutting landslides, and urban waterlogging.",
    primary_hazards: ["Riverine Flood", "Landslide", "Severe Lightning"],
    historical_disasters: "2022 & 2024 Assam Floods (Brahmaputra 1.8m above danger mark, 35 lakh affected)",
    current: {
      rainfall_mmh: 62.0, accumulated_24h_mm: 168.0, temperature_c: 28.4, humidity_pct: 92,
      wind_speed_kmh: 22.0, pressure_hpa: 1001.0, slope_deg: 18.5, drainage_proximity_m: 40,
      lightning_strikes_10m: 32, cape_index: 3100, pm25: 38, pm10: 62, aqi: 85,
      water_level_m: 50.8, danger_mark_m: 49.68, soil_moisture_pct: 94,
      population_exposed: 310000, vulnerable_habitations: 62, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 5. UTTARAKHAND (Garhwal Himalaya)
  // =========================================================================
  {
    id: "LOC-UK-DED",
    name: "Dehradun / Kedarnath",
    state: "Uttarakhand",
    coordinates: [30.3165, 78.0322],
    elevation_m: 640,
    terrain: "Outer Himalayan Doon Valley & Gorges",
    description: "Steep tectonic shear zone exposed to glacial lake outburst floods (GLOF), cloudbursts (>100mm/h), and sudden debris flows on pilgrim routes.",
    primary_hazards: ["Cloudburst & Flash Flood", "Landslide & Debris Shear", "GLOF / Dam Overflow"],
    historical_disasters: "2013 Kedarnath Mandakini Cloudburst (5,700+ deaths) & 2021 Chamoli Disaster",
    current: {
      rainfall_mmh: 78.0, accumulated_24h_mm: 220.0, temperature_c: 22.0, humidity_pct: 96,
      wind_speed_kmh: 48.0, pressure_hpa: 988.0, slope_deg: 38.0, drainage_proximity_m: 25,
      lightning_strikes_10m: 44, cape_index: 3400, pm25: 22, pm10: 40, aqi: 48,
      water_level_m: 6.2, danger_mark_m: 5.5, soil_moisture_pct: 98,
      population_exposed: 95000, vulnerable_habitations: 45, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 6. KERALA (Western Ghats Slope & Backwaters)
  // =========================================================================
  {
    id: "LOC-KL-WAY",
    name: "Wayanad / Idukki",
    state: "Kerala",
    coordinates: [11.6854, 76.1320],
    elevation_m: 950,
    terrain: "High-Altitude Western Ghats Slopes",
    description: "High precipitation montane ecosystem susceptible to deep rotational soil slips, tea plantation mudslides, and downstream dam discharge floods.",
    primary_hazards: ["High-Velocity Landslide", "Flash Flood", "Extreme Monsoon Inundation"],
    historical_disasters: "2024 Chooralmala-Meppadi Wayanad Landslide (400+ casualties) & 2018 Kerala Floods",
    current: {
      rainfall_mmh: 84.0, accumulated_24h_mm: 260.0, temperature_c: 23.5, humidity_pct: 98,
      wind_speed_kmh: 38.0, pressure_hpa: 994.0, slope_deg: 42.0, drainage_proximity_m: 30,
      lightning_strikes_10m: 28, cape_index: 2200, pm25: 18, pm10: 32, aqi: 35,
      water_level_m: 8.4, danger_mark_m: 7.2, soil_moisture_pct: 99,
      population_exposed: 72000, vulnerable_habitations: 54, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 7. MAHARASHTRA (Konkan Coast & Western Ghats)
  // =========================================================================
  {
    id: "LOC-MH-MUM",
    name: "Mumbai",
    state: "Maharashtra",
    coordinates: [19.0760, 72.8777],
    elevation_m: 14,
    terrain: "Reclaimed Coastal Urban Peninsula",
    description: "Ultra-dense megalopolis vulnerable to simultaneous high astronomical tides and 100mm/h cloudbursts, paralyzing suburban rail and Mithi River basin.",
    primary_hazards: ["Urban Deluge & Storm Surge", "High Astronomical Tide Inundation", "Cyclone"],
    historical_disasters: "26 July 2005 Mumbai Deluge (944mm in 24 hours, 1,000+ casualties)",
    current: {
      rainfall_mmh: 58.0, accumulated_24h_mm: 175.0, temperature_c: 29.8, humidity_pct: 90,
      wind_speed_kmh: 46.0, pressure_hpa: 1002.0, slope_deg: 2.5, drainage_proximity_m: 50,
      lightning_strikes_10m: 22, cape_index: 2900, pm25: 82, pm10: 140, aqi: 165,
      water_level_m: 4.6, danger_mark_m: 4.8, soil_moisture_pct: 88,
      population_exposed: 650000, vulnerable_habitations: 88, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 8. TAMIL NADU (Coromandel Coast)
  // =========================================================================
  {
    id: "LOC-TN-CHE",
    name: "Chennai",
    state: "Tamil Nadu",
    coordinates: [13.0827, 80.2707],
    elevation_m: 6,
    terrain: "Low-Lying Coromandel Coastal Plain",
    description: "Flat coastal topography traversed by Adyar and Cooum rivers, highly exposed to Northeast Monsoon depressions and coastal tidal lock.",
    primary_hazards: ["Coastal Inundation", "Cyclone Surge", "Extreme Heat & Humidity"],
    historical_disasters: "2015 Chennai Floods (500+ deaths) & 2023 Cyclone Michaung (450mm deluge)",
    current: {
      rainfall_mmh: 48.0, accumulated_24h_mm: 130.0, temperature_c: 31.8, humidity_pct: 88,
      wind_speed_kmh: 36.0, pressure_hpa: 1003.5, slope_deg: 1.8, drainage_proximity_m: 70,
      lightning_strikes_10m: 20, cape_index: 3100, pm25: 62, pm10: 108, aqi: 132,
      water_level_m: 3.9, danger_mark_m: 4.2, soil_moisture_pct: 84,
      population_exposed: 420000, vulnerable_habitations: 64, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 9. WEST BENGAL (Ganges Delta & Sundarbans)
  // =========================================================================
  {
    id: "LOC-WB-KOL",
    name: "Kolkata / Sundarbans",
    state: "West Bengal",
    coordinates: [22.5726, 88.3639],
    elevation_m: 9,
    terrain: "Lower Gangetic Deltaic Estuary",
    description: "Tidally active mangrove delta with low embankments, vulnerable to high-intensity Bay of Bengal cyclones, Hooghly river back-flow, and storm surges.",
    primary_hazards: ["Super Cyclone & Storm Surge", "Delta Embankment Breach", "Urban Inundation"],
    historical_disasters: "2020 Super Cyclone Amphan (185 km/h winds, ₹1.02 Lakh Cr economic loss)",
    current: {
      rainfall_mmh: 38.0, accumulated_24h_mm: 115.0, temperature_c: 32.0, humidity_pct: 86,
      wind_speed_kmh: 40.0, pressure_hpa: 1001.8, slope_deg: 1.5, drainage_proximity_m: 55,
      lightning_strikes_10m: 26, cape_index: 3250, pm25: 88, pm10: 155, aqi: 178,
      water_level_m: 4.2, danger_mark_m: 4.6, soil_moisture_pct: 85,
      population_exposed: 480000, vulnerable_habitations: 72, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 10. ODISHA (Mahanadi Delta & Coastal Belt)
  // =========================================================================
  {
    id: "LOC-OR-BHU",
    name: "Bhubaneswar / Puri",
    state: "Odisha",
    coordinates: [20.2961, 85.8245],
    elevation_m: 45,
    terrain: "Mahanadi Delta Coastal Floodplain",
    description: "East coast hurricane alley subjected to recurring severe cyclonic storms, storm surges breaching sea dykes, and Mahanadi river basin inundation.",
    primary_hazards: ["Tropical Super Cyclone", "Coastal Flood", "Severe Lightning Strikes"],
    historical_disasters: "1999 Odisha Super Cyclone (9,887 deaths) & 2019 Extremely Severe Cyclone Fani",
    current: {
      rainfall_mmh: 34.0, accumulated_24h_mm: 98.0, temperature_c: 33.0, humidity_pct: 84,
      wind_speed_kmh: 44.0, pressure_hpa: 1002.0, slope_deg: 2.8, drainage_proximity_m: 65,
      lightning_strikes_10m: 35, cape_index: 3300, pm25: 68, pm10: 118, aqi: 142,
      water_level_m: 4.1, danger_mark_m: 4.5, soil_moisture_pct: 82,
      population_exposed: 260000, vulnerable_habitations: 48, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 11. BIHAR (Middle Indo-Gangetic Floodplain)
  // =========================================================================
  {
    id: "LOC-BR-PAT",
    name: "Patna / Kosi Basin",
    state: "Bihar",
    coordinates: [25.5941, 85.1376],
    elevation_m: 53,
    terrain: "Alluvial Floodplain & Shifting River Channels",
    description: "The 'Sorrow of Bihar' (Kosi river avulsion and Ganga/Gandak overtopping) resulting in multi-district widespread inundation and crop submersion.",
    primary_hazards: ["River Avulsion & Mega Flood", "Lightning Strikes", "Severe Heatwave"],
    historical_disasters: "2008 Kosi River Embankment Breach (Kusaha breach, 30 Lakh displaced)",
    current: {
      rainfall_mmh: 45.0, accumulated_24h_mm: 125.0, temperature_c: 32.8, humidity_pct: 88,
      wind_speed_kmh: 20.0, pressure_hpa: 1003.0, slope_deg: 1.2, drainage_proximity_m: 35,
      lightning_strikes_10m: 42, cape_index: 3150, pm25: 98, pm10: 172, aqi: 195,
      water_level_m: 49.6, danger_mark_m: 48.60, soil_moisture_pct: 92,
      population_exposed: 520000, vulnerable_habitations: 95, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 12. DELHI NCR (National Capital Region)
  // =========================================================================
  {
    id: "LOC-DL-DEL",
    name: "New Delhi (NCT Delhi)",
    state: "Delhi",
    coordinates: [28.6139, 77.2090],
    elevation_m: 216,
    terrain: "Yamuna Floodplain & Aravalli Ridge Enclave",
    description: "Yamuna River basin exposed to Hathnikund Barrage releases, extreme winter atmospheric thermal inversion (severe PM2.5 smog >400 AQI), and 48°C heatwaves.",
    primary_hazards: ["Severe Air Pollution & Smog Inversion", "Yamuna River Flood", "Extreme Heatwave"],
    historical_disasters: "2023 Yamuna Historic Flood (208.66m all-time peak) & Annual Severe Winter Smog Emergency",
    current: {
      rainfall_mmh: 8.0, accumulated_24h_mm: 22.0, temperature_c: 38.5, humidity_pct: 58,
      wind_speed_kmh: 12.0, pressure_hpa: 1007.0, slope_deg: 1.5, drainage_proximity_m: 110,
      lightning_strikes_10m: 6, cape_index: 1800, pm25: 185, pm10: 310, aqi: 345,
      water_level_m: 205.4, danger_mark_m: 205.33, soil_moisture_pct: 45,
      population_exposed: 850000, vulnerable_habitations: 78, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 13. KARNATAKA (South Deccan Plateau & Western Ghats)
  // =========================================================================
  {
    id: "LOC-KA-BLR",
    name: "Bengaluru",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946],
    elevation_m: 920,
    terrain: "High-Altitude Deccan Ridge & Lake Basin Chain",
    description: "Interconnected cascading tank system susceptible to rapid urban flash floods, stormwater drain encroachment, and acute groundwater depletion cycles.",
    primary_hazards: ["Urban Lake Overtopping", "Severe Thunderstorm", "Groundwater Anomaly"],
    historical_disasters: "September 2022 Bengaluru Tech-Corridor Deluge (131mm in 12h, ₹225 Cr losses)",
    current: {
      rainfall_mmh: 22.0, accumulated_24h_mm: 64.0, temperature_c: 28.5, humidity_pct: 70,
      wind_speed_kmh: 22.0, pressure_hpa: 1009.5, slope_deg: 3.5, drainage_proximity_m: 90,
      lightning_strikes_10m: 15, cape_index: 2100, pm25: 42, pm10: 72, aqi: 88,
      water_level_m: 2.8, danger_mark_m: 3.5, soil_moisture_pct: 68,
      population_exposed: 350000, vulnerable_habitations: 36, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 14. RAJASTHAN (Thar Desert & Aravalli Belt)
  // =========================================================================
  {
    id: "LOC-RJ-JAI",
    name: "Jaipur / Jodhpur",
    state: "Rajasthan",
    coordinates: [26.9124, 75.7873],
    elevation_m: 431,
    terrain: "Arid Semi-Desert & Rocky Aravalli Foothills",
    description: "Extreme physiological heat stress hub (>48°C), severe dust storms ('Andhi'), soil moisture deficit, and sudden desert flash floods in low ravines.",
    primary_hazards: ["Extreme Heatwave & sWBGT Stress", "Severe Dust Storms", "Desert Flash Flood"],
    historical_disasters: "2024 Record Heatwave (50.5°C in Churu/Phalodi) & 2017 Jalore-Sirohi Desert Floods",
    current: {
      rainfall_mmh: 0.0, accumulated_24h_mm: 0.0, temperature_c: 46.2, humidity_pct: 22,
      wind_speed_kmh: 34.0, pressure_hpa: 1003.5, slope_deg: 2.0, drainage_proximity_m: 350,
      lightning_strikes_10m: 2, cape_index: 950, pm25: 110, pm10: 240, aqi: 220,
      water_level_m: 1.1, danger_mark_m: 3.2, soil_moisture_pct: 12,
      population_exposed: 280000, vulnerable_habitations: 30, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 15. HIMACHAL PRADESH (Western Himalaya)
  // =========================================================================
  {
    id: "LOC-HP-SHI",
    name: "Shimla / Kullu-Manali",
    state: "Himachal Pradesh",
    coordinates: [31.1048, 77.1734],
    elevation_m: 2276,
    terrain: "High Himalayan Mountain Ridges & Beas River Gorge",
    description: "High-gradient tectonic slope exposed to sudden high-altitude cloudbursts, Beas river furious scouring, road landslides, and building collapse.",
    primary_hazards: ["Mountain Flash Flood & Cloudburst", "Slope Shear & Landslides", "Glacial Outburst"],
    historical_disasters: "July-August 2023 Himachal Monsoon Catastrophe (Beas River Surge, 400+ casualties)",
    current: {
      rainfall_mmh: 72.0, accumulated_24h_mm: 195.0, temperature_c: 18.2, humidity_pct: 95,
      wind_speed_kmh: 42.0, pressure_hpa: 780.0, slope_deg: 44.0, drainage_proximity_m: 20,
      lightning_strikes_10m: 36, cape_index: 2900, pm25: 16, pm10: 28, aqi: 32,
      water_level_m: 7.2, danger_mark_m: 6.0, soil_moisture_pct: 98,
      population_exposed: 68000, vulnerable_habitations: 42, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 16. JAMMU & KASHMIR (Kashmir Valley & Pir Panjal)
  // =========================================================================
  {
    id: "LOC-JK-SRI",
    name: "Srinagar / Jammu",
    state: "Jammu & Kashmir",
    coordinates: [34.0837, 74.7973],
    elevation_m: 1585,
    terrain: "Jhelum River Basin & Intermontane Bowl",
    description: "Jhelum river catchment vulnerable to snowmelt surge, cloudbursts, Dal lake waterlogging, and winter avalanches on mountain passes.",
    primary_hazards: ["Jhelum Basin Flood", "Avalanche & Snowstorm", "Landslides"],
    historical_disasters: "September 2014 Great Kashmir Flood (Jhelum breached 33ft, Srinagar submerged)",
    current: {
      rainfall_mmh: 24.0, accumulated_24h_mm: 68.0, temperature_c: 21.0, humidity_pct: 82,
      wind_speed_kmh: 18.0, pressure_hpa: 840.0, slope_deg: 26.0, drainage_proximity_m: 45,
      lightning_strikes_10m: 12, cape_index: 1850, pm25: 35, pm10: 60, aqi: 72,
      water_level_m: 18.4, danger_mark_m: 18.0, soil_moisture_pct: 85,
      population_exposed: 160000, vulnerable_habitations: 34, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 17. GUJARAT (Gulf of Khambhat & Rann of Kutch)
  // =========================================================================
  {
    id: "LOC-GJ-AHM",
    name: "Ahmedabad / Surat",
    state: "Gujarat",
    coordinates: [23.0225, 72.5714],
    elevation_m: 53,
    terrain: "Sabarmati-Tapi Alluvial Lowlands & Coast",
    description: "Tapi and Vishwamitri river overtopping, Arabian Sea cyclones making landfall in Saurashtra/Kutch, and high industrial chemical air index.",
    primary_hazards: ["Cyclone & Tidal Surge", "Tapi/Vishwamitri River Flood", "Industrial Air Hazard"],
    historical_disasters: "2001 Bhuj Earthquake (7.7 Mw) & 2021 Cyclone Tauktae (220 km/h wind gusts)",
    current: {
      rainfall_mmh: 32.0, accumulated_24h_mm: 82.0, temperature_c: 35.0, humidity_pct: 78,
      wind_speed_kmh: 38.0, pressure_hpa: 1004.0, slope_deg: 2.1, drainage_proximity_m: 85,
      lightning_strikes_10m: 14, cape_index: 2500, pm25: 78, pm10: 135, aqi: 160,
      water_level_m: 3.5, danger_mark_m: 4.2, soil_moisture_pct: 74,
      population_exposed: 410000, vulnerable_habitations: 52, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 18. UTTAR PRADESH (Upper & Middle Ganga Basin)
  // =========================================================================
  {
    id: "LOC-UP-LKO",
    name: "Lucknow / Varanasi",
    state: "Uttar Pradesh",
    coordinates: [26.8467, 80.9462],
    elevation_m: 123,
    terrain: "Flat Gangetic Alluvial Plains",
    description: "Dense riverine basin (Ganga, Gomti, Ghaghara) prone to seasonal monsoon submergence, severe winter smog inversion, and extreme summer heatwaves.",
    primary_hazards: ["Severe Winter Smog (PM2.5)", "Riverine Ganga Floods", "Extreme Heatwave"],
    historical_disasters: "2019 & 2021 Eastern UP Heavy Inundation (Ganga & Yamuna crossed danger marks)",
    current: {
      rainfall_mmh: 18.0, accumulated_24h_mm: 48.0, temperature_c: 37.0, humidity_pct: 68,
      wind_speed_kmh: 14.0, pressure_hpa: 1005.5, slope_deg: 1.0, drainage_proximity_m: 95,
      lightning_strikes_10m: 22, cape_index: 2600, pm25: 145, pm10: 260, aqi: 285,
      water_level_m: 70.2, danger_mark_m: 71.26, soil_moisture_pct: 72,
      population_exposed: 620000, vulnerable_habitations: 82, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 19. MEGHALAYA (Shillong Plateau)
  // =========================================================================
  {
    id: "LOC-ML-SHL",
    name: "Shillong / Cherrapunji",
    state: "Meghalaya",
    coordinates: [25.5788, 91.8933],
    elevation_m: 1525,
    terrain: "High-Precipitation Meghalaya Tableland",
    description: "The wettest place on Earth, exposed to extreme orographic rain influx (>800mm in 48h), sudden flash floods into Bangladesh plains, and landslides.",
    primary_hazards: ["World-Record Extreme Rainfall", "High-Velocity Slope Shear", "Flash Floods"],
    historical_disasters: "June 2022 Cherrapunji Record Deluge (972mm in 24 hours)",
    current: {
      rainfall_mmh: 110.0, accumulated_24h_mm: 380.0, temperature_c: 20.5, humidity_pct: 99,
      wind_speed_kmh: 36.0, pressure_hpa: 850.0, slope_deg: 36.0, drainage_proximity_m: 15,
      lightning_strikes_10m: 48, cape_index: 3600, pm25: 12, pm10: 22, aqi: 25,
      water_level_m: 6.8, danger_mark_m: 5.8, soil_moisture_pct: 100,
      population_exposed: 58000, vulnerable_habitations: 38, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 20. SIKKIM (Eastern Himalaya & Teesta Basin)
  // =========================================================================
  {
    id: "LOC-SK-GAN",
    name: "Gangtok / Teesta Valley",
    state: "Sikkim",
    coordinates: [27.3389, 88.6065],
    elevation_m: 1650,
    terrain: "High Himalayan Glacial Valley & Teesta Gorge",
    description: "High-altitude glacial lakes (South Lhonak Lake) susceptible to GLOF dam failures, washing away dams and bridges along NH-10.",
    primary_hazards: ["GLOF (Glacial Lake Outburst)", "Teesta River Torrential Flood", "Landslides"],
    historical_disasters: "October 2023 South Lhonak Lake GLOF & Chungthang Dam Collapse (100+ casualties)",
    current: {
      rainfall_mmh: 68.0, accumulated_24h_mm: 190.0, temperature_c: 19.0, humidity_pct: 96,
      wind_speed_kmh: 32.0, pressure_hpa: 825.0, slope_deg: 46.0, drainage_proximity_m: 20,
      lightning_strikes_10m: 25, cape_index: 2700, pm25: 14, pm10: 25, aqi: 28,
      water_level_m: 8.5, danger_mark_m: 7.0, soil_moisture_pct: 99,
      population_exposed: 42000, vulnerable_habitations: 28, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 21. PUNJAB (Indo-Gangetic Breadbasket)
  // =========================================================================
  {
    id: "LOC-PB-ASR",
    name: "Amritsar / Ludhiana",
    state: "Punjab",
    coordinates: [31.6340, 74.8723],
    elevation_m: 234,
    terrain: "Sutlej-Beas Alluvial Floodplain",
    description: "Sutlej and Beas river basin vulnerable to upstream dam releases, agricultural inundation, and post-harvest biomass stubble smoke plumes (severe PM2.5).",
    primary_hazards: ["Post-Harvest Stubble Air Pollution", "Sutlej River Inundation", "Heatwave"],
    historical_disasters: "July 2023 Punjab River Overtopping & Annual Stubble Burning Smog Crises",
    current: {
      rainfall_mmh: 6.0, accumulated_24h_mm: 18.0, temperature_c: 36.5, humidity_pct: 62,
      wind_speed_kmh: 16.0, pressure_hpa: 1006.0, slope_deg: 0.8, drainage_proximity_m: 140,
      lightning_strikes_10m: 8, cape_index: 1900, pm25: 165, pm10: 290, aqi: 310,
      water_level_m: 3.2, danger_mark_m: 4.5, soil_moisture_pct: 55,
      population_exposed: 320000, vulnerable_habitations: 40, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 22. HARYANA (National Capital Environs)
  // =========================================================================
  {
    id: "LOC-HR-GUR",
    name: "Gurugram / Faridabad",
    state: "Haryana",
    coordinates: [28.4595, 77.0266],
    elevation_m: 219,
    terrain: "Aravalli Foothills & Urban Expressways",
    description: "Urban drainage paralysis along NH-48 (Gurujam), coupled with heavy industrial particulate pollution and Ghaggar river agricultural flooding.",
    primary_hazards: ["Urban Waterlogging Gridlock", "Hazardous Industrial Smog", "Heatwave"],
    historical_disasters: "2016 'Gurujam' & 2023 Ghaggar/Yamuna Overflows",
    current: {
      rainfall_mmh: 14.0, accumulated_24h_mm: 38.0, temperature_c: 37.8, humidity_pct: 60,
      wind_speed_kmh: 15.0, pressure_hpa: 1007.2, slope_deg: 1.2, drainage_proximity_m: 100,
      lightning_strikes_10m: 10, cape_index: 1950, pm25: 175, pm10: 305, aqi: 325,
      water_level_m: 2.9, danger_mark_m: 4.0, soil_moisture_pct: 48,
      population_exposed: 290000, vulnerable_habitations: 35, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 23. MADHYA PRADESH (Central Indian Plateau)
  // =========================================================================
  {
    id: "LOC-MP-BHO",
    name: "Bhopal / Narmada Valley",
    state: "Madhya Pradesh",
    coordinates: [23.2599, 77.4126],
    elevation_m: 527,
    terrain: "Malwa Plateau & Narmada River Gorge",
    description: "Narmada and Betwa river catchment subject to sudden heavy catchment rains, Bargi/Indirasagar dam discharge surges, and severe summer heatwaves.",
    primary_hazards: ["Narmada Basin Flooding", "Extreme Heatwave", "Severe Lightning Strikes"],
    historical_disasters: "1984 Union Carbide Chemical Disaster & 2020 Narmada Basin Extreme Floods",
    current: {
      rainfall_mmh: 26.0, accumulated_24h_mm: 72.0, temperature_c: 35.4, humidity_pct: 72,
      wind_speed_kmh: 20.0, pressure_hpa: 1006.0, slope_deg: 3.2, drainage_proximity_m: 110,
      lightning_strikes_10m: 28, cape_index: 2750, pm25: 58, pm10: 98, aqi: 125,
      water_level_m: 3.8, danger_mark_m: 4.8, soil_moisture_pct: 70,
      population_exposed: 230000, vulnerable_habitations: 32, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 24. CHHATTISGARH (Mahanadi Catchment & Bastar Plateau)
  // =========================================================================
  {
    id: "LOC-CT-RAI",
    name: "Raipur",
    state: "Chhattisgarh",
    coordinates: [21.2514, 81.6296],
    elevation_m: 298,
    terrain: "Mahanadi Upper Basin Plain",
    description: "Upper Mahanadi and Shivnath river floodplains, dense industrial steel/power plant emissions, and high lightning strike casualty density.",
    primary_hazards: ["High Lightning Strike Density", "Industrial Particulate Smog", "River Floods"],
    historical_disasters: "National Highest Lightning Strike Casualty State (300+ deaths annually)",
    current: {
      rainfall_mmh: 30.0, accumulated_24h_mm: 85.0, temperature_c: 34.5, humidity_pct: 76,
      wind_speed_kmh: 22.0, pressure_hpa: 1005.0, slope_deg: 2.0, drainage_proximity_m: 85,
      lightning_strikes_10m: 45, cape_index: 3400, pm25: 85, pm10: 148, aqi: 172,
      water_level_m: 3.6, danger_mark_m: 4.5, soil_moisture_pct: 78,
      population_exposed: 180000, vulnerable_habitations: 28, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 25. JHARKHAND (Chota Nagpur Plateau)
  // =========================================================================
  {
    id: "LOC-JH-RAN",
    name: "Ranchi / Damodar Basin",
    state: "Jharkhand",
    coordinates: [23.3441, 85.3096],
    elevation_m: 651,
    terrain: "Undulating Chota Nagpur Rocky Plateau",
    description: "Subarnarekha and Damodar river basin, open-cast coal mine dust dispersion, and severe thunderstorm squall lines (Nor'westers / Kalbaishakhi).",
    primary_hazards: ["Deadly Lightning Strikes (Kalbaishakhi)", "Mining Smog Pollution", "Flash Floods"],
    historical_disasters: "Annual High-Mortality Lightning Corridor & Damodar Valley Flash Floods",
    current: {
      rainfall_mmh: 34.0, accumulated_24h_mm: 92.0, temperature_c: 31.0, humidity_pct: 82,
      wind_speed_kmh: 28.0, pressure_hpa: 1004.2, slope_deg: 8.5, drainage_proximity_m: 60,
      lightning_strikes_10m: 48, cape_index: 3550, pm25: 92, pm10: 165, aqi: 185,
      water_level_m: 3.9, danger_mark_m: 4.6, soil_moisture_pct: 80,
      population_exposed: 165000, vulnerable_habitations: 30, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 26. GOA (Central Konkan Coast)
  // =========================================================================
  {
    id: "LOC-GA-PAN",
    name: "Panaji",
    state: "Goa",
    coordinates: [15.4909, 73.8278],
    elevation_m: 7,
    terrain: "Konkan Estuary & Coastal Lowlands",
    description: "Mandovi and Zuari estuaries exposed to intense southwest monsoon gales, coastal beach erosion, and urban flooding in low-lying heritage corridors.",
    primary_hazards: ["Coastal Inundation", "High Monsoon Gales", "Beach Erosion"],
    historical_disasters: "2021 Cyclone Tauktae Coastal Destruction & Annual Monsoon Estuarine Flooding",
    current: {
      rainfall_mmh: 46.0, accumulated_24h_mm: 140.0, temperature_c: 28.5, humidity_pct: 92,
      wind_speed_kmh: 42.0, pressure_hpa: 1004.5, slope_deg: 4.0, drainage_proximity_m: 35,
      lightning_strikes_10m: 16, cape_index: 2400, pm25: 22, pm10: 42, aqi: 48,
      water_level_m: 3.4, danger_mark_m: 3.8, soil_moisture_pct: 90,
      population_exposed: 85000, vulnerable_habitations: 18, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 27. ARUNACHAL PRADESH (Eastern Himalaya)
  // =========================================================================
  {
    id: "LOC-AR-ITA",
    name: "Itanagar / Siang Valley",
    state: "Arunachal Pradesh",
    coordinates: [27.0844, 93.6053],
    elevation_m: 750,
    terrain: "Rugged Eastern Himalayan Tectonic Slopes",
    description: "Seismically hyper-active zone (Zone V) with Siang and Subansiri river gorges prone to massive earthquake-induced rock avalanches and flash floods.",
    primary_hazards: ["Seismic Rock Avalanches (Zone V)", "Siang River Flash Floods", "Severe Cloudbursts"],
    historical_disasters: "1950 Great Assam-Tibet Earthquake (8.6 Mw) & 2000 Siang River Flash Flood Catastrophe",
    current: {
      rainfall_mmh: 58.0, accumulated_24h_mm: 175.0, temperature_c: 22.4, humidity_pct: 94,
      wind_speed_kmh: 26.0, pressure_hpa: 920.0, slope_deg: 48.0, drainage_proximity_m: 20,
      lightning_strikes_10m: 24, cape_index: 2650, pm25: 15, pm10: 25, aqi: 30,
      water_level_m: 7.8, danger_mark_m: 6.8, soil_moisture_pct: 98,
      population_exposed: 48000, vulnerable_habitations: 32, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 28. MANIPUR (Imphal Valley & Hills)
  // =========================================================================
  {
    id: "LOC-MN-IMP",
    name: "Imphal",
    state: "Manipur",
    coordinates: [24.8170, 93.9368],
    elevation_m: 786,
    terrain: "Intermontane Lacustrine Basin (Loktak)",
    description: "Imphal, Nambul, and Iril river convergence into Loktak Lake causing severe basin inundation, mudslides on NH-37, and earthquake vulnerability.",
    primary_hazards: ["Loktak Basin Flood", "Highway Landslides", "Seismic Hazards"],
    historical_disasters: "May 2024 Cyclone Remal Deluge (Imphal River bank breaches submerged capital)",
    current: {
      rainfall_mmh: 40.0, accumulated_24h_mm: 110.0, temperature_c: 24.0, humidity_pct: 90,
      wind_speed_kmh: 22.0, pressure_hpa: 925.0, slope_deg: 22.0, drainage_proximity_m: 30,
      lightning_strikes_10m: 18, cape_index: 2350, pm25: 28, pm10: 48, aqi: 55,
      water_level_m: 5.2, danger_mark_m: 4.8, soil_moisture_pct: 92,
      population_exposed: 92000, vulnerable_habitations: 28, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 29. MIZORAM (Lushai Hills)
  // =========================================================================
  {
    id: "LOC-MZ-AIZ",
    name: "Aizawl",
    state: "Mizoram",
    coordinates: [23.7271, 92.7176],
    elevation_m: 1132,
    terrain: "Steep North-South Folded Hill Ridges",
    description: "High-density hilltop city built on unstable sedimentary shale, prone to catastrophic road subsidence, stone quarry collapses, and flash floods.",
    primary_hazards: ["Catastrophic Landslides", "Stone Quarry Collapse", "Severe Cyclone Remnants"],
    historical_disasters: "May 2024 Cyclone Remal Quarry Collapse & Landslides (30+ fatalities in Aizawl)",
    current: {
      rainfall_mmh: 52.0, accumulated_24h_mm: 155.0, temperature_c: 21.8, humidity_pct: 95,
      wind_speed_kmh: 30.0, pressure_hpa: 885.0, slope_deg: 45.0, drainage_proximity_m: 25,
      lightning_strikes_10m: 22, cape_index: 2500, pm25: 14, pm10: 24, aqi: 28,
      water_level_m: 4.8, danger_mark_m: 4.2, soil_moisture_pct: 98,
      population_exposed: 64000, vulnerable_habitations: 36, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 30. NAGALAND (Naga Hills)
  // =========================================================================
  {
    id: "LOC-NL-KOH",
    name: "Kohima / Dimapur",
    state: "Nagaland",
    coordinates: [25.6751, 94.1086],
    elevation_m: 1444,
    terrain: "High Himalayan Mountain Passes & Ridges",
    description: "Crucial national highway arterial link (NH-29) prone to chronic heavy mudslides, deep rock fissures, and Dhansiri river seasonal floods.",
    primary_hazards: ["Arterial Highway Sinking (NH-29)", "Heavy Slope Mudslides", "River Inundation"],
    historical_disasters: "Annual Monsoonal Highway Sinking & 2018 Nagaland State-Wide Flood Emergency",
    current: {
      rainfall_mmh: 44.0, accumulated_24h_mm: 125.0, temperature_c: 22.0, humidity_pct: 92,
      wind_speed_kmh: 24.0, pressure_hpa: 860.0, slope_deg: 38.0, drainage_proximity_m: 30,
      lightning_strikes_10m: 20, cape_index: 2400, pm25: 18, pm10: 32, aqi: 36,
      water_level_m: 4.2, danger_mark_m: 3.8, soil_moisture_pct: 95,
      population_exposed: 54000, vulnerable_habitations: 26, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 31. TRIPURA (Barak-Surma Basin)
  // =========================================================================
  {
    id: "LOC-TR-AGT",
    name: "Agartala",
    state: "Tripura",
    coordinates: [23.8315, 91.2868],
    elevation_m: 16,
    terrain: "Howrah River Lowland Basin",
    description: "Transboundary river system (Howrah, Gumti) subject to intense downstream water surges from upper Tripura hills and international border flooding.",
    primary_hazards: ["Gumti & Howrah River Flood", "Severe Lightning Strikes", "Urban Waterlogging"],
    historical_disasters: "August 2024 Historic Tripura Floods (Dumblur dam overflow, 1.2 Lakh displaced)",
    current: {
      rainfall_mmh: 48.0, accumulated_24h_mm: 135.0, temperature_c: 29.5, humidity_pct: 91,
      wind_speed_kmh: 24.0, pressure_hpa: 1003.0, slope_deg: 2.5, drainage_proximity_m: 40,
      lightning_strikes_10m: 34, cape_index: 3100, pm25: 38, pm10: 65, aqi: 82,
      water_level_m: 11.4, danger_mark_m: 10.8, soil_moisture_pct: 92,
      population_exposed: 110000, vulnerable_habitations: 34, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 32. LADAKH (Trans-Himalayan Cold Desert)
  // =========================================================================
  {
    id: "LOC-LA-LEH",
    name: "Leh / Indus Valley",
    state: "Ladakh",
    coordinates: [34.1526, 77.5771],
    elevation_m: 3500,
    terrain: "High-Altitude Arid Cold Desert",
    description: "Zero-vegetation scree slopes extremely vulnerable to catastrophic cloudburst debris torrents, glacial dam breaches, and sub-zero winter isolation.",
    primary_hazards: ["Cold-Desert Cloudburst Torrent", "Glacial Outburst / Mudflows", "Severe Sub-Zero Freeze"],
    historical_disasters: "August 2010 Leh Cloudburst Disaster (250+ fatalities in 1 hour)",
    current: {
      rainfall_mmh: 12.0, accumulated_24h_mm: 35.0, temperature_c: 14.5, humidity_pct: 45,
      wind_speed_kmh: 32.0, pressure_hpa: 670.0, slope_deg: 32.0, drainage_proximity_m: 40,
      lightning_strikes_10m: 4, cape_index: 850, pm25: 8, pm10: 18, aqi: 20,
      water_level_m: 2.2, danger_mark_m: 2.8, soil_moisture_pct: 35,
      population_exposed: 35000, vulnerable_habitations: 16, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 33. ANDAMAN & NICOBAR ISLANDS (Bay of Bengal Archipelago)
  // =========================================================================
  {
    id: "LOC-AN-PBL",
    name: "Port Blair",
    state: "Andaman & Nicobar Islands",
    coordinates: [11.6234, 92.7265],
    elevation_m: 16,
    terrain: "Tropical Insular Archipelago & Subsea Subduction Trench",
    description: "Subduction zone front-line (Sundas Trench), prime tsunami hazard focal point, equatorial cyclones, and high maritime vulnerability.",
    primary_hazards: ["Subsea Tsunami & Megaquake", "Tropical Cyclone Surges", "Maritime Isolation"],
    historical_disasters: "26 December 2004 Indian Ocean Tsunami (9.1 Mw, 3,500+ islanders lost)",
    current: {
      rainfall_mmh: 36.0, accumulated_24h_mm: 110.0, temperature_c: 29.0, humidity_pct: 89,
      wind_speed_kmh: 46.0, pressure_hpa: 1005.0, slope_deg: 6.5, drainage_proximity_m: 20,
      lightning_strikes_10m: 22, cape_index: 2800, pm25: 10, pm10: 18, aqi: 22,
      water_level_m: 2.8, danger_mark_m: 3.5, soil_moisture_pct: 88,
      population_exposed: 65000, vulnerable_habitations: 22, station_status: "NORMAL"
    }
  },

  // =========================================================================
  // 34. PUDUCHERRY (Coromandel Coastal Enclave)
  // =========================================================================
  {
    id: "LOC-PY-PUD",
    name: "Puducherry",
    state: "Puducherry",
    coordinates: [11.9416, 79.8083],
    elevation_m: 3,
    terrain: "Low-Lying Coromandel Coastal Shelf",
    description: "Flat coastal seafront prone to direct cyclonic eye landfall, sea wall inundation, and saline ground-water intrusion.",
    primary_hazards: ["Direct Cyclone Landfall", "Coastal Sea Ingress", "Extreme Humid Heat"],
    historical_disasters: "2011 Cyclone Thane (140 km/h winds) & 2020 Cyclone Nivar",
    current: {
      rainfall_mmh: 30.0, accumulated_24h_mm: 85.0, temperature_c: 32.0, humidity_pct: 86,
      wind_speed_kmh: 34.0, pressure_hpa: 1004.0, slope_deg: 1.0, drainage_proximity_m: 30,
      lightning_strikes_10m: 16, cape_index: 2750, pm25: 45, pm10: 82, aqi: 95,
      water_level_m: 2.2, danger_mark_m: 3.0, soil_moisture_pct: 80,
      population_exposed: 85000, vulnerable_habitations: 19, station_status: "NORMAL"
    }
  }
];

// Master Pan-India Red Zones & Habitation Vulnerability Register
export const VULNERABILITY_RED_ZONES = [
  { id: "RZ-01", location: "Wayanad (Chooralmala-Meppadi)", state: "Kerala", hazard: "Landslide", risk_level: "CRITICAL", population: 14500, evacuation_route: "Meppadi High Ground NH-766", shelter: "St. Joseph Relief Camp" },
  { id: "RZ-02", location: "Kedarnath & Mandakini Gorge", state: "Uttarakhand", hazard: "Cloudburst / Flash Flood", risk_level: "CRITICAL", population: 22000, evacuation_route: "Guptkashi Masonry Corridor", shelter: "GMVN Helipad Shelter Complex" },
  { id: "RZ-03", location: "Brahmaputra Lowlands (Majuli & Ghy)", state: "Assam", hazard: "Riverine Flood", risk_level: "CRITICAL", population: 310000, evacuation_route: "Garmur Highland Complex (+38m MSL)", shelter: "District Multipurpose Flood Shelters" },
  { id: "RZ-04", location: "Kosi Floodplain (Supaul & Saharsa)", state: "Bihar", hazard: "River Avulsion Flood", risk_level: "CRITICAL", population: 520000, evacuation_route: "East-West Highway Embankments", shelter: "State High-Plinth Relief Centers" },
  { id: "RZ-05", location: "Delhi Yamuna Khadar & Ring Road", state: "Delhi", hazard: "Severe Smog & River Inundation", risk_level: "HIGH", population: 185000, evacuation_route: "Geeta Colony Elevated Flyovers", shelter: "MCD Emergency Community Centers" },
  { id: "RZ-06", location: "Mithi River & Kurla Lowlands", state: "Maharashtra", hazard: "Urban Deluge", risk_level: "HIGH", population: 420000, evacuation_route: "BKC Elevated Corridor & CST Terminus", shelter: "BMC Municipal Transit Schools" },
  { id: "RZ-07", location: "Musi River Basin & Moosarambagh", state: "Telangana", hazard: "Urban Flash Flood", risk_level: "HIGH", population: 185000, evacuation_route: "Malakpet-Amberpet Radial Road", shelter: "GHMC Indoor Stadiums" },
  { id: "RZ-08", location: "Puri & Jagatsinghpur Coast", state: "Odisha", hazard: "Super Cyclone Surge", risk_level: "HIGH", population: 260000, evacuation_route: "Bhubaneswar Coastal Bypass", shelter: "ODRAF Cyclone Shelters (400 Units)" },
  { id: "RZ-09", location: "Teesta Gorge (Chungthang-Singtam)", state: "Sikkim", hazard: "GLOF & Flash Flood", risk_level: "CRITICAL", population: 42000, evacuation_route: "Mangan Ridge High Road", shelter: "ITBP Military Staging Bases" },
  { id: "RZ-10", location: "Aizawl Slope Faults (Laipuitlang)", state: "Mizoram", hazard: "Catastrophic Landslide", risk_level: "HIGH", population: 64000, evacuation_route: "Aizawl High Ridge Assembly", shelter: "YMA Community Halls" }
];

// Pan-India Weather & Telemetry Stations
export const WEATHER_STATIONS_DATA = [
  { id: "AWS-101", name: "Hyderabad Begumpet Station", state: "Telangana", type: "Doppler Radar & AWS", status: "HEALTHY", variance_sigma: 0.12, last_ping: "LIVE" },
  { id: "AWS-102", name: "Guwahati Borjhar Station", state: "Assam", type: "Brahmaputra Telemetry Hub", status: "HEALTHY", variance_sigma: 0.18, last_ping: "LIVE" },
  { id: "AWS-103", name: "Visakhapatnam Dolphin Nose", state: "Andhra Pradesh", type: "Coastal Cyclone Radar", status: "ANOMALY", variance_sigma: 3.42, last_ping: "WARNING: SENSOR DRIFT" },
  { id: "AWS-104", name: "Dehradun Forest Research Hub", state: "Uttarakhand", type: "Himalayan Meso-Net", status: "HEALTHY", variance_sigma: 0.15, last_ping: "LIVE" },
  { id: "AWS-105", name: "Wayanad Meppadi Hill Station", state: "Kerala", type: "Pore-Pressure InSAR Node", status: "HEALTHY", variance_sigma: 0.21, last_ping: "LIVE" },
  { id: "AWS-106", name: "Mumbai Santacruz Doppler", state: "Maharashtra", type: "Doppler Weather Radar (DWR)", status: "HEALTHY", variance_sigma: 0.16, last_ping: "LIVE" },
  { id: "AWS-107", name: "New Delhi Safdarjung Observatory", state: "Delhi", type: "NAQI Air & NWP Radar", status: "HEALTHY", variance_sigma: 0.19, last_ping: "LIVE" },
  { id: "AWS-108", name: "Kolkata Alipore Observatory", state: "West Bengal", type: "Bay of Bengal Radar", status: "HEALTHY", variance_sigma: 0.14, last_ping: "LIVE" },
  { id: "AWS-109", name: "Patna Alluvial Station", state: "Bihar", type: "Ganga-Kosi Basin Gauge", status: "HEALTHY", variance_sigma: 0.22, last_ping: "LIVE" },
  { id: "AWS-110", name: "Jaipur Sanganer Station", state: "Rajasthan", type: "Desert Thermal Radiometer", status: "HEALTHY", variance_sigma: 0.11, last_ping: "LIVE" },
  { id: "AWS-111", name: "Leh Trans-Himalayan Stn", state: "Ladakh", type: "High-Altitude Sounding", status: "HEALTHY", variance_sigma: 0.17, last_ping: "LIVE" },
  { id: "AWS-112", name: "Port Blair Marine Station", state: "Andaman & Nicobar", type: "Ocean Tsunami Buoy Tether", status: "HEALTHY", variance_sigma: 0.13, last_ping: "LIVE" }
];
