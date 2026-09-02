/**
 * AegisAlert Predictive Risk & Pre-Judgment Decision Engine
 * 
 * Computes multi-variable hazard indices before water breaches embankments
 * or cyclones make landfall, enabling preemptive damage prevention.
 */

import { CONFIG } from "../config.js";

export class RiskEngine {
  /**
   * Computes the Comprehensive Disaster Hazard Index (CDHI) [0 to 100]
   * @param {string} disasterType 
   * @param {Object} telemetry 
   * @returns {Object} { score: number, alertLevel: string, damageMitigationSOP: Array, arrivalTimeMin: number }
   */
  static analyzeRisk(disasterType, telemetry) {
    let score = 10;
    let factors = [];
    let arrivalTimeMin = 180; // default 3 hours

    if (disasterType === "FLASH_FLOOD") {
      // 1. Rainfall Intensity Weight (40%)
      const rainRate = telemetry.rainfall1h || 0;
      const rainScore = Math.min(100, (rainRate / 70) * 100);
      score += rainScore * 0.40;
      if (rainRate > 50) factors.push(`Intense Cloudburst: ${rainRate} mm/hr`);

      // 2. River Gauge Breaching Weight (35%)
      const riverLvl = telemetry.riverLevel || 0;
      const dangerLvl = telemetry.riverDangerMark || 1;
      const riverRatio = (riverLvl / dangerLvl);
      const riverScore = Math.min(100, Math.max(0, (riverRatio - 0.8) / 0.3 * 100));
      score += riverScore * 0.35;
      if (riverLvl >= dangerLvl) factors.push(`River Level ${riverLvl}m EXCEEDS Danger Mark (${dangerLvl}m)`);

      // 3. Dam Storage Capacity (25%)
      const damCap = telemetry.damCapacity || 50;
      const damScore = Math.min(100, Math.max(0, (damCap - 75) / 25 * 100));
      score += damScore * 0.25;
      if (damCap > 90) factors.push(`Dam Storage Critical at ${damCap}% capacity`);

      // Predicted arrival time based on river velocity
      arrivalTimeMin = Math.max(15, Math.round(90 - (rainRate * 0.8)));

    } else if (disasterType === "CYCLONE") {
      // Wind speed & pressure drop
      const wind = telemetry.windSpeed || 0;
      const pressure = telemetry.centralPressure || 1013;
      const windScore = Math.min(100, (wind / 180) * 100);
      const pressureScore = Math.min(100, Math.max(0, (1010 - pressure) / 60 * 100));

      score = (windScore * 0.6) + (pressureScore * 0.4);
      if (wind > 100) factors.push(`Destructive Gale Winds: ${wind} km/h`);
      if (pressure < 970) factors.push(`Extreme Deep Barometric Depression: ${pressure} hPa`);
      arrivalTimeMin = 120;

    } else if (disasterType === "EARTHQUAKE") {
      const mag = telemetry.magnitude || 0;
      score = Math.min(100, Math.max(0, (mag - 4.0) / 3.5 * 100));
      factors.push(`Richter Magnitude ${mag} at Depth ${telemetry.depthKm || 10}km`);
      arrivalTimeMin = 0; // Immediate
    }

    score = Math.min(100, Math.max(0, Math.round(score)));

    // Categorize into NDMA Alert Levels
    let alertLevel = "GREEN";
    if (score >= 75) alertLevel = "RED";
    else if (score >= 50) alertLevel = "ORANGE";
    else if (score >= 25) alertLevel = "YELLOW";

    const levelConfig = CONFIG.ALERT_LEVELS[alertLevel];

    // Generate Standard Operating Procedures (SOPs)
    const damageMitigationSOP = this.generateSOP(alertLevel, disasterType, telemetry);

    return {
      score,
      alertLevel,
      color: levelConfig.color,
      label: levelConfig.label,
      factors,
      damageMitigationSOP,
      arrivalTimeMin,
      actionDirectives: levelConfig.action
    };
  }

  /**
   * Generates actionable Standard Operating Procedures (SOPs) for District Collectors
   */
  static generateSOP(level, type, telemetry) {
    if (level === "RED") {
      return [
        { priority: "CRITICAL", task: "Sound all deployed village AegisBeacon 120dB acoustic sirens immediately." },
        { priority: "CRITICAL", task: "Transmit 32-Byte Sub-GHz radio packet over LoRa 868MHz mesh and NavIC S-Band." },
        { priority: "HIGH", task: "Execute pre-emptive spillway discharge of 18,000 cusecs to prevent catastrophic crest overtopping." },
        { priority: "HIGH", task: "Cut off electricity feeders to flooded river sectors to eliminate electrocution hazard." },
        { priority: "IMMEDIATE", task: "Divert all state highway traffic away from low-level causeways and bridges." }
      ];
    } else if (level === "ORANGE") {
      return [
        { priority: "HIGH", task: "Broadcast amber advisory to all coastal & riverfront panchayats." },
        { priority: "MEDIUM", task: "Pre-position NDRF Battalion 4 & inflatable rescue zodiacs in Sector 2." },
        { priority: "MEDIUM", task: "Stock relief camps with 72-hour drinking water, ORS, and high-calorie rations." }
      ];
    } else {
      return [
        { priority: "ROUTINE", task: "Maintain continuous 15-minute telemetry polling from IMD and CWC sensors." },
        { priority: "ROUTINE", task: "Check solar battery charge levels on all remote AegisBeacon field nodes." }
      ];
    }
  }
}
