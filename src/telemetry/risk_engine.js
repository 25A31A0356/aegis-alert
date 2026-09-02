/**
 * AegisAlert Multi-Hazard Predictive Risk & Damage-Prevention Engine
 * Supports Pan-India Multi-Disasters:
 * 1. FLASH_FLOOD & Dam Breaches
 * 2. LANDSLIDE & Mountain Debris Flows (Wayanad, Kedarnath, Konkan)
 * 3. CLOUDBURST & Extreme Monsoon Rain (>100mm/hr)
 * 4. CYCLONE & Coastal Super Toofans (Bay of Bengal / Arabian Sea)
 * 5. TORNADO & Destructive Convective Squall Storms (Kalbaishakhi)
 * 6. HEATWAVE & Extreme Thermal Emergencies (Loo >45°C - 50°C, WBGT)
 * 7. EARTHQUAKE & Seismic Fault Ruptures
 */

export class RiskEngine {
  /**
   * Computes the Comprehensive Disaster Hazard Index (CDHI) [0 to 100]
   */
  static analyzeRisk(disasterType, telemetry) {
    let score = 15;
    let factors = [];
    let arrivalTimeMin = 120;
    let hazardCategory = "MULTI_HAZARD";

    switch (disasterType) {

      // 1. FLASH FLOODS & EMBANKMENT BREACHES
      case "FLASH_FLOOD": {
        hazardCategory = "Hydrological Flood";
        const rainRate = telemetry.rainfall1h || 0;
        const riverLvl = telemetry.riverLevel || 0;
        const dangerLvl = telemetry.riverDangerMark || 1;
        const damCap = telemetry.damCapacity || 50;

        const rainScore = Math.min(100, (rainRate / 70) * 100);
        const riverRatio = (riverLvl / dangerLvl);
        const riverScore = Math.min(100, Math.max(0, (riverRatio - 0.8) / 0.3 * 100));
        const damScore = Math.min(100, Math.max(0, (damCap - 75) / 25 * 100));

        score = (rainScore * 0.35) + (riverScore * 0.40) + (damScore * 0.25);
        if (rainRate > 50) factors.push(`Heavy Rainfall: ${rainRate} mm/hr`);
        if (riverLvl >= dangerLvl) factors.push(`River Level ${riverLvl}m EXCEEDS Danger Mark (${dangerLvl}m)`);
        if (damCap > 90) factors.push(`Dam Storage Critical at ${damCap}% capacity`);

        arrivalTimeMin = Math.max(15, Math.round(90 - (rainRate * 0.8)));
        break;
      }

      // 2. LANDSLIDES & SLOPE COLLAPSE (Wayanad, Himalayas, Western Ghats)
      case "LANDSLIDE": {
        hazardCategory = "Geological Landslide";
        const rain24h = telemetry.rainfall24h || 0;
        const rain72h = telemetry.rainfall72h || (rain24h * 2.2);
        const slopeAngle = telemetry.slopeAngle || 38; // degrees
        const poreWaterPressure = telemetry.porePressureKPa || 45; // kPa

        // Cumulative saturation over 72h triggers pore-water failure
        const rainSaturationScore = Math.min(100, (rain72h / 350) * 100);
        const slopeScore = Math.min(100, Math.max(0, (slopeAngle - 25) / 20 * 100));
        const poreScore = Math.min(100, (poreWaterPressure / 60) * 100);

        score = (rainSaturationScore * 0.45) + (slopeScore * 0.30) + (poreScore * 0.25);
        if (rain72h > 250) factors.push(`Critical Soil Saturation: ${rain72h}mm cumulative 72h rain`);
        if (slopeAngle > 35) factors.push(`Steep Mountain Slope: ${slopeAngle}° (High Shear Stress)`);
        if (poreWaterPressure > 40) factors.push(`Dangerous Sub-Surface Pore Water Pressure: ${poreWaterPressure} kPa`);

        arrivalTimeMin = 20; // Rapid slope failure
        break;
      }

      // 3. CLOUDBURSTS & EXTREME MONSOON RAIN (>100mm/hr)
      case "CLOUDBURST": {
        hazardCategory = "Severe Cloudburst";
        const rainRate = telemetry.rainfall1h || 85;
        const rain15min = telemetry.rainfall15m || (rainRate * 0.35);
        const flashVelocity = telemetry.flashSurgeVelocityKmh || 45;

        // Cloudburst definition: >= 100 mm/hr
        const intensityScore = Math.min(100, (rainRate / 100) * 100);
        const surgeScore = Math.min(100, (flashVelocity / 50) * 100);

        score = (intensityScore * 0.65) + (surgeScore * 0.35);
        factors.push(`Violent Precipitation Core: ${rainRate} mm/hr (${rain15min} mm in last 15 min)`);
        factors.push(`Torrential Mountain Runoff Velocity: ${flashVelocity} km/h`);

        arrivalTimeMin = 10; // Instantaneous flash surge
        break;
      }

      // 4. CYCLONES & TOOFANS (Bay of Bengal / Arabian Sea Coastal Strikes)
      case "CYCLONE": {
        hazardCategory = "Super Cyclone / Coastal Toofan";
        const wind = telemetry.windSpeed || 140;
        const pressure = telemetry.centralPressure || 960;
        const stormSurge = telemetry.stormSurgeHeight || 3.5;

        const windScore = Math.min(100, (wind / 200) * 100);
        const pressureScore = Math.min(100, Math.max(0, (1010 - pressure) / 70 * 100));
        const surgeScore = Math.min(100, (stormSurge / 5.0) * 100);

        score = (windScore * 0.45) + (pressureScore * 0.30) + (surgeScore * 0.25);
        if (wind > 120) factors.push(`Destructive Toofan Winds: ${wind} km/h (Category 4/5 Equivalent)`);
        if (pressure < 965) factors.push(`Extreme Deep Barometric Eye Pressure: ${pressure} hPa`);
        if (stormSurge > 3.0) factors.push(`Inundating Coastal Storm Surge: ${stormSurge}m Height`);

        arrivalTimeMin = 75; // Approaching landfall
        break;
      }

      // 5. TORNADOS & DESTRUCTIVE SQUALL STORMS (Kalbaishakhi / Nor'westers)
      case "TORNADO": {
        hazardCategory = "Tornado / Violent Convective Squall";
        const vortexWind = telemetry.vortexWindSpeed || 190; // km/h
        const radarEchoDbz = telemetry.radarReflectivityDbz || 68; // dBZ
        const lightningRate = telemetry.lightningFlashesPerMin || 140;

        const vortexScore = Math.min(100, (vortexWind / 220) * 100);
        const radarScore = Math.min(100, Math.max(0, (radarEchoDbz - 45) / 25 * 100));
        const lightningScore = Math.min(100, (lightningRate / 150) * 100);

        score = (vortexScore * 0.50) + (radarScore * 0.30) + (lightningScore * 0.20);
        factors.push(`Extreme Localized Vortex Wind: ${vortexWind} km/h (Structural Rupture Hazard)`);
        factors.push(`Severe Doppler Mesocyclone Hook Echo: ${radarEchoDbz} dBZ`);
        factors.push(`Intense Lightning Density: ${lightningRate} strikes/min`);

        arrivalTimeMin = 8; // Rapid touchdown
        break;
      }

      // 6. HEATWAVES & THERMAL EMERGENCIES (Loo, 45°C - 50°C, WBGT)
      case "HEATWAVE": {
        hazardCategory = "Extreme Thermal Heatwave (Loo)";
        const temp = telemetry.temperatureMax || 47.8; // °C
        const normalTemp = telemetry.normalClimateTemp || 41.0;
        const departure = temp - normalTemp; // °C departure
        const humidity = telemetry.relativeHumidity || 25; // %
        
        // Wet Bulb Globe Temperature calculation proxy
        const heatIndex = temp + (0.5555 * (6.11 * Math.exp(5417.7530 * (1/273.16 - 1/(273.15 + temp))) * (humidity/100) - 10));

        const tempScore = Math.min(100, Math.max(0, (temp - 42) / 8 * 100));
        const departureScore = Math.min(100, (departure / 6.5) * 100);
        const indexScore = Math.min(100, Math.max(0, (heatIndex - 45) / 15 * 100));

        score = (tempScore * 0.50) + (departureScore * 0.30) + (indexScore * 0.20);
        factors.push(`Severe Scorching Temperature: ${temp}°C (${departure.toFixed(1)}°C Above Normal)`);
        factors.push(`Thermal Stress Index: ${heatIndex.toFixed(1)}°C Equivalent Heat Impact`);
        factors.push(`Acute Heatstroke & Cardiovascular Dehydration Threat`);

        arrivalTimeMin = 0; // Active condition
        break;
      }

      // 7. EARTHQUAKES & SEISMIC FAULT RUPTURES
      case "EARTHQUAKE": {
        hazardCategory = "Tectonic Seismology";
        const mag = telemetry.magnitude || 6.4;
        const depth = telemetry.depthKm || 12;

        const magScore = Math.min(100, Math.max(0, (mag - 4.5) / 3.0 * 100));
        const depthScore = Math.min(100, Math.max(0, (50 - depth) / 40 * 100)); // Shallower = more destructive

        score = (magScore * 0.70) + (depthScore * 0.30);
        factors.push(`Severe Seismic Rupture: M${mag} on Richter Scale`);
        factors.push(`Shallow Focal Depth: ${depth} km (High Surface Shaking)`);

        arrivalTimeMin = 0; // Instantaneous
        break;
      }

      default: {
        score = 50;
        factors.push("General Monitored Alert Status");
        break;
      }
    }

    score = Math.min(100, Math.max(0, Math.round(score)));

    // Categorize into NDMA Alert Levels
    let alertLevel = "GREEN";
    let alertColor = "#10b981";
    if (score >= 75) {
      alertLevel = "RED";
      alertColor = "#ef4444";
    } else if (score >= 50) {
      alertLevel = "ORANGE";
      alertColor = "#f59e0b";
    } else if (score >= 25) {
      alertLevel = "YELLOW";
      alertColor = "#eab308";
    }

    // Generate Standard Operating Procedures (SOPs) based on specific hazard type
    const damageMitigationSOP = this.generateHazardSOP(alertLevel, disasterType, telemetry);

    return {
      score,
      alertLevel,
      color: alertColor,
      hazardCategory,
      factors,
      damageMitigationSOP,
      arrivalTimeMin
    };
  }

