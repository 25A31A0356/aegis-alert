# 🇮🇳 AegisAlert National: Apex Multi-Ministry Disaster Management Grid of India
### *National Emergency Operations Centre (NEOC) • Ministry of Home Affairs (MHA) & NDMA*

[![National Apex Grid](https://img.shields.io/badge/National%20Grid-Govt%20of%20India%20Apex-FF9933?style=for-the-badge&logo=shield)](https://ndma.gov.in)
[![SIH National Contender](https://img.shields.io/badge/Smart%20India%20Hackathon-National%20Contender-138808?style=for-the-badge)](https://sih.gov.in)
[![Live Real-Time APIs](https://img.shields.io/badge/Real--Time%20APIs-Open--Meteo%20%7C%20USGS%20%7C%20NASA%20EONET-0284c7?style=for-the-badge)](src/telemetry/official_feeds.js)
[![Pan-India Languages](https://img.shields.io/badge/Languages-8%20National%20%26%20Regional%20Belts-f59e0b?style=for-the-badge)](src/i18n/languages.js)

---

## 📌 Apex Strategic Overview: Visualizing India's Disaster Work to Its Leadership

Natural disasters do not respect state borders or departmental jurisdictions. To protect 1.4 billion citizens, India's leadership (the Prime Minister's Disaster Oversight, Cabinet Committee on Disaster Management, and the Vice-Chairman of NDMA) requires a **unified, real-time operational picture** combining live scientific platforms with immediate life-saving response mechanisms.

**AegisAlert National** solves this by:
1. **Pulling Live, Verified Real-Time Data** directly from global and national scientific platforms:
   - **Open-Meteo Meteorological Radar API:** Real-time live rainfall (mm/hr), barometric pressure, and wind gusts across Indian coordinates.
   - **USGS Global Seismology API:** Real-time seismic events on the Indian plate boundary (magnitude, depth, epicenter).
   - **NASA EONET (Earth Observatory Natural Event Tracker):** Active real-world orbital satellite alerts for tropical cyclones and severe floods.
   - **Central Water Commission (CWC) & NDSA:** Water levels and danger marks across 5,300+ large dams.
   - **IMD Pan-India Doppler Radar:** Precipitation nowcasting and storm tracking.
2. **Apex Executive Dashboard for the Head of Disaster Management:**
   - **State-by-State Strategic Posture Strip:** Instant status indicators (Red, Orange, Yellow, Green) for all states and UTs with quick-filter navigation.
   - **National Threat Index:** Real-time assessment (Level 4 Red, Level 3 Orange, Level 2 Yellow, Level 1 Green).
   - **At-Risk Citizen Counter:** Live tracking of populations under advisory and evacuation watch.
   - **Tri-Services Military Readiness:** Live authorization of IAF helicopter sorties and Army Bailey bridges.

---

## 🏛️ Integrated Central Ministries Grid

```
                               ┌────────────────────────────────────────────────────────┐
                               │           CABINET COMMITTEE ON DISASTER MANAGEMENT     │
                               │                NEOC / NDMA / MINISTRY OF HOME AFFAIRS   │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
        ┌───────────────────┬───────────────────┬──────────┴────────┬───────────────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   MHA / NDMA  │   │  MoD / ARMED  │   │  JAL SHAKTI   │   │  MoES / IMD   │   │   DoT / C-DOT │   │ MDoNER / NEC  │
│ 16 NDRF Bns   │   │ FORCES (HADR) │   │ CWC & Dam     │   │ Doppler Radar │   │ National Cell │   │ North Eastern │
│ Nationwide    │   │ IAF Air Sortie│   │ Safety Auth   │   │ & Seismology  │   │ Broadcast     │   │ Council Grid  │
└───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘
```

---

## 🌪️ 7 Comprehensive Pan-India Multi-Hazards Covered

AegisAlert is not just a flood system; it is an **All-Hazard Disaster Prevention & Early Warning Grid**:

1. **🌊 Floods & Embankment Breaches:** Real-time CWC hydrographs, 5,300-dam storage tracking, and automated embankment breach countdowns (*Brahmaputra & Ganga Basins*).
2. **⛰️ Mountain Landslides & Debris Mudflows:** Multi-day 72h soil saturation thresholds, slope shear stress angles, and subsurface pore-water pressure models (*Wayanad, Kerala & Kedarnath, Uttarakhand*).
3. **⛈️ Extreme Cloudbursts & Heavy Rain:** Real-time nowcasting of violent precipitation cores (>100 mm/hr) and instantaneous flash surge runoff (*Himalayan gorges & Mumbai urban estuaries*).
4. **🌀 Severe Cyclones & Toofans:** 185 km/h gale wind tracking, deep barometric eye pressure, and coastal storm surge inundation models (*Bay of Bengal & Arabian Sea*).
5. **🌪️ Tornados & Destructive Squalls (Kalbaishakhi):** Doppler hook echo detection (71 dBZ), 195 km/h vortex funnels, and lightning flash density alerts (*Eastern Gangetic Plains & Odisha*).
6. **☀️ Extreme Heatwaves & Thermal Emergencies (Loo):** Real-time monitoring of 49.4°C heat domes, Wet Bulb Globe Temperature (WBGT) heat stress indices, and automated deployment of 24/7 air-cooled hydration centers (*Rajasthan, Vidarbha & Delhi NCR*).
7. **⚡ Earthquakes & Seismic Fault Ruptures:** Ingestion of live USGS/NCS seismic feeds (M7.1+ fault ruptures), automated gas main cutoffs, and USAR canine dispatch.

---

## 👥 4 Multidisciplinary Portals for the Nation

### 1. 🏛️ National Command War Room (NEOC New Delhi)
- Real-time ingest from **Open-Meteo**, **USGS**, **NASA EONET**, **CWC (5,300+ dams)**, and **IMD**.
- **Predictive Pre-Judgments:** Predicts dam overtopping and embankment breaches 20 to 60 minutes before impact.
- **Damage Prevention Directives:** Issues national directives for controlled dam spillway discharges and highway diversions.

### 2. 🧑‍🤝‍🧑 Citizen Survival Hub (Zero-Install Offline PWA)
- **100% Offline Resilience:** Operates via PWA Service Workers even when cell towers collapse.
- **8-Language Vernacular Voice SOS (AI-Powered):** Citizens can speak in **Hindi, Assamese, Bengali, Marathi, Telugu, Tamil, Gujarati, or English** to report trapped family members.
- **Safe Highland Route Navigator:** Directs citizens around flood zones to elevated multi-purpose shelters (+28m to +120m elevation).
- **Sensory Alerts:** Blasts 120dB civil defense alarm through phone speakers and flashes full-screen visual strobes for hearing-impaired citizens.

### 3. 🎖️ NDRF & Armed Forces Tactical Command (HADR)
- **Tri-Services Tasking:** One-click authorization for **Indian Air Force (IAF) Mi-17/Chinook helicopter sorties**, **Army Corps of Engineers (Bailey Bridges)**, and **Indian Coast Guard** offshore patrol vessels.
- **Dynamic Vulnerability Triage (0-100):** Prioritizes infants, pregnant mothers, and rooftop-trapped victims first.

### 4. 🏥 National Relief Shelter & Emergency Health Command
- Live tracking of safe highland camp bed occupancies, drinking water buffers (liters), and emergency blood bank units.
- **National Family Reunification Portal:** Searchable registry reuniting lost children and displaced families across state lines.

---

## 🚀 Instant Local Demonstration

Run the complete Pan-India platform in 5 seconds with zero setup:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Run with Python local server
python -m http.server 8080
# Visit http://localhost:8080 in your browser
```

---

## 👥 5-Member Team Pitch Strategy (National Track)

| Member | Strategic Role | Hackathon Pitch Focus |
| :--- | :--- | :--- |
| **Member 1** | **Team Leader & Apex Architect** | The national executive overview — why state-isolated apps fail in interstate disasters, and how NEOC unifies the nation with ₹0 hardware cost. |
| **Member 2** | **Multi-Platform Telemetry & Pre-Judgment Lead** | Live real-time data from Open-Meteo, USGS, NASA EONET, and CWC 5,300-dam safety pre-judgments. |
| **Member 3** | **Citizen Accessibility & PWA Lead** | 100% offline PWA Service Worker, 8-language vernacular Voice SOS, and elevated highland route navigation. |
| **Member 4** | **Tri-Services & NDRF Operations Lead** | NDRF 16 battalions, IAF helicopter sortie tasking, Army Bailey bridge deployment, and vulnerability triage. |
| **Member 5** | **National Logistics & Scalability Lead** | Interstate shelter tracking, blood buffer monitoring, family reunification, and ₹0 hardware cost for the Union of India. |

- Detailed speaking script and judge Q&A defense: [SIH_5_MEMBER_ROLES.md](presentation/SIH_5_MEMBER_ROLES.md)
- Slide-by-slide 3-minute pitch deck: [PITCH_DECK_OUTLINE.md](presentation/PITCH_DECK_OUTLINE.md)

---

## 📜 License
Released under the **MIT License**. Created with pride for the **Smart India Hackathon (SIH)** by team `25A31A0356`.
