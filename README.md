# 🛡️ AegisAlert: MDoNER Disaster Early Warning & Life-Saving System
### *Autonomous Multi-Hazard Early Warning & Citizen Survival Platform for North East India & Cross-Ministry SIH Deployments*

[![MDoNER Alignment](https://img.shields.io/badge/Target%20Ministry-MDoNER%20%7C%20North%20Eastern%20Council-FF9933?style=for-the-badge&logo=shield)](https://mdoner.gov.in)
[![Satellite Partner](https://img.shields.io/badge/Satellite%20Partner-ISRO%20%2F%20NESAC%20Meghalaya-0284c7?style=for-the-badge)](https://nesac.gov.in)
[![SIH Software Track](https://img.shields.io/badge/Smart%20India%20Hackathon-Software%20Track-10b981?style=for-the-badge)](https://sih.gov.in)
[![Languages](https://img.shields.io/badge/Languages-Assamese%20%7C%20Bengali%20%7C%20Hindi%20%7C%20English-f59e0b?style=for-the-badge)](src/i18n/languages.js)

---

## 📌 Strategic Ministry Alignment: Ministry of Development of North Eastern Region (MDoNER)

The **North Eastern Region (NER)** is India’s most ecologically fragile and multi-hazard territory:
- **Catastrophic Annual Floods:** The Brahmaputra & Barak river basins submerge millions of hectares, cutting off riverine islands like Majuli.
- **Glacial Lake Outburst Floods (GLOF) & Landslides:** High Himalayan lakes in Sikkim (like South Lhonak lake) and intense cloudbursts in Meghalaya (Mawsynram/Cherrapunji) trigger violent mountain surges.
- **Severe Seismic Risk:** All 8 North Eastern states fall within **Zone V** (the highest earthquake hazard zone in India).
- **Communication Blackouts:** Optical fiber cables snap and cell towers wash away during floods, severing communication in deep hill valleys.

**AegisAlert solves this for MDoNER with ₹0 specialized hardware cost:**  
An offline-first, multidisciplinary digital ecosystem designed specifically for the terrain, languages, and multi-agency response of North East India.

---

## 🏛️ Cross-Ministry & Multi-Agency Interoperability

While anchored with **MDoNER** and the **North Eastern Council (NEC)**, AegisAlert unifies critical central and state ministries:

| Ministry / Organization | Role in AegisAlert |
| :--- | :--- |
| **MDoNER / North Eastern Council (NEC)** | Inter-state disaster coordination and rapid resource allocation across all 8 North Eastern states. |
| **ISRO / NESAC (Umiam, Meghalaya)** | Direct ingestion of satellite flood inundation maps and mountain landslide zonation. |
| **Ministry of Jal Shakti / Brahmaputra Board & CWC** | Real-time river gauge hydrographs, dam inflow/outflow, and embankment breach forecasting. |
| **Ministry of Home Affairs / NDMA & NDRF** | Direct tasking of **NDRF 1st Battalion (Guwahati)** and **12th Battalion (Arunachal Pradesh)**. |
| **Border Roads Organisation (BRO)** | Landslide debris clearance on critical mountain highways (NH-6, NH-10). |

---

## 👥 4 Multidisciplinary Portals for North East India

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        AEGISALERT MDoNER REGIONAL PLATFORM                             │
│                      (100% Software • Web & PWA • Zero-Install)                        │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
         ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
         ▼                  ▼                               ▼                  ▼
┌──────────────────┐ ┌──────────────────┐       ┌──────────────────┐ ┌──────────────────┐
│   1. CITIZEN     │ │   2. MDoNER      │       │ 3. NDRF 1st &    │ │   4. HIGHLAND    │
│  SURVIVAL HUB    │ │  COMMAND ROOM    │       │     12th Bn      │ │  RELIEF CAMPS    │
├──────────────────┤ ├──────────────────┤       ├──────────────────┤ ├──────────────────┤
│ • Works Offline  │ │ • NESAC / CWC    │       │ • Brahmaputra    │ │ • Majuli Highland│
│ • Assamese / NE  │ │   Satellite Feeds│       │   Zodiac Boats   │ │   Capacity       │
│   Voice SOS      │ │ • GLOF & Flood   │       │ • Mountain Rescue│ │ • Water & Buffer │
│ • Safe Highland  │ │   Pre-Judgments  │       │ • Dynamic Triage │ │ • Missing Family │
│   Radar Navigation││ • Embankment SOPs│       │   Priority Score │ │   Reunification  │
└──────────────────┘ └──────────────────┘       └──────────────────┘ └──────────────────┘
```

---

## 🌟 North East Regional Innovations

### 1. Assamese (অসমীয়া) & North Eastern Vernacular Voice SOS
- Panicking or illiterate villagers trapped on riverine *chaporis* can hold the microphone and speak in **অসমীয়া (Assamese)**, **বাংলা (Bengali)**, or **हिंदी (Hindi)**.
- The AI extracts trapped family member counts, rooftop entrapment, and medical emergencies automatically.

### 2. Glacial Lake Outburst Flood (GLOF) & Landslide Early Warning
- Pre-loaded with predictive models for the **Sikkim Teesta GLOF** and **Mawsynram NH-6 Highway Landslide** cutoffs.
- Predicts debris flow and embankment breach timelines 25 to 45 minutes in advance.

### 3. PWA 100% Offline Resilience
- Built with Progressive Web App Service Workers (`sw.js`).
- Once loaded, the system caches maps, emergency siren sound synthesizers, and safety checklists locally—**operating flawlessly even when floodwaters wash away telecommunication towers.**

---

## 🚀 Live Demonstration (5-Second Run)

The platform runs instantly in any browser without npm or complex setups:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Run with Python local server
python -m http.server 8080
# Visit http://localhost:8080 in your browser
```

---

## 👥 SIH 5-Member Student Pitch Matrix (MDoNER Track)

| Member | Core Role | What to Present to Judges |
| :--- | :--- | :--- |
| **Member 1** | **Team Leader & Architect** | North East vulnerability, the MDoNER cross-ministry mandate, and why conventional apps fail. |
| **Member 2** | **Govt & NESAC Telemetry Lead** | Satellite flood intake from ISRO/NESAC, Brahmaputra Board river gauges, GLOF and dam breach pre-judgments. |
| **Member 3** | **Citizen PWA & Vernacular Lead** | 100% offline PWA Service Worker, Assamese (অসমীয়া) Voice SOS, and elevated highland route navigation. |
| **Member 4** | **NDRF Responders Lead** | NDRF 1st (Guwahati) & 12th (Arunachal) battalions, zodiac boat dispatch, and mountain landslide clearing. |
| **Member 5** | **Highland Logistics & Impact** | Majuli and Sikkim elevated camp trackers, family reunification portal, and ₹0 national deployment. |

- Detailed speaking script and defense against judge questions: [SIH_5_MEMBER_ROLES.md](presentation/SIH_5_MEMBER_ROLES.md)
- Slide-by-slide 3-minute pitch deck: [PITCH_DECK_OUTLINE.md](presentation/PITCH_DECK_OUTLINE.md)

---

## 📜 License
Released under the **MIT License**. Created with pride for the **Smart India Hackathon (SIH)** by team `25A31A0356`.
