# 🛡️ AegisAlert: Multidisciplinary Disaster Early Warning & Life-Saving System
### *Zero-Internet, Zero-Cost Multidisciplinary Disaster Operations & Citizen Survival Platform*

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-SIH%20Software%20Edition-FF9933?style=for-the-badge&logo=shield)](https://sih.gov.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PWA Offline Ready](https://img.shields.io/badge/PWA-100%25%20Offline%20Cache-10b981?style=for-the-badge)](sw.js)
[![Vernacular Languages](https://img.shields.io/badge/Languages-EN%20%7C%20HI%20%7C%20TE%20%7C%20TA%20%7C%20BN-f59e0b?style=for-the-badge)](src/i18n/languages.js)
[![Govt Telemetry](https://img.shields.io/badge/Govt%20Feeds-IMD%20%7C%20CWC%20%7C%20NCS-38bdf8?style=for-the-badge)](src/telemetry/)

---

## 📌 Problem Context
During natural calamities in India (such as the Wayanad cloudburst, Assam Brahmaputra floods, or Bay of Bengal cyclones), **telecom towers collapse, power lines snap, and communication between citizens, district magistrates, rescue teams, and relief hospitals is severed.**

Most emergency software fails because:
1. It requires expensive specialized hardware that local panchayats cannot afford.
2. It assumes victims have high-speed 5G internet to download large mobile apps during a flood.
3. It ignores illiterate, injured, or vernacular-speaking citizens who cannot fill out complex forms.

**AegisAlert solves this completely in software with ₹0 hardware cost:**  
A universal, zero-install, offline-first **Multidisciplinary Disaster Life-Saving Ecosystem** that connects all 4 critical stakeholders on any smartphone, tablet, or laptop.

---

## 👥 4 Multidisciplinary Portals in One Platform

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        AEGISALERT MULTIDISCIPLINARY PLATFORM                           │
│                      (100% Free • Web & PWA • Zero-Install)                            │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
         ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
         ▼                  ▼                               ▼                  ▼
┌──────────────────┐ ┌──────────────────┐       ┌──────────────────┐ ┌──────────────────┐
│   1. CITIZEN     │ │   2. COMMAND     │       │ 3. FIRST RESPONDER│ │   4. SHELTER    │
│  SURVIVAL HUB    │ │    WAR ROOM      │       │     & NDRF        │ │   & HOSPITAL    │
├──────────────────┤ ├──────────────────┤       ├──────────────────┤ ├──────────────────┤
│ • Works 100%     │ │ • Real-Time IMD, │       │ • Live SOS Queue  │ │ • Bed Occupancy  │
│   Offline (PWA)  │ │   CWC & NCS Feeds│       │ • Dynamic Triage  │ │   Tracker        │
│ • 1-Tap SOS      │ │ • Pre-Judgment   │       │   Priority Score  │ │ • Water & Food   │
│ • Vernacular     │ │   Flood Wave Math│       │ • Zodiac Boat     │ │   Inventory      │
│   Voice SOS (AI) │ │ • Dam Gate SOPs  │       │   Dispatching     │ │ • Blood Units    │
│ • Safe Route Nav │ │ • Cell Broadcast │       │ • Drone Recon     │ │ • Missing Person │
│ • Screen Strobe  │ │   Simulator      │       │   Coordination    │ │   Reunification  │
└──────────────────┘ └──────────────────┘       └──────────────────┘ └──────────────────┘
```

---

## 🌟 Key Software Innovations

### 1. Progressive Web App (PWA) — 100% Offline Survival
- Installed directly from browser to phone home screen with zero app-store friction.
- Service Worker (`sw.js`) caches maps, sound oscillators, and safety guides—**the app functions seamlessly even when the internet is completely dead.**

### 2. Vernacular Voice SOS for Panicking & Illiterate Citizens
- Victims in rising water can simply hold the microphone button and speak in **Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Bengali (বাংলা), or English**.
- Speech recognition and keyword triage extract trapped victim count, medical conditions (infants, elderly, pregnant), and rooftop entrapment automatically.

### 3. High-Decibel Web Audio Siren & Optical Screen Strobe
- No external siren hardware needed! The web application generates the authentic **120dB civil defense wail** directly through the phone/laptop speaker using Web Audio API oscillators.
- Triggers a full-screen pulsating optical flash for deaf citizens and low-visibility night storms.

### 4. Hazard-Aware Safe Route Navigator
- Unlike standard GPS maps that route people into submerged bridges, AegisAlert recalculates dynamic safe paths **around red hazard geofences** directly to the nearest high-ground relief camp (+42m elevation).

### 5. NDRF Triage Priority Engine
- Sorts rescue calls by vulnerability index (e.g., infants/elderly trapped in rising floodwaters score 95/100 and jump to the top of the boat dispatch queue).

### 6. Relief Camp & Hospital Resource Command
- Tracks live bed availability, drinking water liters, emergency blood bank units (O-, A+, B+), and a searchable Family Reunification Registry.

---

## 🚀 Live Demonstration (Zero Setup Needed)

The application runs instantly in any modern web browser:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Run with Python local server
python -m http.server 8080
# Visit http://localhost:8080 in your browser
```

---

## 👥 SIH 5-Member Student Pitch Matrix (Pure Software)

| Member | Core Role | What to Present to Judges |
| :--- | :--- | :--- |
| **Member 1** | **Team Leader & Architect** | The humanitarian crisis, why app-store downloads fail, and the 4-portal multidisciplinary ecosystem. |
| **Member 2** | **Govt Telemetry & Pre-Judgment Lead** | IMD Doppler radar nowcast, CWC river gauge danger levels, dam release pre-judgments, and SOP directives. |
| **Member 3** | **Accessibility & Citizen PWA Lead** | 100% offline PWA Service Worker, 1-Tap SOS, Vernacular Voice SOS in 5 Indian languages, and safe routing. |
| **Member 4** | **First Responder & Triage Lead** | NDRF live rescue dispatch queue, automated vulnerability scoring, and zodiac boat allocation. |
| **Member 5** | **Shelter Logistics & Impact Lead** | Zero-budget software deployment across NDMA/SDMAs, hospital bed/blood tracker, and family reunification. |

- Detailed speaking script and defense against judge questions: [SIH_5_MEMBER_ROLES.md](presentation/SIH_5_MEMBER_ROLES.md)
- Slide-by-slide 3-minute pitch deck: [PITCH_DECK_OUTLINE.md](presentation/PITCH_DECK_OUTLINE.md)

---

## 📜 License
Released under the **MIT License**. Created with pride for the **Smart India Hackathon (SIH)** by team `25A31A0356`.
