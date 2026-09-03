# 📚 AEGIS ALERT: Comprehensive Research, Scientific Formulas & Statutory References

**Project Title:** AEGIS ALERT — AI-Powered Multi-Hazard Early Warning & Situational Awareness Platform  
**Academic Context:** 5-Member Student Innovation Inspired by Smart India Hackathon (SIH26001 – SIH26192)  
**Applicability:** National Disaster Management Authority (NDMA), State SDMAs, and Central Incident Command Systems  

---

## 🔬 1. Mathematical Formulas & Scientific Models

### A. Landslide Shear & Slope Stability Model (SIH26001)
Based on the **Mohr-Coulomb Failure Criterion** coupled with the **Antecedent Precipitation Index (API)**:

$$\tau_f = c' + (\sigma - u_w) \tan\phi'$$

Where:
- $\tau_f$: Shear strength of the slope soil mass $(\text{kPa})$.
- $c'$: Effective soil cohesion $(\text{kPa})$.
- $\sigma$: Total normal stress on the failure plane $(\text{kPa})$.
- $u_w$: Pore-water pressure $(\text{kPa})$ calculated from cumulative rainfall influx:
  $$u_w = \rho_w \cdot g \cdot h_w \cdot \cos^2\theta$$
- $\phi'$: Effective internal friction angle (degrees).
- $\theta$: Terrain slope angle ($\theta > 25^\circ$ indicates high critical shear vulnerability).

**72-Hour Antecedent Precipitation Index ($API_{72}$):**
$$API_t = R_t + k \cdot API_{t-1} \quad (k \approx 0.84)$$

---

### B. Urban Flood Inundation & Runoff Surge Model (SIH26071 & SIH26085)
Based on the **SCS-CN (Soil Conservation Service Curve Number)** hydrological transformation:

$$Q = \frac{(P - I_a)^2}{(P - I_a) + S} \quad \text{for } P > I_a$$

Where:
- $Q$: Direct surface runoff depth $(\text{mm})$.
- $P$: Total storm precipitation depth $(\text{mm})$.
- $I_a$: Initial abstraction $(I_a = 0.2 S)$.
- $S$: Maximum potential soil moisture retention:
  $$S = \frac{25400}{CN} - 254$$
- **River Gauge Overtopping Ratio ($R_{gauge}$):**
  $$R_{gauge} = \frac{h_{current} - h_{base}}{h_{danger} - h_{base}} \times 100\%$$

---

### C. Severe Thunderstorm & Lightning Nowcasting (SIH26072 & SIH26084)
Based on **Convective Available Potential Energy (CAPE)** and **Lifted Index (LI)**:

$$CAPE = \int_{z_{LFC}}^{z_{EL}} g \left( \frac{T_{v,parcel} - T_{v,env}}{T_{v,env}} \right) dz$$

- $CAPE > 2000 \text{ J/kg}$: High convective instability (Severe thunderstorm trigger).
- $CAPE > 3000 \text{ J/kg}$: Extreme cloudburst and microburst potential ($>100 \text{ mm/h}$).
- **Estimated Updraft Velocity ($w_{max}$):**
  $$w_{max} = \sqrt{2 \cdot CAPE}$$

---

### D. Human Thermal Stress & Heatwave Index (SIH26083)
Based on the **Steadman Heat Index** and **Simplified Wet Bulb Globe Temperature (sWBGT)**:

$$sWBGT = 0.567 \cdot T_a + 0.393 \cdot e + 3.94$$

Where:
- $T_a$: Dry bulb ambient temperature $(^\circ\text{C})$.
- $e$: Water vapor pressure $(\text{hPa})$:
  $$e = \frac{RH}{100} \cdot 6.105 \cdot \exp\left( \frac{17.27 \cdot T_a}{237.7 + T_a} \right)$$
- $sWBGT > 32^\circ\text{C}$: Extreme heat stroke danger under direct solar exposure.

---

