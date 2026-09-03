/**
 * AEGIS ALERT - Multi-Hazard Risk Fusion Engine
 * Implements mathematical risk scoring, multi-hazard weighted fusion, and natural language risk explanations.
 * Inspired by SIH26001, SIH26071, SIH26072, SIH26083, SIH26082, SIH26085.
 *
 * NOTE: PROTOTYPE DEMO ENGINE - SYNTHETIC FORMULAS FOR ACADEMIC/DEMO PURPOSES
 */

export class RiskFusionEngine {
  /**
   * Computes individual and composite risk scores from environmental parameters
   * @param {Object} env Environmental state parameters
   * @returns {Object} Calculated risk breakdown with levels and explanations
   */
  static calculateRisks(env) {
    const rainIntensity = env.rainfall_mmh || 0;
    const rain24h = env.accumulated_24h_mm || 0;
    const tempC = env.temperature_c || 25;
    const humidity = env.humidity_pct || 50;
    const windKmh = env.wind_speed_kmh || 10;
    const slopeDeg = env.slope_deg || 5;
    const soilMoisture = env.soil_moisture_pct || 40;
    const waterLevel = env.water_level_m || 2;
    const dangerMark = env.danger_mark_m || 5;
    const lightningStrikes = env.lightning_strikes_10m || 0;
    const cape = env.cape_index || 1200;
    const pm25 = env.pm25 || 30;
    const pm10 = env.pm10 || 60;

    // 1. Rainfall Risk (0-100)
    // Formula: Combines instantaneous rate (>50mm/h = high) and 24h accumulation (>100mm = high)
    const rateScore = Math.min(100, (rainIntensity / 80) * 60);
    const accumScore = Math.min(100, (rain24h / 200) * 40);
    const rainfallRisk = Math.round(Math.min(100, rateScore + accumScore));

    // 2. Flood / Inundation Risk (0-100)
    // Formula: River stage ratio (current/danger) + rainfall contribution + soil saturation
    const waterLevelRatio = dangerMark > 0 ? (waterLevel / dangerMark) : 0.5;
    const waterLevelScore = Math.min(100, waterLevelRatio * 65);
    const saturationScore = (soilMoisture / 100) * 20;
    const rainContrib = (rainfallRisk / 100) * 15;
    const floodRisk = Math.round(Math.min(100, waterLevelScore + saturationScore + rainContrib));

    // 3. Landslide Susceptibility Risk (0-100)
    // Formula: Slope factor (>30° critical) * (Soil Saturation / 100) * (Rainfall Factor)
    const slopeFactor = Math.min(1.0, slopeDeg / 45);
    const saturationFactor = Math.min(1.0, soilMoisture / 90);
    const rainFactor = Math.min(1.0, (rain24h + rainIntensity * 2) / 180);
    let landslideRisk = 0;
    if (slopeDeg > 15) {
      landslideRisk = Math.round(Math.min(100, slopeFactor * 45 + saturationFactor * 35 + rainFactor * 20));
    } else {
      landslideRisk = Math.round(Math.min(25, slopeDeg * 1.5));
    }

    // 4. Lightning & Thunderstorm Risk (0-100)
    // Formula: CAPE instability index (>2500 J/kg) + strike count per 10min + wind shear
    const capeScore = Math.min(50, (cape / 3500) * 50);
    const strikeScore = Math.min(40, (lightningStrikes / 50) * 40);
    const windScore = Math.min(10, (windKmh / 70) * 10);
    const lightningRisk = Math.round(Math.min(100, capeScore + strikeScore + windScore));

    // 5. Heatwave & Thermal Stress Risk (0-100)
    // Formula: Steadman Heat Index proxy with humidity penalty
    let heatScore = 0;
    if (tempC >= 40) {
      heatScore = 70 + Math.min(30, (tempC - 40) * 5 + (humidity > 50 ? (humidity - 50) * 0.4 : 0));
    } else if (tempC >= 35) {
      heatScore = 40 + (tempC - 35) * 6 + (humidity > 60 ? (humidity - 60) * 0.5 : 0);
    } else {
      heatScore = Math.max(5, (tempC / 35) * 35);
    }
    const heatRisk = Math.round(Math.min(100, heatScore));

    // 6. Air Pollution Risk (0-100)
    // Formula: PM2.5 + PM10 with stagnation factor (low wind increases risk)
    const pm25Score = Math.min(60, (pm25 / 150) * 60);
    const pm10Score = Math.min(30, (pm10 / 250) * 30);
    const stagnationPenalty = windKmh < 8 ? 10 : 0;
    const pollutionRisk = Math.round(Math.min(100, pm25Score + pm10Score + stagnationPenalty));

    // 7. AEGIS Composite Risk Score (0-100)
    // Multi-hazard weighted fusion: dynamically elevates when any critical primary hazard exceeds 85%
    const weights = {
      flood: 0.28,
      landslide: 0.22,
      rainfall: 0.18,
      lightning: 0.14,
      heat: 0.10,
      pollution: 0.08
    };

    const weightedBase =
      floodRisk * weights.flood +
      landslideRisk * weights.landslide +
      rainfallRisk * weights.rainfall +
      lightningRisk * weights.lightning +
      heatRisk * weights.heat +
      pollutionRisk * weights.pollution;

    // Peak hazard dominance rule: composite risk must reflect the severity of the most catastrophic hazard
    const maxHazardScore = Math.max(floodRisk, landslideRisk, rainfallRisk, lightningRisk, heatRisk, pollutionRisk);
    const compositeScore = Math.round(Math.min(100, Math.max(weightedBase, maxHazardScore * 0.90)));

    return {
      composite: {
        score: compositeScore,
        level: this.getRiskLevel(compositeScore),
        dominantHazard: this.getDominantHazard({ rainfallRisk, floodRisk, landslideRisk, lightningRisk, heatRisk, pollutionRisk }),
        explanation: this.generateCompositeExplanation(compositeScore, { rainfallRisk, floodRisk, landslideRisk, lightningRisk, heatRisk, pollutionRisk }, env)
      },
      hazards: {
        rainfall: {
          score: rainfallRisk,
          level: this.getRiskLevel(rainfallRisk),
          trend: rainIntensity > 40 ? "+14% (Intensifying)" : "-4% (Stable)",
          explanation: `Rainfall rate is ${rainIntensity} mm/h with 24h accumulation reaching ${rain24h} mm.`
        },
        flood: {
          score: floodRisk,
          level: this.getRiskLevel(floodRisk),
          trend: waterLevel >= dangerMark ? "+18% (Overtopping)" : "-2% (Normal)",
          explanation: `Water level is ${waterLevel}m vs ${dangerMark}m danger line (${Math.round(waterLevelRatio * 100)}% capacity).`
        },
        landslide: {
          score: landslideRisk,
          level: this.getRiskLevel(landslideRisk),
          trend: slopeDeg > 30 && soilMoisture > 85 ? "+22% (Critical Shearing)" : "0% (Stable)",
          explanation: slopeDeg > 15
            ? `Slope angle of ${slopeDeg}° with ${soilMoisture}% soil saturation creates shear stress.`
            : `Gentle terrain (${slopeDeg}°) presents minimal debris flow susceptibility.`
        },
        lightning: {
          score: lightningRisk,
          level: this.getRiskLevel(lightningRisk),
          trend: lightningStrikes > 20 ? "+25% (Convective Storm)" : "-5% (Clear)",
          explanation: `CAPE convective energy of ${cape} J/kg detected with ${lightningStrikes} cloud-to-ground strikes per 10m.`
        },
        heat: {
          score: heatRisk,
          level: this.getRiskLevel(heatRisk),
          trend: tempC >= 42 ? "+16% (Extreme Loo)" : "0% (Moderate)",
          explanation: `Ambient temperature of ${tempC}°C with ${humidity}% humidity yields elevated thermal strain.`
        },
        pollution: {
          score: pollutionRisk,
          level: this.getRiskLevel(pollutionRisk),
          trend: pm25 > 90 ? "+10% (Stagnant Plume)" : "-3% (Dispersing)",
          explanation: `PM2.5 concentration at ${pm25} µg/m³ (AQI ~${env.aqi || 100}) under ${windKmh} km/h wind dispersion.`
        }
      }
    };
  }

