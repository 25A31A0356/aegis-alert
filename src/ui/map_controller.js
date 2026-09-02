/**
 * AegisAlert Tactical GIS Map Controller (Leaflet Engine)
 * 
 * Renders dark tactical cartography, deployed physical AegisBeacon poles,
 * dynamic flood/cyclone hazard polygons, and safe evacuation corridors.
 */

import { CONFIG } from "../config.js";

export class MapController {
  constructor(mapContainerId = "gis-map") {
    this.mapContainerId = mapContainerId;
    this.map = null;
    this.beaconMarkers = [];
    this.hazardLayer = null;
    this.routeLayer = null;
    this.pulseCircle = null;
  }

  initMap() {
    if (!window.L) {
      console.error("Leaflet library not loaded");
      return;
    }

    // Initialize Leaflet Map with smooth dark theme
    this.map = window.L.map(this.mapContainerId, {
      center: CONFIG.DEFAULT_MAP_CENTER,
      zoom: CONFIG.DEFAULT_ZOOM,
      zoomControl: true
    });

    // Dark Tactical CartoDB / OpenStreetMap tile layer
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(this.map);

    this.renderBeacons();
  }

  /**
   * Renders the deployed physical AegisBeacon field stations on the map
   */
  renderBeacons() {
    // Clear old markers
    this.beaconMarkers.forEach(m => this.map.removeLayer(m));
    this.beaconMarkers = [];

    CONFIG.DEPLOYED_BEACONS.forEach(b => {
      // Custom tactical beacon icon
      const iconHtml = `
        <div class="beacon-map-icon ${b.status === 'ONLINE' ? 'online' : 'offline'}">
          <div class="beacon-core"></div>
          <div class="beacon-pulse"></div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: "custom-beacon-div",
        html: iconHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker([b.lat, b.lng], { icon: customIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="beacon-popup">
          <h4>📡 ${b.name}</h4>
          <p><strong>ID:</strong> ${b.id}</p>
          <p><strong>Status:</strong> <span style="color:#10b981;">● ONLINE (ZERO-INTERNET)</span></p>
          <p><strong>Power:</strong> Solar ${b.solarW}W • Battery ${b.battery}%</p>
          <p><strong>Comm:</strong> ${b.signal}</p>
        </div>
      `);

      this.beaconMarkers.push(marker);
    });
  }

  /**
   * Focuses the map on the selected disaster scenario and draws the hazard geofence
   */
  focusScenario(scenario) {
    if (!this.map) return;

    this.map.flyTo(scenario.coordinates, scenario.zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    // Remove previous hazard zone and routes
    if (this.hazardLayer) this.map.removeLayer(this.hazardLayer);
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    if (this.pulseCircle) this.map.removeLayer(this.pulseCircle);

    const [lat, lng] = scenario.coordinates;

    // Draw Hazard Geofence Circle (Red Danger Area)
    this.hazardLayer = window.L.circle([lat, lng], {
      color: "#ef4444",
      fillColor: "#ef4444",
      fillOpacity: 0.25,
      weight: 2,
      radius: 8000 // 8km radius
    }).addTo(this.map);

    this.hazardLayer.bindTooltip(`🚨 ${scenario.title} - DANGER ZONE GEOFENCE`, {
      permanent: false,
      direction: "top"
    });

    // Draw Evacuation Safe Corridor line
    const safeOffsetLat = lat + 0.05;
    const safeOffsetLng = lng + 0.06;

    this.routeLayer = window.L.polyline([[lat, lng], [safeOffsetLat, safeOffsetLng]], {
      color: "#10b981",
      weight: 4,
      dashArray: "8, 8"
    }).addTo(this.map);

    // Safe Shelter marker
    const shelterMarker = window.L.marker([safeOffsetLat, safeOffsetLng]).addTo(this.map);
    shelterMarker.bindPopup(`
      <div class="beacon-popup">
        <h4>🛡️ Designated High-Ground Shelter</h4>
        <p>${scenario.preJudgement.safeShelter}</p>
        <p style="color:#10b981;">Capacity: Available • Drinking Water: Stocked</p>
      </div>
    `);
  }

  /**
   * Animates a Sub-GHz / Satellite radio wave blast radiating across the map
   */
  animateRadioBroadcast(coordinates, radiusKm = 15) {
    if (!this.map) return;
    if (this.pulseCircle) this.map.removeLayer(this.pulseCircle);

    let currentRadius = 500;
    const maxRadius = radiusKm * 1000;

    this.pulseCircle = window.L.circle(coordinates, {
      color: "#38bdf8",
      fillColor: "#38bdf8",
      fillOpacity: 0.35,
      weight: 2,
      radius: currentRadius
    }).addTo(this.map);

    const interval = setInterval(() => {
      currentRadius += 1000;
      if (this.pulseCircle) {
        this.pulseCircle.setRadius(currentRadius);
        const opacity = Math.max(0, 0.4 * (1 - (currentRadius / maxRadius)));
        this.pulseCircle.setStyle({ fillOpacity: opacity, opacity: opacity * 2 });
      }

      if (currentRadius >= maxRadius) {
        clearInterval(interval);
        setTimeout(() => {
          if (this.pulseCircle) this.map.removeLayer(this.pulseCircle);
        }, 1000);
      }
    }, 50);
  }
}
