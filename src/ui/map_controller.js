/**
 * AegisAlert Pan-India Tactical GIS Map Controller
 * Leaflet-powered situational awareness for the Head of National Disaster Management
 */

import { CONFIG } from "../config.js";

export class MapController {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.beaconLayer = null;
    this.hazardCircle = null;
    this.shelterMarker = null;
    this.seismicLayer = null;
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
        radius: Math.max(eq.mag * 3.5, 8),
        color: "#f43f5e",
        fillColor: "#fb7185",
        fillOpacity: 0.6,
        weight: 2
      }).bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; font-size:12px;">
          <strong style="color:#e11d48;">⚡ M${eq.mag} Earthquake</strong><br/>
          <span>${eq.place}</span><br/>
          <span>Depth: ${eq.depthKm} km | Reported: ${eq.time}</span><br/>
          <em style="color:#64748b;">USGS & National Center for Seismology</em>
        </div>
      `);
      this.seismicLayer.addLayer(circle);
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
        <span>Capacity: <strong>1,200 Highland Beds</strong></span>
      </div>
    `);
  }

  animateRadioBroadcast(centerCoords, radiusKm) {
    if (!this.map) return;

    let r = 1000;
    const maxRadius = radiusKm * 1000;
    const wave = L.circle(centerCoords, {
      color: "#38bdf8",
      fillColor: "#38bdf8",
      fillOpacity: 0.25,
      radius: r,
      weight: 3
    }).addTo(this.map);

    const step = () => {
      r += 1200;
      wave.setRadius(r);
      const opacity = Math.max(0, 0.4 - (r / maxRadius) * 0.4);
      wave.setStyle({ fillOpacity: opacity, opacity: opacity * 2 });

      if (r < maxRadius) {
        requestAnimationFrame(step);
      } else {
        this.map.removeLayer(wave);
      }
    };

    requestAnimationFrame(step);
  }
}
