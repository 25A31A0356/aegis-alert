/**
 * AEGIS ALERT - "Ask AEGIS" AI Assistant (WeatherGPT Engine)
 * Implements conversational reasoning, state-aware hazard retrieval, and safety advisories.
 * Inspired by Smart India Hackathon problem statement SIH26068 (WeatherGPT).
 *
 * NOTE: PROTOTYPE DEMO ASSISTANT - RETRIEVES ACTIVE PLATFORM STATE DETERMINISTICALLY
 */

export class AegisAiAssistant {
  constructor(appContext) {
    this.app = appContext;
    this.chatHistory = [];
    this.initDefaultGreetings();
  }

  initDefaultGreetings() {
    this.chatHistory = [
      {
        sender: "aegis",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `👋 Greetings! I am **Ask AEGIS**, your AI Multi-Hazard Intelligence Assistant (SIH26068 WeatherGPT).\n\nI have real-time situational access to all environmental telemetry, risk scores, red-zone habitations, and 6-hour forecast projections across India.\n\n*Try asking a question below or click any quick prompt!*`
      }
    ];
  }

  /**
   * Processes a user question and returns a structured, factual answer based on active state
   * @param {string} query User query string
   * @returns {string} Markdown-formatted AI response
   */
  processQuery(query) {
    const q = query.toLowerCase().trim();
    const loc = this.app.currentLocation || { name: "Hyderabad", state: "Telangana" };
    const env = loc.current || {};
    const risks = this.app.currentRisks || { composite: { score: 68, level: "HIGH" }, hazards: {} };

    // 1. Current Flood Risk
    if (q.includes("flood") && (q.includes("risk") || q.includes("level") || q.includes("current") || q.includes("why"))) {
      const f = risks.hazards?.flood || { score: 76, level: "HIGH" };
      return `🌊 **Flood Risk Assessment for ${loc.name}, ${loc.state}:**\n\n` +
        `• **Current Flood Risk Score:** \`${f.score} / 100\` (${f.level})\n` +
        `• **Water Gauge Level:** \`${env.water_level_m}m\` (Danger Mark: \`${env.danger_mark_m}m\`)\n` +
        `• **Rainfall Influx:** \`${env.rainfall_mmh} mm/h\` (24h Accumulated: \`${env.accumulated_24h_mm} mm\`)\n` +
        `• **Soil Saturation:** \`${env.soil_moisture_pct}%\` (High runoff coefficient)\n\n` +
        `🔍 **AI Root Cause Diagnosis:** Flood susceptibility is elevated because current precipitation rate exceeds the urban/basin infiltration capacity, causing rapid river gauge swell within \`${env.drainage_proximity_m}m\` of major drainage channels.\n\n` +
        `🛡️ **Recommended Action:** Evacuate ground-floor habitations in designated Red Zones. Move livestock and elderly to designated highland relief camps.`;
    }

    // 2. Highest / Dominant Hazard
    if (q.includes("highest") || q.includes("dominant") || q.includes("most dangerous") || q.includes("worst")) {
      const dominant = risks.composite?.dominantHazard || "Flood & Inundation";
      const comp = risks.composite?.score || 78;
      return `⚠️ **Dominant Threat Analysis for ${loc.name}:**\n\n` +
        `The highest single environmental threat currently active is **${dominant}**.\n\n` +
        `• **AEGIS Composite Risk Score:** \`${comp} / 100\` (${risks.composite?.level})\n` +
        `• **Primary Contributing Factor:** Severe hydrological and meteorological coupling.\n` +
        `• **Vulnerable Population Exposed:** \`${loc.current?.population_exposed?.toLocaleString("en-IN") || "1,42,000"} citizens\`\n\n` +
        `⚡ **Advisory:** Incident Command should prioritize resource allocation (NDRF, SDRF, rescue boats) to low-lying habitations adjacent to this hazard epicenter.`;
    }

    // 3. Why is Risk High / Explain Score
    if (q.includes("why") || q.includes("explain score") || q.includes("reason") || q.includes("cause") || q.includes("calculation")) {
      return `🧠 **AI Multi-Hazard Risk Fusion Explanation:**\n\n` +
        `The Composite Risk Score for **${loc.name}** is calculated as **${risks.composite?.score}/100 (${risks.composite?.level})** using our weighted multi-tier fusion engine:\n\n` +
        `1. **Flood Inundation (28% wt):** Score \`${risks.hazards?.flood?.score}\` — Water level is at ${Math.round((env.water_level_m / env.danger_mark_m) * 100)}% of danger line.\n` +
        `2. **Heavy Rainfall (18% wt):** Score \`${risks.hazards?.rainfall?.score}\` — Continuous ${env.rainfall_mmh} mm/h precipitation.\n` +
        `3. **Landslide Susceptibility (22% wt):** Score \`${risks.hazards?.landslide?.score}\` — Terrain slope is ${env.slope_deg}° with ${env.soil_moisture_pct}% moisture saturation.\n` +
        `4. **Lightning / Thunderstorm (14% wt):** Score \`${risks.hazards?.lightning?.score}\` — CAPE energy ${env.cape_index} J/kg with active strikes.\n` +
        `5. **Heat & Thermal Stress (10% wt):** Score \`${risks.hazards?.heat?.score}\` — ${env.temperature_c}°C with ${env.humidity_pct}% humidity.\n` +
        `6. **Air Pollution (8% wt):** Score \`${risks.hazards?.pollution?.score}\` — PM2.5 at ${env.pm25} µg/m³ (AQI ${env.aqi}).\n\n` +
        `*Peak Hazard Rule applied: Catastrophic spikes in primary hazard dynamically raise the composite score to prevent masking compound risks.*`;
    }

    // 4. Vulnerable Habitations / Red Zones (SIH26191)
    if (q.includes("vulnerable") || q.includes("red zone") || q.includes("habitations") || q.includes("area") || q.includes("population")) {
      const vCount = env.vulnerable_habitations || 24;
      const pop = env.population_exposed || 142000;
      return `🏘️ **Vulnerable Habitations & Red Zone Intelligence (SIH26191):**\n\n` +
        `• **Target Region:** ${loc.name}, ${loc.state}\n` +
        `• **Identified Red-Zone Habitations:** \`${vCount} High-Risk Sectors\`\n` +
        `• **Directly Impacted Population:** \`${pop.toLocaleString("en-IN")} Residents\`\n` +
        `• **Infrastructure At Risk:** Bridges, sub-surface power substations, low causeways, and feeder roads.\n\n` +
        `🚩 **Primary Danger Clusters:**\n` +
        `1. Low-lying riverbank settlements within 150m of drainage channels.\n` +
        `2. Unreinforced foothill habitations with slope angles exceeding 25°.\n` +
        `3. Coastal informal habitations lacking multi-purpose concrete storm shelters.\n\n` +
        `*Navigate to the **'Vulnerability & Red Zones'** tab to inspect the complete geographic vulnerability register.*`;
    }

    // 5. 6-Hour Forecast
    if (q.includes("forecast") || q.includes("6 hour") || q.includes("next hours") || q.includes("tomorrow") || q.includes("later")) {
      return `⏱️ **6-Hour Demonstration Predictive Forecast for ${loc.name}:**\n\n` +
        `• **+1 Hour (11:00 AM):** Rain: \`48 mm/h\` | Temp: \`27.0°C\` | Flood: \`MODERATE (58%)\` | Lightning: \`LOW\`\n` +
        `• **+2 Hours (12:00 PM):** Rain: \`65 mm/h\` | Temp: \`26.2°C\` | Flood: \`HIGH (74%)\` | Lightning: \`MODERATE\`\n` +
        `• **+3 Hours (01:00 PM):** Rain: \`82 mm/h\` | Temp: \`25.0°C\` | Flood: \`CRITICAL (88%)\` | Lightning: \`HIGH\`\n` +
        `• **+4 Hours (02:00 PM):** Rain: \`70 mm/h\` | Temp: \`25.5°C\` | Flood: \`CRITICAL (85%)\` | Lightning: \`CRITICAL\`\n` +
        `• **+5 Hours (03:00 PM):** Rain: \`40 mm/h\` | Temp: \`26.8°C\` | Flood: \`HIGH (76%)\` | Lightning: \`MODERATE\`\n\n` +
        `📈 **Trend Warning:** Peak inundation and severe convective thunderstorm activity are projected between **1:00 PM and 2:30 PM**. Pre-emptive evacuations should conclude before 12:30 PM.`;
    }

    // 6. Heatwave / Thermal Stress
    if (q.includes("heat") || q.includes("temperature") || q.includes("hot") || q.includes("thermal") || q.includes("loo")) {
      const h = risks.hazards?.heat || { score: 34, level: "LOW" };
      return `🌡️ **Heatwave & Human Thermal Stress Index (SIH26083):**\n\n` +
        `• **Ambient Temperature:** \`${env.temperature_c}°C\`\n` +
        `• **Relative Humidity:** \`${env.humidity_pct}%\`\n` +
        `• **Thermal Stress Risk Score:** \`${h.score} / 100\` (${h.level})\n` +
        `• **Wet Bulb Globe Temp (WBGT):** \`${Math.round(env.temperature_c * 0.7 + (env.humidity_pct / 100) * 15)}°C\`\n\n` +
        `☀️ **Public Health Guideline:** ${env.temperature_c >= 40 ? "Extreme heatwave active. Severe risk of heatstroke. Avoid direct sun exposure between 11 AM - 4 PM. ORS hydration centers open." : "Thermal stress is within manageable physiological limits. Maintain routine hydration."}`;
    }

    // 7. Weather Station Anomaly Detection (SIH26073)
    if (q.includes("station") || q.includes("sensor") || q.includes("anomaly") || q.includes("drift") || q.includes("quality control")) {
      return `📡 **Weather Station Anomaly Detection Engine (SIH26073):**\n\n` +
        `• **Total Network Stations Polled:** \`10 Automated Weather Stations (AWS)\`\n` +
        `• **Healthy Stations:** \`9 Stations Online (99.2% confidence)\`\n` +
        `• **Detected Anomalies:** \`1 Station Flagged for Calibration\`\n` +
        `  - **Station ID:** \`STN-AWS-103\` (Visakhapatnam Dolphin Nose Coastal AWS)\n` +
        `  - **Anomaly Type:** \`Sensor Zero-Point Drift (-8.2 hPa barometric offset)\`\n` +
        `  - **AI Remediation:** Data stream auto-isolated; synthetic spatial imputation applied to maintain numerical stability in flood forecasting.`;
    }

    // 8. General Situation Overview / Explain Current Situation
    if (q.includes("situation") || q.includes("overview") || q.includes("summary") || q.includes("status") || q.includes("what is happening")) {
      return `🛡️ **AEGIS Multi-Hazard Situational Summary:**\n\n` +
        `• **Active Location:** ${loc.name}, ${loc.state}\n` +
        `• **Overall Threat Level:** \`${risks.composite?.score}/100 (${risks.composite?.level})\`\n` +
        `• **Primary Hazard:** **${risks.composite?.dominantHazard || "Flood & Rainfall"}**\n` +
        `• **Key Environmental Indicators:** Rain \`${env.rainfall_mmh} mm/h\`, Temp \`${env.temperature_c}°C\`, Wind \`${env.wind_speed_kmh} km/h\`, Water Gauge \`${env.water_level_m}m\`\n` +
        `• **Active Protective Measures:** Autonomous 120dB warning sirens armed; C-DOT SACHET cell broadcast tethering ready; real-time satellite telemetry locked (ISRO NavIC/INSAT-3DR).\n\n` +
        `*Click **'Run Emergency Scenario'** on the dashboard to experience a full 90-second simulated crisis lifecycle.*`;
    }

    // Default Fallback
    return `🤖 **AEGIS Multi-Hazard Intelligence Response:**\n\n` +
      `Regarding your query on *"${query}"* for **${loc.name}, ${loc.state}**:\n\n` +
      `• **Current Composite Risk:** \`${risks.composite?.score}/100\` (${risks.composite?.level})\n` +
      `• **Dominant Hazard:** **${risks.composite?.dominantHazard || "Flash Flood"}**\n` +
      `• **Current Rainfall:** \`${env.rainfall_mmh} mm/h\` | **Water Stage:** \`${env.water_level_m}m\`\n\n` +
      `💡 *Tip: You can ask specific questions like:*\n` +
      `• "What is the current flood risk?"\n` +
      `• "Why is the risk score high?"\n` +
      `• "Which areas are vulnerable?"\n` +
      `• "What is the 6-hour forecast?"\n` +
      `• "Explain the weather station anomaly (SIH26073)"`;
  }
}
