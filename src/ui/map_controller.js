/**
 * AEGIS ALERT - Tactical Multi-Hazard GIS Map Controller
 * Leaflet-powered GIS engine with 8 dynamic hazard layer controls, location selection, and red zones.
 * Inspired by SIH26001, SIH26071, SIH26073, SIH26078, SIH26085, SIH26191.
 *
 * NOTE: PROTOTYPE DEMO GIS - NOT FOR REAL-WORLD EMERGENCY DECISION MAKING
 */

import { LOCATIONS_DATA, VULNERABILITY_RED_ZONES, WEATHER_STATIONS_DATA } from "../data/locations_data.js";

export class MapController {
  constructor(mapContainerId, onLocationSelected) {
    this.containerId = mapContainerId;
    this.onLocationSelected = onLocationSelected;
    this.map = null;

    // Layer Groups
    this.layers = {
      rainfall: null,
      flood: null,
      landslide: null,
      lightning: null,
      heatwave: null,
      pollution: null,
      vulnerability: null,
      stations: null
    };

    this.activeLayersState = {
      rainfall: true,
      flood: true,
      landslide: true,
      lightning: true,
      heatwave: true,
      pollution: true,
      vulnerability: true,
      stations: true
    };
  }

  initMap() {
    const el = document.getElementById(this.containerId);
    if (this.map || !el || typeof L === 'undefined') return;

    try {
      if (el._leaflet_id) {
        el._leaflet_id = null;
      }

      // Center on India
      this.map = L.map(this.containerId, {
        zoomControl: true,
        attributionControl: false
      }).setView([20.5937, 78.9629], 5);

      // Dark Tactical CartoDB Basemap
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        subdomains: "abcd"
      }).addTo(this.map);

      // Initialize Layer Groups
      Object.keys(this.layers).forEach(key => {
        this.layers[key] = L.layerGroup().addTo(this.map);
      });

