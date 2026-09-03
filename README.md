# 🛡️ AEGIS ALERT: AI-Powered Multi-Hazard Early Warning & Situational Awareness Platform

> **"See the Risk. Understand the Threat. Act Early."**  
> *5-Member Student Innovation Inspired by Smart India Hackathon (SIH26001 – SIH26192)*

---

## 📌 Executive Summary & Responsible AI Disclaimer

**AEGIS ALERT** is an integrated student innovation prototype demonstrating centralized, multi-hazard environmental intelligence across India. The platform unifies mathematical risk fusion, cyber-physical sensor telemetry, automated weather station anomaly detection, 6-hour predictive nowcasting, and an intelligent state-aware conversational assistant (**Ask AEGIS / WeatherGPT**).

> ⚠️ **RESPONSIBLE AI & PROTOTYPE NOTICE:**  
> AEGIS ALERT is a student innovation prototype developed for demonstration, research, and hackathon presentation purposes. Risk scores, forecasts, and alerts in Demo Mode are generated using synthetic mathematical models and must **NOT** be used for certified emergency management or official public safety operations.

---

## 🏆 Mapping to Smart India Hackathon Problem Statements

AEGIS ALERT directly addresses **15 Smart India Hackathon problem statements**:

| SIH Problem ID | Problem Statement Title | Implemented Component in AEGIS ALERT |
|---|---|---|
| **SIH26001** | AI-Based Early Warning & Landslide Risk Monitoring | Landslide Mohr-Coulomb shear analysis & slope stability engine (`src/telemetry/risk_fusion_engine.js`) |
| **SIH26068** | WeatherGPT | **Ask AEGIS** state-aware conversational AI assistant (`src/ai/aegis_assistant.js`) |
| **SIH26069** | National Weather Big Data Analytics | Pan-India Multi-City Telemetry Database (`src/data/locations_data.js`) |
| **SIH26071** | Heavy Rainfall Early Warning & Inundation Prediction | Inundation prediction & river gauge vs danger threshold analyzer |
| **SIH26072** | Thunderstorm & Lightning Nowcasting | CAPE index & 1-6 hour convective strike nowcasting |
| **SIH26073** | Weather Station Anomaly Detection | Automated Weather Station zero-point drift & quality control engine |
| **SIH26077** | Hyperlocal Severe Weather Early Warning | Precision geofencing & 6-hour localized forecast timeline |
| **SIH26078** | Spatio-Temporal Extreme Weather Tracking | Leaflet GIS Tactical Map with 8 multi-hazard toggleable layers |
| **SIH26080** | Monsoon Rainfall Forecast Post-Processing | Precipitation curve post-processing & runoff acceleration modeling |
| **SIH26082** | Air Pollution–Weather Coupled Forecasting | Coupled PM2.5/PM10 dispersion & thermal inversion modeling |
| **SIH26083** | Extreme Heatwave & Human Thermal Stress | Wet Bulb Globe Temperature (WBGT) & Steadman Heat Index module |
| **SIH26084** | Thunderstorm, Hail & Cloudburst Nowcasting | Cloudburst core detection (>100 mm/h) & pilgrim route alarms |
| **SIH26085** | Urban Flood Nowcasting | Urban drainage bottleneck & stormwater flood prediction (Musi, Mithi) |
| **SIH26191** | Hazard-Based Red Zones & Vulnerable Habitations | Statutory Red-Zone Habitations Register & evacuation corridors |
| **SIH26192** | Flash Flood Prediction for Hilly Regions | High-velocity mountain gorge surge & debris flow prediction |

---

