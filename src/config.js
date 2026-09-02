/**
 * AegisAlert System Configuration & Disaster Knowledge Base
 * MDoNER (Ministry of Development of North Eastern Region) & National SIH Edition
 * Ingests: NESAC (ISRO), CWC Brahmaputra Board, IMD RMC Guwahati, and NCS
 */

export const CONFIG = {
  SYSTEM_NAME: "AegisAlert",
  SYSTEM_SUBTITLE: "Autonomous Multi-Hazard Early Warning System for North Eastern Region & India",
  VERSION: "3.0.0-MDONER-SIH",
  TARGET_MINISTRY: "Ministry of Development of North Eastern Region (MDoNER) & NDMA",
  SATELLITE_PARTNER: "ISRO / NESAC (North Eastern Space Applications Centre, Meghalaya)",
  DEFAULT_MAP_CENTER: [26.2006, 92.9376], // Center of North East India (Assam/Meghalaya)
  DEFAULT_ZOOM: 7,

  ALERT_LEVELS: {
    GREEN: { code: 0, label: "NORMAL / WATCH", color: "#10b981", action: "Routine satellite and gauge telemetry monitoring." },
    YELLOW: { code: 1, label: "ADVISORY / BE AWARE", color: "#facc15", action: "Keep emergency transistor radio on. Prepare grab-bag." },
    ORANGE: { code: 2, label: "WARNING / BE PREPARED", color: "#f97316", action: "Evacuate riverbanks & landslide slopes. Move livestock." },
    RED: { code: 3, label: "EMERGENCY / EVACUATE NOW", color: "#ef4444", action: "IMMEDIATE EVACUATION! Flash flood / GLOF / Landslide imminent." }
  },

  // High-Impact North East & National Scenarios
  SCENARIOS: [
    {
      id: "assam_brahmaputra_surge",
      title: "Brahmaputra Basin Flood & Majuli Island Cutoff (Assam)",
      type: "FLASH_FLOOD",
      coordinates: [26.9535, 94.2037],
      zoom: 10,
      ministryConcern: "MDoNER, Brahmaputra Board & Assam SDMA",
      telemetry: {
        rainfall1h: 48.5,
        rainfall24h: 215.0,
        riverLevel: 86.8, // meters
        riverDangerMark: 85.5,
        damCapacity: 93.5,
        windSpeed: 32
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 35,
        floodWaveSpeedKmh: 18,
        recommendedAction: "Embankment breach alert at Kamalabari. Dispatch NDRF 1st Battalion (Guwahati) zodiac boats. Evacuate 14 riverine chaporis to elevated highlands.",
        impactedPopulation: 78500,
        safeShelter: "Garmur Elevated Multi-Purpose Relief Complex, Majuli (+28m Elevation)"
      }
    },
    {
      id: "sikkim_glof_surge",
      title: "Sikkim Teesta Basin Glacial Lake Outburst Flood (GLOF)",
      type: "FLASH_FLOOD",
      coordinates: [27.7025, 88.6138],
      zoom: 10,
      ministryConcern: "MDoNER, MoES & Sikkim SDMA",
      telemetry: {
        rainfall1h: 62.0,
        rainfall24h: 280.0,
        lakeWaterHeightM: 42.0,
        moraineDamBreachPct: 75,
        teestaRiverLevel: 104.2,
        riverDangerMark: 98.0
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 25,
        floodWaveSpeedKmh: 45,
        recommendedAction: "South Lhonak Moraine Dam failure detected by NESAC satellite. Sound Chungthang and Mangan sirens immediately. Evacuate downstream NH-10 corridor.",
        impactedPopulation: 42000,
        safeShelter: "Mangan District Administrative Stadium Relief Camp (+120m Elevation)"
      }
    },
    {
      id: "meghalaya_cloudburst_landslide",
      title: "Mawsynram Cloudburst & National Highway 6 Cutoff (Meghalaya)",
      type: "LANDSLIDE",
      coordinates: [25.2986, 91.5822],
      zoom: 10,
      ministryConcern: "MDoNER, BRO & Meghalaya SDMA",
      telemetry: {
        rainfall1h: 84.0, // mm/hr extreme rainfall
        rainfall24h: 420.0,
        soilSaturationPct: 98.4,
        slopeAngleDeg: 42
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 15,
        floodWaveSpeedKmh: 30,
        recommendedAction: "Multiple debris flows detected along Shillong-Silchar highway. Border Roads Organisation (BRO) tasked for emergency clearance. Halt commercial traffic.",
        impactedPopulation: 29000,
        safeShelter: "Cherrapunji Community Hall & Elevated Safe Shelter"
      }
    },
    {
      id: "arunachal_seismic_rupture",
      title: "Main Central Thrust Himalayan Seismic Event (Arunachal Pradesh)",
      type: "EARTHQUAKE",
      coordinates: [28.2180, 94.7278],
      zoom: 9,
      ministryConcern: "MDoNER, NCS & Arunachal Pradesh SDMA",
      telemetry: {
        magnitude: 6.8,
        depthKm: 10,
        peakGroundAccel: "0.45g",
        pWaveArrivalSec: 0,
        sWaveArrivalSec: 18
      },
      preJudgement: {
        riskLevel: "RED",
        predictedBreachTimeMin: 0,
        floodWaveSpeedKmh: 0,
        recommendedAction: "Major earthquake in West Siang sector. Mobilize NDRF 12th Battalion (Itanagar). Inspect Upper Siang hydel dams for structural fissures.",
        impactedPopulation: 54000,
        safeShelter: "Aalo General Ground Open Relief Center"
      }
    }
  ],

  // Deployed Autonomous Nodes across North East India
  DEPLOYED_BEACONS: [
    { id: "BEACON-AS-01", name: "Majuli Island Ferry Ghat", lat: 26.9450, lng: 94.2100, status: "ONLINE", battery: 98, solarW: 48, signal: "NESAC_SAT_OK" },
    { id: "BEACON-AS-02", name: "Kaziranga Forest Outpost", lat: 26.5775, lng: 93.1711, status: "ONLINE", battery: 94, solarW: 50, signal: "LORA_MESH_OK" },
    { id: "BEACON-SK-01", name: "Chungthang Teesta Bridge", lat: 27.6040, lng: 88.6470, status: "ONLINE", battery: 91, solarW: 42, signal: "NESAC_SAT_OK" },
    { id: "BEACON-ML-01", name: "Mawsynram Ridge Mast", lat: 25.3050, lng: 91.5850, status: "ONLINE", battery: 96, solarW: 45, signal: "LORA_MESH_OK" },
    { id: "BEACON-AR-01", name: "Pasighat Siang Riverbank", lat: 28.0667, lng: 95.3333, status: "ONLINE", battery: 100, solarW: 52, signal: "NESAC_SAT_OK" }
  ]
};