      this.renderAllLayers();
    } catch (err) {
      console.warn(`Map init error for #${this.containerId}:`, err);
    }
  }

  renderAllLayers() {
    this.renderLocations();
    this.renderFloodLayer();
    this.renderRainfallLayer();
    this.renderLandslideLayer();
    this.renderLightningLayer();
    this.renderHeatwaveLayer();
    this.renderPollutionLayer();
    this.renderVulnerabilityLayer();
    this.renderWeatherStationsLayer();
  }

  renderLocations() {
    LOCATIONS_DATA.forEach(loc => {
      const isSelected = loc.id === "LOC-HYD";
      const icon = L.divIcon({
        className: "location-hub-pin",
        html: `<div class="loc-pin-badge ${isSelected ? 'selected' : ''}">📍 <span>${loc.name}</span></div>`,
        iconSize: [80, 28],
        iconAnchor: [40, 14]
      });

      const marker = L.marker(loc.coordinates, { icon: icon });
      marker.on("click", () => {
        if (this.onLocationSelected) {
          this.onLocationSelected(loc);
        }
      });
      marker.bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; font-size:12px; min-width:230px;">
          <strong style="color:#0284c7; font-size:13px;">📍 ${loc.name}, ${loc.state}</strong><br/>
          <span style="color:#475569; font-size:11px;">${loc.terrain}</span><br/>
          <div style="margin:6px 0; padding:6px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px;">
            <div>🌧️ Rain: <strong>${loc.current.rainfall_mmh} mm/h</strong> | 🌡️ Temp: <strong>${loc.current.temperature_c}°C</strong></div>
            <div>🌫️ AQI: <strong style="color:${loc.current.aqi > 200 ? '#dc2626' : loc.current.aqi > 100 ? '#d97706' : '#059669'}">${loc.current.aqi}</strong> (PM2.5: ${loc.current.pm25})</div>
            <div>🌊 Water Stage: <strong>${loc.current.water_level_m}m</strong> / ${loc.current.danger_mark_m}m</div>
            <div style="font-size:10px; color:#64748b; margin-top:4px;">⚠️ <em>${loc.primary_hazards.join(", ")}</em></div>
            ${loc.historical_disasters ? `<div style="font-size:10px; color:#b91c1c; margin-top:2px;">📜 <strong>History:</strong> ${loc.historical_disasters}</div>` : ''}
          </div>
          <button onclick="window.__selectLocation('${loc.id}')" style="background:#0284c7; color:#fff; border:none; padding:6px 10px; border-radius:4px; font-size:11px; cursor:pointer; width:100%; font-weight:bold;">
            🔎 Select & Sync Real-Time Telemetry
          </button>
        </div>
      `);
      this.layers.rainfall.addLayer(marker);
    });
  }

  renderFloodLayer() {
    this.layers.flood.clearLayers();
    LOCATIONS_DATA.forEach(loc => {
      const circle = L.circle(loc.coordinates, {
        color: "#0284c7",
        fillColor: "#38bdf8",
        fillOpacity: 0.25,
        radius: 35000,
        weight: 2
      });
      circle.bindPopup(`<strong>🌊 Flood Basin: ${loc.name}</strong><br/>Water Level: ${loc.current.water_level_m}m (Danger: ${loc.current.danger_mark_m}m)`);
      this.layers.flood.addLayer(circle);
    });
  }

  renderRainfallLayer() {
    this.layers.rainfall.clearLayers();
    LOCATIONS_DATA.forEach(loc => {
      const rain = loc.current.rainfall_mmh;
      if (rain > 20) {
        const circle = L.circle(loc.coordinates, {
          color: "#10b981",
          fillColor: "#10b981",
          fillOpacity: 0.2,
          radius: 45000,
          weight: 1,
          dashArray: "4, 4"
        });
        circle.bindPopup(`<strong>🌧️ Precipitation Zone: ${loc.name}</strong><br/>Intensity: ${rain} mm/h (24h: ${loc.current.accumulated_24h_mm} mm)`);
        this.layers.rainfall.addLayer(circle);
      }
    });
  }

  renderLandslideLayer() {
    this.layers.landslide.clearLayers();
    LOCATIONS_DATA.filter(l => l.current.slope_deg > 15).forEach(loc => {
      const polygonCoords = [
        [loc.coordinates[0] + 0.12, loc.coordinates[1] - 0.10],
        [loc.coordinates[0] + 0.15, loc.coordinates[1] + 0.12],
        [loc.coordinates[0] - 0.10, loc.coordinates[1] + 0.14],
        [loc.coordinates[0] - 0.12, loc.coordinates[1] - 0.08]
      ];
      const poly = L.polygon(polygonCoords, {
        color: "#d97706",
        fillColor: "#f59e0b",
        fillOpacity: 0.35,
        weight: 2
      });
      poly.bindPopup(`<strong>⛰️ Landslide Shear Zone: ${loc.name}</strong><br/>Slope Angle: ${loc.current.slope_deg}° | Soil Moisture: ${loc.current.soil_moisture_pct}%`);
      this.layers.landslide.addLayer(poly);
    });
  }

  renderLightningLayer() {
    this.layers.lightning.clearLayers();
    LOCATIONS_DATA.filter(l => l.current.lightning_strikes_10m > 10).forEach(loc => {
      const icon = L.divIcon({
        className: "lightning-flash-icon",
        html: `<div class="lightning-strike-anim">⚡</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const marker = L.marker([loc.coordinates[0] + 0.05, loc.coordinates[1] + 0.05], { icon });
      marker.bindPopup(`<strong>⚡ Lightning Activity: ${loc.name}</strong><br/>Strikes: ${loc.current.lightning_strikes_10m} / 10 min | CAPE: ${loc.current.cape_index} J/kg`);
      this.layers.lightning.addLayer(marker);
    });
  }

  renderHeatwaveLayer() {
    this.layers.heatwave.clearLayers();
    LOCATIONS_DATA.filter(l => l.current.temperature_c >= 38).forEach(loc => {
      const circle = L.circle(loc.coordinates, {
        color: "#ef4444",
        fillColor: "#f97316",
        fillOpacity: 0.3,
        radius: 60000,
        weight: 1
      });
      circle.bindPopup(`<strong>🌡️ Heatwave Dome: ${loc.name}</strong><br/>Temperature: ${loc.current.temperature_c}°C | Humidity: ${loc.current.humidity_pct}%`);
      this.layers.heatwave.addLayer(circle);
    });
  }

  renderPollutionLayer() {
    this.layers.pollution.clearLayers();
    LOCATIONS_DATA.filter(l => l.current.pm25 > 60).forEach(loc => {
      const circle = L.circle([loc.coordinates[0] - 0.08, loc.coordinates[1] + 0.06], {
        color: "#a855f7",
        fillColor: "#7e22ce",
        fillOpacity: 0.25,
        radius: 25000,
        weight: 1,
        dashArray: "3, 3"
      });
      circle.bindPopup(`<strong>🌫️ Air Pollution Plume: ${loc.name}</strong><br/>PM2.5: ${loc.current.pm25} µg/m³ | AQI: ${loc.current.aqi}`);
      this.layers.pollution.addLayer(circle);
    });
  }

  renderVulnerabilityLayer() {
    this.layers.vulnerability.clearLayers();
    VULNERABILITY_RED_ZONES.forEach(zone => {
      const icon = L.divIcon({
        className: "red-zone-pin",
        html: `<div class="red-zone-badge">🚩 <span>${zone.name.split("–")[0]}</span></div>`,
        iconSize: [90, 24],
        iconAnchor: [45, 12]
      });
      const marker = L.marker(zone.coordinates, { icon });
      marker.bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; font-size:12px; min-width:220px;">
          <strong style="color:#b91c1c; font-size:13px;">🚩 RED ZONE: ${zone.name}</strong><br/>
          <span style="color:#475569;">📍 ${zone.location}</span><br/>
          <div style="margin:6px 0; padding:6px; background:#fee2e2; border-radius:4px; color:#991b1b;">
            <span>Population Exposure: <strong>${zone.population_exposure.toLocaleString("en-IN")}</strong></span><br/>
            <span>Vulnerable Habitations: <strong>${zone.vulnerable_habitations} Sectors</strong></span><br/>
            <span>Composite Threat: <strong>${zone.composite_risk}</strong></span>
          </div>
          <span style="font-size:11px; color:#15803d;">🧭 Safe Evacuation: ${zone.evacuation_corridor}</span>
        </div>
      `);
      this.layers.vulnerability.addLayer(marker);
    });
  }

  renderWeatherStationsLayer() {
    this.layers.stations.clearLayers();
    WEATHER_STATIONS_DATA.forEach(stn => {
      const isAnomaly = stn.anomaly_detected;
      const icon = L.divIcon({
        className: "weather-station-pin",
        html: `<div class="station-dot ${isAnomaly ? 'anomaly-pulse' : 'healthy-dot'}">${isAnomaly ? '⚠️' : '📡'}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      const marker = L.marker([stn.lat, stn.lng], { icon });
      marker.bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; font-size:12px;">
          <strong style="color:${isAnomaly ? '#ef4444' : '#059669'};">${stn.name}</strong><br/>
          <span>ID: <code>${stn.id}</code> | Status: <strong>${stn.status}</strong></span><br/>
          <span>Temp: ${stn.temp_c}°C | Rain: ${stn.rain_mmh} mm/h | Wind: ${stn.wind_kmh} km/h</span><br/>
          ${isAnomaly ? `<div style="margin-top:4px; padding:4px; background:#fee2e2; border-radius:3px; color:#b91c1c;"><strong>⚠️ ANOMALY DETECTED (SIH26073):</strong><br/>${stn.anomaly_type}</div>` : `<span style="color:#10b981;">✅ Quality Control: Sensor Calibration Verified (99.2%)</span>`}
        </div>
      `);
      this.layers.stations.addLayer(marker);
    });
  }

  toggleLayer(layerKey, isVisible) {
    this.activeLayersState[layerKey] = isVisible;
    if (this.layers[layerKey]) {
      if (isVisible) {
        this.map.addLayer(this.layers[layerKey]);
      } else {
        this.map.removeLayer(this.layers[layerKey]);
      }
    }
  }

  flyToLocation(loc) {
    if (!this.map) return;
    this.map.flyTo(loc.coordinates, 10, {
      animate: true,
      duration: 1.2
    });
  }
}