### E. Weather Station Statistical Anomaly Detection (SIH26073)
Employs a **Moving Z-Score & Interquartile Sensor Variance ($\sigma$) Filter**:

$$Z_t = \frac{x_t - \mu_{rolling}}{\sigma_{rolling}}$$

- If $|Z_t| > 3.5$ or $\sigma_{1h} = 0$ (Frozen sensor test), the station is automatically flagged with `SENSOR_ZERO_DRIFT` or `ERRATIC_SPIKE`.

---

## 🏛️ 2. Government of India Statutory Guidelines & Standards

1. **National Disaster Management Authority (NDMA):**
   - *National Disaster Management Guidelines — Management of Floods (2008)*
   - *National Disaster Management Guidelines — Management of Landslides and Snow Avalanches (2009)*
   - *National Guidelines on Preparation of Action Plan for Prevention and Management of Heatwaves (2019)*
2. **Ministry of Home Affairs (MHA):**
   - *Disaster Management Act, 2005 (Act No. 53 of 2005), Section 10(2)(l) Emergency Powers*
   - *Standard Operating Procedure (SOP) for Responding to Disasters (2010)*
3. **India Meteorological Department (IMD):**
   - *Standard Operating Procedure for Severe Weather Forecasting and Early Warning Services*
   - *Color-Coded Weather Warning System (Green, Yellow, Orange, Red Alert Criteria)*
4. **Central Water Commission (CWC):**
   - *Handbook for Flood Forecasting & Hydrological Observation Stations in India*
5. **Central Pollution Control Board (CPCB):**
   - *National Air Quality Index (NAQI) Standard Technical Report (2014)*

---

## 📡 3. Telecommunications & Broadcasting Protocols

1. **ITU-T Recommendation X.1303:**
   - *Common Alerting Protocol (CAP) v1.2* — Universal structured XML/JSON format for emergency alerting.
2. **3GPP TS 23.041 Standard:**
   - *Technical realization of Cell Broadcast Service (CBS)* — Broadcast Channel 4370 (Zero-delay multi-tower airwave transmission without cellular network congestion).
3. **ISRO Satellite Downlink Specifications:**
   - *NavIC / IRNSS Standard Positioning and Short Messaging Service (S-Band / L5 Transponder)*
   - *INSAT-3DR Disaster Warning Transponder (DWT) Uplink/Downlink Specifications*
4. **Wireless Planning & Coordination (WPC) Wing, India:**
   - *Sub-GHz ISM Band Regulations: 865–867 MHz license-exempt parameters for LoRa disaster mesh networks in India.*

---

## 📖 4. Smart India Hackathon Problem Statements Mapping

| Problem ID | Official Title | Implemented Component in AEGIS ALERT |
|---|---|---|
| **SIH26001** | AI-Based Early Warning and Landslide Risk Monitoring | Landslide Mohr-Coulomb shear analysis & slope stability engine (`src/telemetry/risk_fusion_engine.js`) |
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

## 📑 5. Key Research Papers & External Citations

1. **Guzzetti, F., et al. (2008):** *"Rainfall thresholds for the initiation of landslides."* Meteorology and Atmospheric Physics, 98(3), pp. 239-267.
2. **Steadman, R. G. (1979):** *"The Assessment of Sultriness. Part I: A Temperature-Humidity Index Based on Human Physiology and Evaporative Science."* Journal of Applied Meteorology, 18(7), pp. 861-873.
3. **Huffman, G. J., et al. (2020):** *"Integrated Multi-satellitE Retrievals for GPM (IMERG) Technical Documentation."* NASA Goddard Space Flight Center.
4. **C-DOT (Centre for Development of Telematics) (2023):** *"SACHET: Integrated Common Alerting Protocol (CAP) Platform for Pan-India Disaster Warnings."* Ministry of Communications, Government of India.
5. **Open-Meteo & Copernicus ERA5 (2024):** *"High-Resolution Global Numerical Weather Prediction (NWP) API Archive."* European Centre for Medium-Range Weather Forecasts (ECMWF).
