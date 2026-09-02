# 🇮🇳 AegisAlert National: Apex Multi-Ministry Disaster Management Grid of India
### *National Emergency Operations Centre (NEOC) • Ministry of Home Affairs (MHA) & NDMA*

[![National Apex Grid](https://img.shields.io/badge/National%20Grid-Govt%20of%20India%20Apex-FF9933?style=for-the-badge&logo=shield)](https://ndma.gov.in)
[![SIH National Edition](https://img.shields.io/badge/Smart%20India%20Hackathon-National%20Contender-138808?style=for-the-badge)](https://sih.gov.in)
[![7 Ministries Integrated](https://img.shields.io/badge/Ministries-MHA%20%7C%20MoD%20%7C%20JalShakti%20%7C%20MoES%20%7C%20DoT%20%7C%20MDoNER-0284c7?style=for-the-badge)](src/config.js)
[![Pan-India Languages](https://img.shields.io/badge/Languages-8%20National%20%26%20Regional%20Belts-f59e0b?style=for-the-badge)](src/i18n/languages.js)

---

## 📌 The National Vision
Natural disasters in India do not conform to state boundaries or ministerial silos:
- A cloudburst in the Himalayas floods downstream plains across multiple states.
- High-tide coastal cyclones strike multiple state coastlines simultaneously.
- When electrical grids and cell towers collapse, **isolated state systems fail without centralized national coordination.**

**AegisAlert National** is engineered as the **Apex Multi-Ministry Disaster Early Warning & Life-Saving Command Grid of the Republic of India**, operated directly from the **National Emergency Operations Centre (NEOC), New Delhi** under the **National Disaster Management Authority (NDMA) & Ministry of Home Affairs (MHA)**.

---

## 🏛️ Integrated Central Ministries Grid

AegisAlert breaks departmental silos by synthesizing real-time data and authority workflows across **7 Union Ministries**:

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

## 🗺️ 4 Pan-India Disaster Theaters Covered

1. **🌊 Eastern & North-Eastern Theater:** Brahmaputra Basin & Majuli Island embankment breach forecasting (*MHA + MDoNER + Brahmaputra Board*).
2. **⛰️ Northern Himalayan Theater:** Cloudbursts, flash surges, and highway blockages across Uttarakhand, Himachal Pradesh, and J&K (*MHA + Indian Army Central Command + MoES*).
3. **🌀 Southern & Eastern Coastal Theater:** Bay of Bengal & Arabian Sea super cyclones with storm surge inundation from Puri to Andhra and Tamil Nadu (*Indian Navy Eastern Fleet + Coast Guard*).
4. **🌊 Western Peninsular Theater:** Western Ghats cloudbursts and high-tide urban estuary flash flooding in Mumbai and Konkan (*Maharashtra SDMA + Ministry of Railways*).

---

## 👥 4 Multidisciplinary Portals for the Nation

### 1. 🏛️ National Command War Room (NEOC New Delhi)
- Real-time ingest of **IMD Doppler radars**, **CWC river hydrographs (5,300+ dams)**, and **NCS seismic telemetry**.
- **Predictive Pre-Judgments:** Predicts embankment breaches and flood wave arrival times to the minute.
- **Damage Prevention Directives:** Issues national directives for controlled dam spillway discharges and highway closures.

### 2. 🧑‍🤝‍🧑 Citizen Survival Hub (Zero-Install Offline PWA)
- **100% Offline Resilience:** Operates through PWA Service Workers even when cell towers collapse.
- **Vernacular Voice SOS (AI-Powered):** Citizens can speak in **Hindi, Assamese, Bengali, Marathi, Telugu, Tamil, Gujarati, or English** to report trapped family members.
- **Hazard-Aware Safe Route Navigator:** Directs citizens around red flood zones to the nearest safe highland shelter (+28m to +120m elevation).
- **Full-Screen Optical Strobe & Siren:** Sounds a 120dB civil defense wail through phone speakers and flashes visual strobes for hearing-impaired citizens.

### 3. 🎖️ NDRF & Armed Forces Tactical Command (HADR)
- **Tri-Services Tasking:** One-click authorization for **Indian Air Force (IAF) Mi-17/Chinook helicopter sorties**, **Army Corps of Engineers (Bailey Bridges)**, and **Indian Coast Guard** offshore patrol vessels.
- **Dynamic Vulnerability Triage:** Automatically scores SOS calls (0 to 100) and prioritizes infants, pregnant mothers, and rooftop-trapped victims.

### 4. 🏥 National Relief Shelter & Emergency Health Command
- Live tracking of safe highland camp bed occupancies, drinking water buffer (liters), and emergency blood bank buffer units.
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
| **Member 1** | **Team Leader & Apex Architect** | The national mandate, why state-isolated apps fail in interstate disasters, and the NEOC multi-ministry integration. |
| **Member 2** | **National Telemetry & Pre-Judgment Lead** | IMD radar network, Central Water Commission 5,300-dam safety monitoring, and dam crest release pre-judgments. |
| **Member 3** | **Citizen Accessibility & PWA Lead** | 100% offline PWA Service Worker, 8-language vernacular Voice SOS, and elevated highland route navigation. |
| **Member 4** | **Tri-Services & NDRF Operations Lead** | NDRF 16 battalions, IAF helicopter sortie tasking, Army Bailey bridge deployment, and vulnerability triage. |
| **Member 5** | **National Logistics & Scalability Lead** | Interstate shelter tracking, blood buffer monitoring, family reunification, and ₹0 hardware cost for the Union of India. |

- Detailed speaking script and judge Q&A defense: [SIH_5_MEMBER_ROLES.md](presentation/SIH_5_MEMBER_ROLES.md)
- Slide-by-slide 3-minute pitch deck: [PITCH_DECK_OUTLINE.md](presentation/PITCH_DECK_OUTLINE.md)

---

## 📜 License
Released under the **MIT License**. Created with pride for the **Smart India Hackathon (SIH)** by team `25A31A0356`.
