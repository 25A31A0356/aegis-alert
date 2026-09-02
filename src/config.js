/**
 * AegisAlert System Configuration & Disaster Knowledge Base
 * Smart India Hackathon (SIH) Specification
 */

export const CONFIG = {
  SYSTEM_NAME: "AegisAlert",
  SYSTEM_SUBTITLE: "Autonomous Cyber-Physical Disaster Early Warning & Life-Saving System",
  VERSION: "2.4.0-SIH",
  FREQUENCY_BAND: "868.1 MHz Sub-GHz (India LoRa ISM) / NavIC S-Band",
  BROADCAST_POWER_DBM: 22, // Max legal LoRa ERP in India
  DEFAULT_MAP_CENTER: [20.5937, 78.9629], // Center of India
  DEFAULT_ZOOM: 5,
  
  // Alert Severity Levels (Based on NDMA / IMD Color Coding)
  ALERT_LEVELS: {
    GREEN: {
      code: 0,
      label: "NORMAL / WATCH",
      color: "#10b981",
      sirenRequired: false,
      strobeMode: "OFF",
      action: "Standard telemetry monitoring. No immediate public action needed."
    },
    YELLOW: {
      code: 1,
      label: "ADVISORY / BE AWARE",
      color: "#facc15",
      sirenRequired: false,
      strobeMode: "STEADY_AMBER",
      action: "Keep emergency transistor/radio active. Prepare emergency kit."
    },
    ORANGE: {
      code: 2,
      label: "WARNING / BE PREPARED",
      color: "#f97316",
      sirenRequired: true,
      strobeMode: "SLOW_PULSE_ORANGE",
      action: "Evacuate riverbeds & low-lying areas. Move livestock to high ground."
    },
    RED: {
      code: 3,
      label: "EMERGENCY / EVACUATE NOW",
      color: "#ef4444",
      sirenRequired: true,
      strobeMode: "RAPID_STROBE_RED",
      action: "IMMEDIATE EVACUATION! Flash flood / extreme hazard imminent."
    }
  },

  // Disaster Types Supported
  DISASTER_TYPES: {
    FLASH_FLOOD: {
      id: "FLASH_FLOOD",
      name: "Flash Flood / Cloudburst",
      icon: "🌊",
      officialSource: "Central Water Commission (CWC) & IMD Nowcast",
      criticalThreshold: "Rainfall > 100mm/3hr OR River Level > Danger Mark",
      voiceHindi: "चेतावनी! नदी का जलस्तर खतरे के निशान से ऊपर है। तुरंत ऊंचे स्थान पर जाएं!",
      voiceEnglish: "Attention! River water levels exceeding danger mark. Move to designated high ground immediately!"
    },
    CYCLONE: {
      id: "CYCLONE",
      name: "Severe Cyclonic Storm",
      icon: "🌀",
      officialSource: "IMD Cyclone Warning Division (CWD)",
      criticalThreshold: "Wind Gusts > 120 km/h OR Central Pressure < 970 hPa",
      voiceHindi: "सावधान! तीव्र चक्रवात आ रहा है। पक्के आश्रय स्थल में शरण लें!",
      voiceEnglish: "Warning! Severe cyclone landfall imminent. Take shelter in cyclone relief centers now!"
    },
    LANDSLIDE: {
      id: "LANDSLIDE",
      name: "Landslide / Debris Flow",
      icon: "⛰️",
      officialSource: "Geological Survey of India (GSI) & IMD",
      criticalThreshold: "Antecedent Rainfall > 150mm/24hr on slopes > 30°",
      voiceHindi: "सावधान! भूस्खलन की गंभीर आशंका है। ढलान वाले क्षेत्र तुरंत खाली करें!",
      voiceEnglish: "Alert! High risk of slope failure and landslide. Vacate hillside settlements immediately!"
    },
    EARTHQUAKE: {
      id: "EARTHQUAKE",
      name: "Seismic Shockwave",
      icon: "⚡",
      officialSource: "National Center for Seismology (NCS)",
      criticalThreshold: "Richter Scale Magnitude > 5.5 (Depth < 30km)",
      voiceHindi: "भूकंप अलर्ट! खुले मैदान में निकलें, इमारतों और खंभों से दूर रहें!",
      voiceEnglish: "Earthquake alert! Evacuate to open areas, stay clear of structures and power lines!"
    }
  },

  // High-Stress Real-World Scenarios for SIH Demo
  SCENARIOS: [
    {
      id: "wayanad_flash_flood",
      title: "Wayanad Cloudburst & Dam Overflow (Kerala)",
      type: "FLASH_FLOOD",
      coordinates: [11.6854, 76.1320],
      zoom: 11,
      telemetry: {
        rainfall1h: 68.4, // mm/hr
        rainfall24h: 242.0, // mm
        riverLevel: 19.8, // meters
        riverDangerMark: 18.2, // meters
        damCapacity: 94.2, // percentage
        windSpeed: 42 // km/h
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 40,
        floodWaveSpeedKmh: 24,
        recommendedAction: "Mandatory release of 20,000 cusecs from Banasura Sagar Dam. Evacuate Meppadi and Chooralmala riverbanks within 30 minutes.",
        impactedPopulation: 34200,
        safeShelter: "St. Joseph Higher Secondary School Camp, Meppadi (Elevation +42m)"
      }
    },
    {
      id: "assam_brahmaputra_surge",
      title: "Brahmaputra River Inundation (Kaziranga / Tezpur, Assam)",
      type: "FLASH_FLOOD",
      coordinates: [26.6528, 92.7926],
      zoom: 10,
      telemetry: {
        rainfall1h: 34.0,
        rainfall24h: 188.0,
        riverLevel: 66.4,
        riverDangerMark: 65.23,
        damCapacity: 91.0,
        windSpeed: 28
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 75,
        floodWaveSpeedKmh: 14,
        recommendedAction: "Breach alert at Jia Bharali embankment. Alert forest outposts & National Highway 715 settlements. Shift wildlife rescue teams to Sector 3.",
        impactedPopulation: 86000,
        safeShelter: "Tezpur Elevated Relief Center (Shelter #4)"
      }
    },
    {
      id: "odisha_super_cyclone",
      title: "Bay of Bengal Severe Cyclone Landfall (Puri Coast, Odisha)",
      type: "CYCLONE",
      coordinates: [19.8135, 85.8312],
      zoom: 10,
      telemetry: {
        rainfall1h: 52.0,
        rainfall24h: 310.0,
        centralPressure: 954, // hPa
        windSpeed: 165, // km/h sustained
        stormSurgeHeight: 3.8 // meters
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 120,
        floodWaveSpeedKmh: 55,
        recommendedAction: "Immediate shutdown of coastal power grids to prevent electrocution. Evacuate thatched houses within 3km of high tide line to multi-purpose cyclone shelters.",
        impactedPopulation: 145000,
        safeShelter: "Puri Multi-Purpose Cyclone Shelter Complex #12"
      }
    },
    {
      id: "himalayan_seismic_event",
      title: "Main Boundary Thrust Seismic Rupture (Uttarkashi, Uttarakhand)",
      type: "EARTHQUAKE",
      coordinates: [30.7268, 78.4354],
      zoom: 9,
      telemetry: {
        magnitude: 6.4,
        depthKm: 12,
        peakGroundAccel: "0.38g",
        pWaveArrivalSec: 0,
        sWaveArrivalSec: 14
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 0, // Instant
        floodWaveSpeedKmh: 0,
        recommendedAction: "Trigger automatic early warning P-wave beacon alarm. Stop all railway movements in Rishikesh-Karanprayag section. Sound village siren towers.",
        impactedPopulation: 62000,
        safeShelter: "District Sports Stadium Open Ground, Uttarkashi"
      }
    }
  ],

  // Deployed AegisBeacon Physical Towers across India
  DEPLOYED_BEACONS: [
    { id: "BEACON-KL-01", name: "Meppadi Riverfront Pole", lat: 11.5540, lng: 76.1265, status: "ONLINE", battery: 98, solarW: 45, signal: "LORA_MESH_OK" },
    { id: "BEACON-KL-02", name: "Chooralmala Bridge Node", lat: 11.5420, lng: 76.1680, status: "ONLINE", battery: 94, solarW: 42, signal: "LORA_MESH_OK" },
    { id: "BEACON-KL-03", name: "Mundakkai Slope Station", lat: 11.5310, lng: 76.1950, status: "ONLINE", battery: 89, solarW: 38, signal: "LORA_MESH_OK" },
    { id: "BEACON-AS-01", name: "Tezpur Ghat Tower", lat: 26.6210, lng: 92.7840, status: "ONLINE", battery: 96, solarW: 50, signal: "NAVIC_SAT_OK" },
    { id: "BEACON-AS-02", name: "Kaziranga Outpost Node", lat: 26.5775, lng: 93.1711, status: "ONLINE", battery: 91, solarW: 48, signal: "LORA_MESH_OK" },
    { id: "BEACON-OD-01", name: "Puri Beach Lightpost", lat: 19.7983, lng: 85.8249, status: "ONLINE", battery: 100, solarW: 55, signal: "NAVIC_SAT_OK" },
    { id: "BEACON-OD-02", name: "Konark Fisherman Chowk", lat: 19.8876, lng: 86.0945, status: "ONLINE", battery: 95, solarW: 52, signal: "LORA_MESH_OK" },
    { id: "BEACON-UK-01", name: "Uttarkashi Town Square", lat: 30.7310, lng: 78.4410, status: "ONLINE", battery: 92, solarW: 40, signal: "NAVIC_SAT_OK" }
  ]
};
