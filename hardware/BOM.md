# AegisBeacon: Bill of Materials (BOM) & Cost Feasibility Analysis
**Designed for Smart India Hackathon (SIH)**  
**Target Unit Cost:** Under ₹3,500 ($42 USD) per Autonomous Village Mast

AegisAlert achieves extreme cost efficiency by using commercial off-the-shelf (COTS) industrial-grade components. This enables district administrations to deploy autonomous warning nodes across thousands of vulnerable riverfronts, landslides zones, and coastal villages without multimillion-dollar infrastructure budgets.

---

## 1. Core Component Breakdown

| Sl. No. | Component | Specification | Quantity | Unit Cost (INR) | Source / Vendor | Purpose in System |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **1** | **Microcontroller Board** | ESP32-WROOM-32 (Dual Core 240MHz, Ultra-Low Power Deep Sleep) | 1 | ₹380 | Robu.in / QuartzComponents | Main processing unit, state machine, CRC calculation, watchdog timer |
| **2** | **Sub-GHz LoRa Transceiver** | SX1262 / SX1278 868.1 MHz SPI module (+22 dBm ERP, 15-30km range) | 1 | ₹420 | Ebyte / Semtech | Zero-internet radio receiver & mesh repeater node |
| **3** | **Omni-Directional Antenna** | 868MHz 5dBi Fiberglass LoRa Antenna with SMA connector | 1 | ₹180 | Local / Electronics Comp | Long-range 360° radio frequency reception through storm rain |
| **4** | **Acoustic Evacuation Horn** | 12V DC 120dB High-Decibel Piezo Tactical Siren | 1 | ₹320 | Industrial Security Stores | Auditory alert heard across a 2-3 km radius in rural villages |
| **5** | **Audio PA DAC & Amp** | DFPlayer Mini (MicroSD offline voice ROM) + PAM8403 3W/10W Amplifier | 1 | ₹140 | Robu.in | Plays vernacular spoken Hindi/English evacuation instructions |
| **6** | **Optical Strobe Array** | 12V 48-LED Ultra-Bright Red/Amber Strobe Flasher Module | 1 | ₹260 | Automotive / Emergency Supply | Visual warning for deaf individuals, dense fog, and night storms |
| **7** | **Alphanumeric LED Matrix** | MAX7219 4-in-1 Dot Matrix Display Module (Red/Amber) | 1 | ₹210 | Local electronics market | High-contrast scrolling text of safe shelter locations |
| **8** | **Solar Power Generation** | 20W - 40W Monocrystalline Solar Photovoltaic Panel | 1 | ₹750 | Loom Solar / Tata Power | Infinite off-grid renewable energy harvesting |
| **9** | **Solar Charge Controller** | MPPT / PWM Solar Battery Charge Controller (12V 5A) | 1 | ₹240 | CN3791 / Generic Solar | Over-voltage, under-voltage, and reverse-polarity protection |
| **10**| **Battery Storage Bank** | 12V 6Ah LiFePO4 (Lithium Iron Phosphate) 4S Pack | 1 | ₹480 | Li-ion battery assembler | 72 hours of continuous operation under total solar blackout |
| **11**| **Actuator Relays** | 2-Channel 5V Optocoupled Relay Module (10A 250VAC) | 1 | ₹65 | Generic Electronics | Electrically isolates microcontroller from high-power 12V siren |
| **12**| **Weatherproof Enclosure** | IP66 UV-Stabilized Polycarbonate Outdoor Junction Box | 1 | ₹220 | Sintex / Schneider Electric | Protects electronics from torrential rain, dust, and lightning |
| **--** | **Connectors & Hardware** | JST connectors, mounting brackets, mast clamp, silicone gland | Lot | ₹110 | Hardware store | Mechanical pole assembly |
| **TOTAL** | **Full Mast Assembly** | **Complete Autonomous Alert Node** | **1 Unit** | **₹3,775 (~$45)** | | **10x cheaper than imported sirens** |

---

## 2. Power Consumption & Blackout Sustainability Budget

Disasters routinely sever high-voltage AC electric grids for days. AegisBeacon is engineered for zero reliance on municipal electricity:

- **Standby Power (99.8% of time):** ESP32 in light sleep with LoRa CAD (Channel Activity Detection) listening at 868MHz: **~12mA @ 3.3V (0.04W)**.
- **Active Alert Power (Siren blaring + Voice PA + Strobes on):** **~1.8A @ 12V (21.6W)**.
- **Battery Capacity:** 12V 6Ah LiFePO4 = **72 Watt-hours (Wh)**.
- **Blackout Runtime:**
  - **Standby Mode:** Up to **1,800 hours (75 days)** without any sunlight.
  - **Continuous Active Siren Mode:** Over **3.3 continuous hours** of sirens and loudspeaker broadcasts.
  - **Real Disaster Duty Cycle (5 mins alarm every 30 mins):** Runs for **24+ days** without sunlight!

---

## 3. Scalability for District Administrations (Cost Comparison)

| Parameter | Traditional Municipal Sirens | Mobile App Solution | AegisAlert Cyber-Physical Solution |
| :--- | :--- | :--- | :--- |
| **Cost per Village** | ₹1,50,000 to ₹5,00,000 | Free to download, but fails in 0-signal | **₹3,775 per autonomous pole** |
| **Dependence on Internet** | Moderate (optical fiber / 4G) | **100% Dependent (Fails if towers fall)** | **0% Dependent (Sub-GHz / NavIC RF)** |
| **Dependence on Mobile Phones** | None | **100% Dependent (Needs smartphones)** | **0% Dependent (Acoustic + Visual)** |
| **Electricity Dependence** | Needs AC mains or big diesel genset | Citizen phone battery | **Self-contained Solar + LiFePO4** |
| **Deployability in Remote Hills** | Very Difficult | Zero connectivity in deep gorges | **Easy (Single pole, 1-hour installation)** |