  /**
   * Generates tailored, life-saving Standard Operating Procedures (SOPs) for each hazard
   */
  static generateHazardSOP(level, type, telemetry) {
    switch (type) {
      case "LANDSLIDE":
        return [
          { priority: "CRITICAL", task: "Evacuate downhill riverbank hamlets and mountain road bends immediately." },
          { priority: "HIGH", task: "Border Roads Organisation (BRO): Close vulnerable mountain passes (NH-6, NH-58, Wayanad ghat roads)." },
          { priority: "HIGH", task: "Deploy ground-penetrating radar and NDRF canine search & rescue teams." },
          { priority: "IMMEDIATE", task: "Alert hydro-power project tunnels to immediately evacuate underground excavation crews." }
        ];

      case "CLOUDBURST":
        return [
          { priority: "CRITICAL", task: "Sound high-decibel valley sirens: flash torrent expected within 10-15 minutes." },
          { priority: "CRITICAL", task: "Direct all citizens to designated high ridge lines (+35m above dry riverbed)." },
          { priority: "HIGH", task: "Shut down low-level causeways, pedestrian footbridges, and mountain camping grounds." },
          { priority: "HIGH", task: "Pre-position Army inflatable rescue boats at valley discharge choke-points." }
        ];

      case "CYCLONE":
        return [
          { priority: "CRITICAL", task: "Enforce complete ban on maritime and fishing activities; recall all offshore vessels." },
          { priority: "CRITICAL", task: "Initiate mandatory zero-casualty evacuation of coastal habitations within 5km of shore." },
          { priority: "HIGH", task: "De-energize coastal power transmission lines to prevent fatal electrocutions." },
          { priority: "HIGH", task: "Activate multi-purpose concrete cyclone shelters (#01 to #24) with drinking water buffers." }
        ];

      case "TORNADO":
        return [
          { priority: "CRITICAL", task: "Sound immediate 120dB warning: Touchdown imminent within localized corridor." },
          { priority: "CRITICAL", task: "Direct citizens to interior windowless rooms, basements, or crouch beneath sturdy tables." },
          { priority: "HIGH", task: "Stay away from tin sheds, temporary structures, bill-boards, and high-tension wires." },
          { priority: "IMMEDIATE", task: "Clear railways and highway flyovers of exposed vehicular traffic." }
        ];

      case "HEATWAVE":
        return [
          { priority: "CRITICAL", task: "Declare Red Heat Emergency: Prohibit outdoor manual labor between 11:00 AM and 4:30 PM." },
          { priority: "CRITICAL", task: "Open 24/7 Air-Cooled Hydration Centers and ORS distribution booths at all bus and rail terminals." },
          { priority: "HIGH", task: "Order district hospitals to reserve dedicated emergency wards for acute heatstroke and IV fluids." },
          { priority: "HIGH", task: "Ensure uninterrupted water tankers supply to slum clusters and cattle shelters." },
          { priority: "MEDIUM", task: "Maintain thermal peak grid power reserve to prevent life-support hospital brownouts." }
        ];

      case "EARTHQUAKE":
        return [
          { priority: "CRITICAL", task: "Broadcast 'DROP, COVER, AND HOLD ON' civil defense directive across mobile and TV." },
          { priority: "HIGH", task: "Automatically shut down gas distribution mains and metro transit systems to avert secondary fires." },
          { priority: "HIGH", task: "Mobilize NDRF Urban Search & Rescue (USAR) teams with acoustic listening devices." },
          { priority: "IMMEDIATE", task: "Inspect dams, bridges, and flyovers for structural cracking before re-opening traffic." }
        ];

      default: // FLASH_FLOOD
        return [
          { priority: "CRITICAL", task: "Sound all deployed village AegisBeacon 120dB acoustic sirens immediately." },
          { priority: "CRITICAL", task: "Transmit 32-Byte Sub-GHz radio packet over LoRa 868MHz mesh and NavIC S-Band." },
          { priority: "HIGH", task: "Execute pre-emptive spillway discharge to prevent catastrophic crest overtopping." },
          { priority: "HIGH", task: "Cut off electricity feeders to flooded river sectors to eliminate electrocution hazard." },
          { priority: "IMMEDIATE", task: "Divert all highway traffic away from low-level causeways and bridges." }
        ];
    }
  }
}