## 🚀 Key Platform Features & Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          AEGIS ALERT PLATFORM ARCHITECTURE                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 🛰️ ORBITAL TIER: ISRO NavIC / INSAT-3DR / Radar InSAR Direct Downlink                  │
│                        │ (S-Band / C-Band Transponders)                                │
│                        ▼                                                               │
│ 🏛️ COMMAND TIER: Disaster Management Offices (NEOC / MHA / SDMA)                       │
│                        │ (Sovereign SHA-256 Cryptographic Authorization)               │
│        ┌───────────────┴───────────────────────────────┐                               │
│        ▼                                               ▼                               │
│ 📶 CELLULAR TOWER TETHERING (C-DOT SACHET)     📡 DIRECT AIRWAVE & SATELLITE (868MHz)  │
│        │                                               │                               │
│        ▼                                               ▼                               │
│ 📱 DEVICES WITH INTERNET:                      📢 DEVICES WITHOUT INTERNET (OFFLINE):  │
│ • 4G/5G Smartphones (PWA Push)                 • Autonomous 120dB Siren Masts (LoRa)   │
│ • Smart City Highway LED Billboards            • 2G Feature Phones (Cell Broadcast)    │
│ • Indian Railways PIDS Displays                • ISRO NavIC Village Terminals          │
│ • Hospital Trauma Influx Boards                • FM Radio 100.1MHz Carrier Override    │
│ • Television & OTT Red Crawl Overlays          • Village Panchayat RF Loudspeakers     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Multi-Hazard Situation Overview Hero:**
   - Selected Location selector (Hyderabad, Guwahati, Dehradun, Visakhapatnam, Vijayawada, Shillong, Mumbai, Chennai, Bengaluru).
   - **AEGIS Composite Risk Score** (0-100) with dynamic risk level (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
   - 6 Dynamic Hazard Cards: Rainfall, Flood, Landslide, Lightning, Heatwave, Air Pollution.

2. **Interactive Tactical GIS Map:**
   - 8 Layer Checkboxes: Rainfall Radar, Flood Inundation, Landslides, Lightning Nowcast, Heat Domes, Pollution Plumes, Red Zones, Weather Stations.
   - Interactive popups with live river stages, slope angles, exposed populations, and evacuation routes.

3. **6-Hour Demonstration Predictive Forecast:**
   - Visual time-series charts (10:00 AM – 03:00 PM) projecting Rain, Temp, Humidity, Wind, Flood Risk, and Lightning Risk.

4. **Ask AEGIS — AI Assistant (SIH26068 WeatherGPT):**
   - Natural conversational interface answering questions using active platform telemetry.
   - Clickable prompt chips for instant viva demonstrations.

5. **One-Click "Run Emergency Scenario" (90-Second Crisis Lifecycle):**
   - T+00s: Heavy Rainfall onset ➔ T+30s: Flood threshold breached ➔ T+50s: Lightning storm spikes ➔ T+70s: Evacuation alert broadcast ➔ T+90s: AI synthesis report.

---

## 💻 How to Run Locally

1. **Start the Multi-Threaded Server:**
   ```powershell
   python server.py
   ```
2. **Open in Browser:**  
   Navigate to `http://localhost:8080` (or `http://127.0.0.1:8080`).
3. **Verify API Endpoints:**
   ```powershell
   curl.exe http://localhost:8080/api/status
   curl.exe http://localhost:8080/api/locations
   curl.exe http://localhost:8080/api/gov/export?format=csv
   ```

---

## 📚 Academic Research, Scientific Formulas & Statutory References

Complete publication-grade documentation dossiers have been compiled for hackathon evaluation juries, academic vivas, and national deployment:

* 📄 **[Scientific Research & Statutory References Dossier](presentation/RESEARCH_AND_REFERENCES.md):**  
  *Detailed mathematical models for Landslide Mohr-Coulomb shear analysis, SCS-CN Flood Inundation, CAPE Lightning Nowcasting, Steadman Heat Stress Index, NDMA Guidelines, IMD SOPs, and 3GPP TS 23.041 Cell Broadcast standards.*
* 📊 **[Comprehensive Feasibility & Viability Analysis](presentation/FEASIBILITY_AND_VIABILITY_ANALYSIS.md):**  
  *Technical, economic, operational, and legal viability matrix evaluating indigenous ₹18,500 edge nodes vs ₹3.5L legacy systems.*
* 🏛️ **[Executive Presentation & SIH Jury Dossier](presentation/PROJECT_PRESENTATION_DOSSIER.md):**  
  *10-minute presentation guide, 5-member student team roles, and live evaluation walkthrough.*
* 📡 **[Hardware & Omnichannel Architecture Diagrams](presentation/HARDWARE_ARCHITECTURE_DIAGRAMS.md):**  
  *Orbital, Command, Tower Tethering, and Output device schematics for zero-internet blackout operations.*

---

## 👥 5-Member Student Engineering Team Roles

1. **Member 1 (Team Lead & AI/ML Engineer):** Multi-Hazard Risk Fusion Engine & WeatherGPT Conversational Model.
2. **Member 2 (GIS & Spatial Systems Lead):** Tactical Leaflet GIS Map, Red Zone Hazard Layers, Inundation Buffers.
3. **Member 3 (Full-Stack Web Architect):** Real-time Dashboard, 6-Hour Forecast Visualizer & Analytics Charts.
4. **Member 4 (Embedded & Telecom Specialist):** Sub-GHz 868MHz Siren Masts & C-DOT SACHET Cell Broadcast Bridge.
5. **Member 5 (Domain & Disaster Protocols Lead):** SOP Formulation, Vulnerable Habitations Register & Statutory Compliance.
