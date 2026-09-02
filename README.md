# 🛡️ AegisAlert: Autonomous Cyber-Physical Disaster Early Warning System
### *Zero-Internet, Zero-Cellular Real-Time Calamity Alerting & Damage Prevention Platform*

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-SIH%20Top%20Contender-FF9933?style=for-the-badge&logo=shield)](https://sih.gov.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Zero-Internet Tested](https://img.shields.io/badge/Zero--Internet-Sub--GHz%20RF%20%26%20NavIC-10b981?style=for-the-badge)](hardware/)
[![Govt Telemetry](https://img.shields.io/badge/Govt%20Feeds-IMD%20%7C%20CWC%20%7C%20NCS-38bdf8?style=for-the-badge)](src/telemetry/)

---

## 📌 Problem Context
During major natural calamities in India (such as the Wayanad cloudburst, Assam Brahmaputra floods, or Bay of Bengal cyclones), **telecom towers collapse, electricity grids fail, and millions of citizens are left with ZERO mobile internet and ZERO cellular phone signal.**

90% of disaster software fails because it assumes citizens have active 4G/5G smartphones with app-store access. When cell towers topple, mobile apps are useless.

**AegisAlert solves the last-mile bottleneck:** It connects official government risk forecasting (IMD, CWC, NCS) directly to **autonomous, solar-powered village alert masts (AegisBeacon)** over long-range Sub-GHz radio waves (868 MHz) and ISRO NavIC satellite downlinks—**requiring zero internet, zero mobile network, and zero app installations by citizens.**

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│               1. GOVERNMENT INCIDENT COMMAND WAR ROOM                  │
│  • Ingests Live IMD Radar, CWC River Gauges & NCS Seismology           │
│  • AI Predictive Risk Pre-Judgment (Calculates crest breach time)      │
│  • Damage Prevention Directives (Dam spillway release, evacuations)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             2. 32-BYTE SUB-GHZ / NAVIC ZERO-INTERNET PACKET            │
│  • Compact binary frame transmitted over 868.1 MHz LoRa & NavIC        │
│  • CRC16-CCITT Cryptographic Checksum (Zero false alarm spoofing)      │
│  • Penetrates storm rain & mountains up to 25 km per hop               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│           3. AUTONOMOUS SOLAR FIELD NODES (AEGISBEACON)                │
│  • 100% Off-Grid Solar + LiFePO4 (72-hour blackout immunity)           │
│  • 120dB Directional Acoustic Horn (Heard across 2 to 3 km)           │
│  • 360° Optical Strobe Array (Visual alert for deaf & night storms)    │
│  • Spoken Vernacular Voice PA (Offline Hindi & English guidance)       │
│  • High-Contrast Alphanumeric LED Ticker (Safe shelter directions)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Live Interactive Demonstration

The repository includes a self-contained, zero-dependency **Dual-Console Simulation Suite**:
1. **Left Screen:** National Incident Commander War Room (Live Telemetry, Hazard Geofencing on Leaflet GIS Map, Damage Prevention Directives).
2. **Right Screen:** Virtual Physical AegisBeacon Pole (Simulates the standalone solar mast with real synthesized 120dB sirens, spoken Hindi/English voice PA, optical strobe lighting, and grid blackout switches).

### How to Run Locally in 5 Seconds
No heavy build tools or npm installation required. Open in any modern web browser:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Run with Python local server
python -m http.server 8080
# Visit http://localhost:8080 in your browser
```

---

## 📦 32-Byte Zero-Internet Radio Frame Specification

Every alert transmitted over airwaves conforms to the compact **AegisPacket** specification:

| Byte Offset | Field Name | Type | Description |
| :---: | :--- | :---: | :--- |
| `00 - 01` | **Sync Preamble** | `0xAE 0x61` | Network sync identifier (`AEGIS`) |
| `02` | **Protocol Version** | `uint8` | Version `0x01` |
| `03` | **Disaster Code** | `uint8` | `1`: Flood, `2`: Cyclone, `3`: Landslide, `4`: Quake |
| `04` | **Alert Severity** | `uint8` | `0`: Green, `1`: Yellow, `2`: Orange, `3`: Red |
| `05 - 06` | **Zone Geofence ID** | `uint16` | Targeted taluk / river basin polygon |
| `07 - 14` | **GPS Coordinates** | `int32[2]` | Fixed-point Latitude & Longitude (*100,000) |
| `15` | **Warning Radius** | `uint8` | Danger radius in kilometers |
| `16` | **Voice Track Code** | `uint8` | Triggers offline voice ROM (Hindi / regional dialects) |
| `17` | **Evacuation Route** | `uint8` | Designated safe corridor ID |
| `18 - 21` | **Timestamp** | `uint32` | Unix epoch time |
| `22` | **Mesh TTL / Hops** | `uint8` | Decremented at each relay mast |
| `23 - 29` | **Shelter ASCII Code**| `char[7]` | Safe relief camp identifier (e.g. `CAMP-01`) |
| `30 - 31` | **CRC16-CCITT** | `uint16` | Polynomial `0x1021`, init `0xFFFF` checksum |

---

## 🛠️ Hardware Specifications (Under ₹3,800 / $45 USD)

- **Microcontroller:** ESP32-WROOM-32D (Dual-Core 240MHz, deep sleep @ 12mA).
- **Radio Transceiver:** Semtech SX1262 / SX1278 (868.1 MHz ISM band, +22 dBm ERP).
- **Acoustic Driver:** 12V 120dB High-Decibel Directional Horn.
- **Visual Alert:** 12V 48-LED Red/Amber Optical Strobe Array.
- **Voice PA:** DFPlayer Mini (MicroSD offline speech ROM) + PAM8403 10W Amp.
- **Power System:** 30W Monocrystalline Solar Panel + 12.8V 6Ah LiFePO4 Battery + MPPT Controller.
- **Full Details:** [BOM.md](hardware/BOM.md) & [Schematic Diagram](hardware/schematic_diagram.svg)
- **Production C++ Firmware:** [aegis_beacon_node.ino](hardware/firmware/aegis_beacon_node.ino)

---

## 👥 5-Member Student Team Pitch Strategy (SIH)

This project is built for a 5-student hackathon team with balanced, synchronized roles:
1. **Member 1 (Team Leader / Architect):** Problem context, why mobile apps fail, solution overview.
2. **Member 2 (Telemetry & AI Lead):** Government data intake (IMD, CWC, NCS) & pre-judgment damage prevention math.
3. **Member 3 (RF Protocol Engineer):** 32-Byte LoRa/NavIC radio frame, zero-internet airwaves, CRC16 security.
4. **Member 4 (Embedded IoT Lead):** Physical AegisBeacon mast, solar blackout immunity, 120dB siren & strobes.
5. **Member 5 (Economics & Scale):** Cost feasibility (₹3,775 per mast vs ₹2,00,000 sirens) & NDMA deployment.
- **Full Speaking Script & Judge Q&A Defense:** [SIH_5_MEMBER_ROLES.md](presentation/SIH_5_MEMBER_ROLES.md)
- **Slide-by-Slide Pitch Deck:** [PITCH_DECK_OUTLINE.md](presentation/PITCH_DECK_OUTLINE.md)

---

## 📜 License
Released under the **MIT License**. Created with pride for the **Smart India Hackathon (SIH)**.
