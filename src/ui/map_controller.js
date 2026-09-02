/**
 * AegisAlert Pan-India Tactical GIS Map Controller
 * Leaflet-powered situational awareness for the Head of National Disaster Management
 * Integrates live multi-calamity hazard polygons, evacuation routes, and area siren triggers.
 */

import { CONFIG } from "../config.js";

export class MapController {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.beaconLayer = null;
    this.hazardCircle = null;
    this.shelterMarker = null;
    this.evacPath = null;
    this.seismicLayer = null;
    this.calamitiesLayer = null;
    this.waveInterval = null;
  }

  initMap() {
    if (this.map) return;

    // Dark Tactical Basemap from CartoDB
    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView(CONFIG.DEFAULT_MAP_CENTER, CONFIG.DEFAULT_ZOOM);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
      subdomains: "abcd"
    }).addTo(this.map);

    this.beaconLayer = L.layerGroup().addTo(this.map);
    this.seismicLayer = L.layerGroup().addTo(this.map);
    this.calamitiesLayer = L.layerGroup().addTo(this.map);

    this.renderDeployedBeacons();
  }

  renderDeployedBeacons() {
    this.beaconLayer.clearLayers();

    const beaconIcon = L.divIcon({
      className: "beacon-gis-marker",
      html: `<div class="beacon-pulse-icon">📡</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    CONFIG.DEPLOYED_BEACONS.forEach(b => {
      const marker = L.marker([b.lat, b.lng], { icon: beaconIcon })
        .bindPopup(`
          <div style="color:#0f172a; font-family:sans-serif; font-size:12px;">
            <strong style="color:#0284c7;">${b.name}</strong><br/>
            <span>Theater: ${b.theater}</span><br/>
            <span>Status: <strong style="color:#10b981;">${b.status}</strong> (${b.battery}% Batt)</span><br/>
            <em>Autonomous Zero-Internet Mast</em>
          </div>
        `);
      this.beaconLayer.addLayer(marker);
    });
  }

  renderLiveEarthquakes(earthquakes) {
    if (!this.seismicLayer) return;
    this.seismicLayer.clearLayers();

    earthquakes.forEach(eq => {
      if (!eq.coordinates) return;
      const [lat, lng] = eq.coordinates;

      const circle = L.circleMarker([lat, lng], {
        radius: Math.max(eq.mag * 3, 6),
        fillColor: eq.mag >= 5.0 ? "#ef4444" : "#f59e0b",
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      });

      circle.bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; font-size:12px;">
          <strong style="color:#e11d48;">⚡ SEISMIC EVENT M${eq.mag}</strong><br/>
          <span>${eq.place}</span><br/>
          <span>Depth: ${eq.depthKm} km | Reported: ${eq.time}</span><br/>
          <em style="color:#64748b;">USGS & National Center for Seismology</em>
        </div>
      `);
      this.seismicLayer.addLayer(circle);
    });
  }

  renderAllCalamityPins(calamities, onSirenToggle, onMobileAlert) {
    if (!this.calamitiesLayer) return;
    this.calamitiesLayer.clearLayers();

    const iconsMap = {
      FLASH_FLOOD: "🌊",
      LANDSLIDE: "⛰️",
      CYCLONE: "🌀",
      CLOUDBURST: "⛈️",
      HEATWAVE: "☀️"
    };

    calamities.forEach(c => {
      const iconText = iconsMap[c.type] || "⚠️";
      const markerIcon = L.divIcon({
        className: "calamity-pin-marker",
        html: `<div class="calamity-pin-body ${c.siren_active ? 'siren-pulsing' : ''}">${iconText}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(c.coordinates, { icon: markerIcon });
      marker.bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; font-size:12px; min-width:220px;">
          <strong style="color:#b91c1c; font-size:13px;">${iconText} ${c.type.replace('_', ' ')} [${c.severity}]</strong><br/>
          <strong>${c.title}</strong><br/>
          <span style="color:#475569;">📍 ${c.region}</span><br/>
          <div style="margin:6px 0; padding:6px; background:#f1f5f9; border-radius:4px;">
            <span>At-Risk Population: <strong>${c.affected_population.toLocaleString('en-IN')}</strong></span><br/>
            <span>Evacuation: <strong style="color:#0284c7;">${c.evacuation_status}</strong></span><br/>
            <span>Relief Camp: <strong>${c.safe_shelter}</strong></span>
          </div>
          <div style="display:flex; gap:6px; margin-top:8px;">
            <button class="btn-popup-siren" onclick="window.__triggerAreaSiren('${c.id}')" style="background:${c.siren_active ? '#ef4444' : '#0284c7'}; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">
              ${c.siren_active ? '🔇 Silence Area Siren' : '🚨 Trigger Area Siren'}
            </button>
            <button class="btn-popup-sms" onclick="window.__openMobileModal('${c.region}', '${c.safe_shelter}')" style="background:#10b981; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">
              📲 Send Mobile Evac SMS
            </button>
          </div>
        </div>
      `);
      this.calamitiesLayer.addLayer(marker);
    });
  }

  focusScenario(scenario) {
    if (!this.map) return;

    this.map.flyTo(scenario.coordinates, scenario.zoom, {
      animate: true,
      duration: 1.2
    });

    if (this.hazardCircle) {
      this.map.removeLayer(this.hazardCircle);
    }
    if (this.shelterMarker) {
      this.map.removeLayer(this.shelterMarker);
    }
    if (this.evacPath) {
      this.map.removeLayer(this.evacPath);
    }

    // Red Hazard Zone (Red Polygon)
    this.hazardCircle = L.circle(scenario.coordinates, {
      color: "#ef4444",
      fillColor: "#ef4444",
      fillOpacity: 0.3,
      radius: 16000,
      weight: 2,
      dashArray: "6, 6"
    }).addTo(this.map);

    this.hazardCircle.bindPopup(`
      <div style="color:#0f172a; font-family:sans-serif; font-size:12px;">
        <strong style="color:#ef4444;">🚨 CODE RED HAZARD ZONE</strong><br/>
        <span>${scenario.title}</span><br/>
        <span>At-Risk Population: <strong>${scenario.preJudgement.impactedPopulation.toLocaleString("en-IN")}</strong></span>
      </div>
    `);

    // Elevated Safe Shelter Point (+Offset from hazard)
    const shelterCoords = [
      scenario.coordinates[0] + 0.12,
      scenario.coordinates[1] + 0.14
    ];

    const shelterIcon = L.divIcon({
      className: "shelter-gis-marker",
      html: `<div class="shelter-flag-icon">🏕️</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    this.shelterMarker = L.marker(shelterCoords, { icon: shelterIcon }).addTo(this.map);
    this.shelterMarker.bindPopup(`
      <div style="color:#0f172a; font-family:sans-serif; font-size:12px;">
        <strong style="color:#0284c7;">✅ DESIGNATED SAFE HIGHLAND CAMP</strong><br/>
        <span>${scenario.preJudgement.safeShelter}</span><br/>
        <span>Capacity: <strong>1,200 Highland Beds</strong></span><br/>
        <span>Elevation: <strong>+38m Above Danger Line</strong></span>
      </div>
    `);

    // Evacuation Route Line connecting Danger Epicenter to Safe Camp
    this.evacPath = L.polyline([scenario.coordinates, shelterCoords], {
      color: "#10b981",
      weight: 4,
      opacity: 0.85,
      dashArray: "8, 10"
    }).addTo(this.map);
  }

  animateRadioBroadcast(centerCoords, radiusKm = 25) {
    if (!this.map) return;

    let currentRadius = 1000;
    const maxRadius = radiusKm * 1000;

    const radioWave = L.circle(centerCoords, {
      color: "#38bdf8",
      fillColor: "#0284c7",
      fillOpacity: 0.35,
      radius: currentRadius,
      weight: 2
    }).addTo(this.map);

    if (this.waveInterval) clearInterval(this.waveInterval);

    this.waveInterval = setInterval(() => {
      currentRadius += 2500;
      radioWave.setRadius(currentRadius);
      radioWave.setStyle({
        fillOpacity: Math.max(0, 0.35 - (currentRadius / maxRadius) * 0.35)
      });

      if (currentRadius >= maxRadius) {
        clearInterval(this.waveInterval);
        setTimeout(() => this.map.removeLayer(radioWave), 400);
      }
    }, 50);
  }
}