  static getRiskLevel(score) {
    if (score >= 85) return "CRITICAL";
    if (score >= 70) return "HIGH";
    if (score >= 40) return "MODERATE";
    return "LOW";
  }

  static getDominantHazard(scores) {
    const map = [
      { name: "Flood & Inundation", score: scores.floodRisk },
      { name: "Landslide & Mudflow", score: scores.landslideRisk },
      { name: "Heavy Precipitation", score: scores.rainfallRisk },
      { name: "Lightning & Thunderstorm", score: scores.lightningRisk },
      { name: "Extreme Heatwave", score: scores.heatRisk },
      { name: "Air Pollution", score: scores.pollutionRisk }
    ];
    map.sort((a, b) => b.score - a.score);
    return map[0].name;
  }

  static generateCompositeExplanation(compositeScore, hazards, env) {
    const level = this.getRiskLevel(compositeScore);
    const dominant = this.getDominantHazard(hazards);

    if (level === "CRITICAL") {
      return `CRITICAL MULTI-HAZARD WARNING: Dominated by severe ${dominant}. Compound trigger: Elevated precipitation (${env.rainfall_mmh} mm/h) coupled with high soil saturation and hydrological stage. Immediate proactive containment and evacuation protocols recommended.`;
    } else if (level === "HIGH") {
      return `HIGH ENVIRONMENTAL THREAT: Significant threat detected from ${dominant}. Environmental sensors indicate rapid accumulation towards threshold limits. Monitoring teams should maintain heightened readiness.`;
    } else if (level === "MODERATE") {
      return `MODERATE HAZARD POSTURE: Elevated readings in ${dominant}, but secondary environmental buffers remain stable. Continue continuous telemetry polling.`;
    } else {
      return `NORMAL ENVIRONMENTAL BASELINE: All major environmental risk vectors are within standard safety operating envelopes.`;
    }
  }
}
