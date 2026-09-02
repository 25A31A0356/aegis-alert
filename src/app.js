/**
 * AegisAlert Master Application Orchestrator
 * National Emergency Operations Centre (NEOC) Edition
 * Ingests from Open-Meteo, USGS Seismology, NASA EONET, CWC, and IMD.
 */

import { CONFIG } from "./config.js";
import { I18N } from "./i18n/languages.js";
import { OfficialFeeds } from "./telemetry/official_feeds.js";
import { RiskEngine } from "./telemetry/risk_engine.js";
import { RadioProtocol } from "./transmission/radio_protocol.js";
import { BeaconNode } from "./hardware_sim/beacon_node.js";
import { MapController } from "./ui/map_controller.js";
import { CitizenView } from "./roles/citizen_view.js";
import { ResponderView } from "./roles/responder_view.js";
import { ShelterView } from "./roles/shelter_view.js";

class AegisApp {
  constructor() {
    this.currentLang = "hi";
    this.currentRole = "war-room";

    this.feeds = new OfficialFeeds();
    this.hardwareNode = new BeaconNode("BEACON-NAT-01", "Pan-India Civil Defense Mast");
    this.mapCtrl = new MapController("gis-map");
    this.lastEncodedPacket = null;

    // Multidisciplinary Sub-Views
    this.citizenView = null;
    this.responderView = null;
    this.shelterView = null;
  }

  async init() {
    console.log("Initializing AegisAlert National Apex Multi-Ministry Platform...");

    // 1. Initialize Map
    this.mapCtrl.initMap();

    // 2. Render State-by-State Posture Pills for Head of Disaster Management
    this.renderStatePosturePills();

    // 3. Initialize Sub-Views
    this.initMultidisciplinaryViews();

    // 4. Setup UI Event Listeners & Role Switcher
    this.setupEventListeners();

    // 5. Subscribe Hardware Node updates
    this.hardwareNode.subscribe(state => this.renderHardwareNode(state));

    // 6. Initial Scenario Load (Eastern / Brahmaputra Basin Surge)
    this.loadScenario("assam_brahmaputra_surge");

    // 7. Apply Default Language (Hindi)
    this.applyLanguage(this.currentLang);

    // 8. Trigger Parallel Ingestion from Global & National APIs
    await this.syncMultiPlatformTelemetry();

    // Auto-refresh live streams every 45 seconds
    setInterval(() => this.syncMultiPlatformTelemetry(), 45000);
  }

  /**
   * Renders the State-by-State quick selector strip for the Head of Disaster Management
   */
  renderStatePosturePills() {
    const container = document.getElementById("state-posture-pills");
    if (!container) return;

    container.innerHTML = CONFIG.ALL_INDIA_STATES_POSTURE.map(s => `
      <div class="state-pill status-${s.status.toLowerCase()}" data-code="${s.code}" title="${s.hazard} • At-Risk: ${s.populationAtRisk} • Units: ${s.ndrfUnits}">
        <span>● ${s.name} [${s.status}]</span>
      </div>
    `).join("");

    container.querySelectorAll(".state-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const code = pill.getAttribute("data-code");
        this.handleStatePillClick(code);
      });
    });
  }

  handleStatePillClick(stateCode) {
    if (stateCode === "AS" || stateCode === "SK") {
      this.loadScenario("assam_brahmaputra_surge");
    } else if (stateCode === "UK" || stateCode === "HP") {
      this.loadScenario("himalayan_cloudburst_surge");
    } else if (stateCode === "OD" || stateCode === "AP" || stateCode === "WB") {
      this.loadScenario("bay_of_bengal_super_cyclone");
    } else if (stateCode === "MH" || stateCode === "KL" || stateCode === "GJ") {
      this.loadScenario("western_ghats_mumbai_inundation");
    }
  }

  initMultidisciplinaryViews() {
    this.citizenView = new CitizenView("citizen-mount-point", (newSos) => {
      this.logTransmission(`🚨 INCOMING CITIZEN SOS: ${newSos.id} at ${newSos.location}`);
      if (this.responderView) {
        this.responderView.addSOS(newSos);
      }
    });

    this.responderView = new ResponderView("responder-mount-point");
    this.shelterView = new ShelterView("shelter-mount-point");

    this.citizenView.render(I18N[this.currentLang], this.feeds.activeScenario);
    this.responderView.render();
    this.shelterView.render();
  }

  setupEventListeners() {
    // 1. Role Switcher Tabs
    const tabs = document.querySelectorAll(".role-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetTab = tab.getAttribute("data-tab");
        this.switchRole(targetTab);
      });
    });

    // 2. Vernacular Language Selector
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
      langSelect.addEventListener("change", (e) => {
        this.applyLanguage(e.target.value);
      });
    }

    // 3. Scenario Selector
    const scenarioSelect = document.getElementById("scenario-select");
    if (scenarioSelect) {
      scenarioSelect.addEventListener("change", (e) => {
        this.loadScenario(e.target.value);
      });
    }

    // 4. Zero-Signal Broadcast Button
    const btnBroadcast = document.getElementById("btn-broadcast-zero-signal");
    if (btnBroadcast) {
      btnBroadcast.addEventListener("click", () => this.handleBroadcast());
    }

    // 5. Silence Siren Button
    const btnSilence = document.getElementById("btn-silence");
    if (btnSilence) {
      btnSilence.addEventListener("click", () => {
        this.hardwareNode.silenceAlert();
        this.logTransmission("ALERT SILENCED by National Incident Commander.");
      });
    }

    // 6. Grid Blackout Toggle
    const btnGrid = document.getElementById("toggle-grid-power");
    if (btnGrid) {
      btnGrid.addEventListener("click", () => {
        const isConnected = this.hardwareNode.toggleGridPower();
        btnGrid.classList.toggle("active", isConnected);
        btnGrid.textContent = isConnected ? "⚡ Grid Power: ONLINE" : "⚡ Grid Power: BLACKOUT (CUT)";
      });
    }

    // 7. Cellular Cutoff Toggle
    const btnCell = document.getElementById("toggle-cellular");
    if (btnCell) {
      btnCell.addEventListener("click", () => {
        const hasCell = this.hardwareNode.toggleCellular();
        btnCell.classList.toggle("active", hasCell);
        btnCell.textContent = hasCell ? "📶 Cell Tower: ONLINE" : "📶 Cell Tower: DESTROYED (0 BARS)";
      });
    }

    // 8. Audio Mute Toggle
    const btnMute = document.getElementById("toggle-mute");
    if (btnMute) {
      btnMute.addEventListener("click", () => {
        const isMuted = this.hardwareNode.audio.toggleMute();
        btnMute.textContent = isMuted ? "🔇 Audio: MUTED" : "🔊 Audio: LIVE (120dB SIREN)";
      });
    }

    // 9. Packet Inspector Modal Toggle
    const btnInspect = document.getElementById("btn-inspect-packet");
    const modal = document.getElementById("packet-modal");
    const modalClose = document.getElementById("modal-close");

    if (btnInspect && modal) {
      btnInspect.addEventListener("click", () => {
        this.renderPacketInspector();
        modal.classList.add("open");
      });
    }
    if (modalClose && modal) {
      modalClose.addEventListener("click", () => modal.classList.remove("open"));
    }
  }

  switchRole(roleId) {
    this.currentRole = roleId;

    document.querySelectorAll(".role-tab").forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-tab") === roleId);
    });

    document.querySelectorAll(".role-view").forEach(v => {
      v.classList.remove("active");
    });

    const targetView = document.getElementById(`view-${roleId}`);
    if (targetView) targetView.classList.add("active");

    if (roleId === "citizen" && this.citizenView) {
      this.citizenView.render(I18N[this.currentLang], this.feeds.activeScenario);
    } else if (roleId === "responder" && this.responderView) {
      this.responderView.render();
    } else if (roleId === "shelter" && this.shelterView) {
      this.shelterView.render();
    } else if (roleId === "war-room" && this.mapCtrl.map) {
      setTimeout(() => this.mapCtrl.map.invalidateSize(), 150);
    }
  }

  applyLanguage(langCode) {
    this.currentLang = langCode;
    const l = I18N[langCode] || I18N.hi;

    const subhead = document.getElementById("app-subheading");
    if (subhead) subhead.textContent = l.systemTitle;

    const tabWar = document.getElementById("tab-label-warroom");
    const tabCit = document.getElementById("tab-label-citizen");
    const tabRes = document.getElementById("tab-label-responder");
    const tabShe = document.getElementById("tab-label-shelter");

    if (tabWar) tabWar.textContent = l.roleWarRoom;
    if (tabCit) tabCit.textContent = l.roleCitizen;
    if (tabRes) tabRes.textContent = l.roleResponder;
    if (tabShe) tabShe.textContent = l.roleHospital;

    if (this.citizenView) {
      this.citizenView.render(l, this.feeds.activeScenario);
    }

    this.logTransmission(`🌐 National language switched to ${l.name}. Regional voice engine active.`);
  }

  loadScenario(scenarioId) {
    const scenario = this.feeds.setScenario(scenarioId);
    if (!scenario) return;

    this.mapCtrl.focusScenario(scenario);
    const riskAnalysis = RiskEngine.analyzeRisk(scenario.type, scenario.telemetry);
    this.renderWarRoom(scenario, riskAnalysis);

    this.lastEncodedPacket = RadioProtocol.encodePacket({
      disasterType: scenario.type,
      alertLevel: riskAnalysis.alertLevel,
      zoneId: 301,
      lat: scenario.coordinates[0],
      lng: scenario.coordinates[1],
      radiusKm: 25,
      voiceCode: 2,
      routeId: 7,
      shelterCode: "CAMP01",
      hopLimit: 6
    });

    if (this.citizenView) {
      this.citizenView.render(I18N[this.currentLang], scenario);
    }

    const selectEl = document.getElementById("scenario-select");
    if (selectEl && selectEl.value !== scenarioId) {
      selectEl.value = scenarioId;
    }

    this.logTransmission(`Theater Activated: ${scenario.theater} - ${scenario.title}. Risk: ${riskAnalysis.score}/100. Coordinating: ${scenario.leadMinistry}`);
  }

  handleBroadcast() {
    if (!this.lastEncodedPacket) return;

    const currentScenario = this.feeds.activeScenario;
    this.logTransmission(`🛰️ TRANSMITTING NATIONAL AIRWAVE BROADCAST (ISRO NavIC / C-DOT SACHET)...`);
    this.logTransmission(`📦 Binary Frame: ${this.lastEncodedPacket.hexString} [CRC16: 0x${this.lastEncodedPacket.crc}]`);

    this.mapCtrl.animateRadioBroadcast(currentScenario.coordinates, 25);

    setTimeout(() => {
      this.hardwareNode.receiveRadioPacket(this.lastEncodedPacket.buffer);
      this.logTransmission(`✅ Packet broadcast received by ${this.hardwareNode.nodeId} (Airwave RSSI: -72dBm).`);
      this.logTransmission(`🚨 120dB National Siren ENGAGED. 360° Optical Strobes ACTIVATED.`);
      this.logTransmission(`📢 Multilingual Spoken Voice Broadcast starting in ${I18N[this.currentLang].name}.`);
    }, 450);
  }

  renderWarRoom(scenario, risk) {
    const titleEl = document.getElementById("scenario-title");
    if (titleEl) titleEl.textContent = scenario.title;

    const scoreVal = document.getElementById("risk-score-value");
    const scoreBadge = document.getElementById("risk-level-badge");
    const scoreBar = document.getElementById("risk-meter-bar");

    if (scoreVal) scoreVal.textContent = `${risk.score}/100`;
    if (scoreBadge) {
      scoreBadge.textContent = `LEVEL 4 (${risk.alertLevel})`;
      scoreBadge.style.backgroundColor = risk.color;
    }
    if (scoreBar) {
      scoreBar.style.width = `${risk.score}%`;
      scoreBar.style.backgroundColor = risk.color;
    }

    const tel = scenario.telemetry;
    const rainEl = document.getElementById("val-rain");
    const riverEl = document.getElementById("val-river");
    const damEl = document.getElementById("val-dam");
    const windEl = document.getElementById("val-wind");

    if (rainEl) rainEl.textContent = tel.rainfall1h !== undefined ? `${tel.rainfall1h} mm/hr (${tel.rainfall24h}mm / 24h)` : "N/A";
    if (riverEl) riverEl.textContent = tel.riverLevel !== undefined ? `${tel.riverLevel} m (Danger: ${tel.riverDangerMark}m)` : (tel.highTideMeter ? `${tel.highTideMeter}m High Tide` : "Normal");
    if (damEl) damEl.textContent = tel.damCapacity !== undefined ? `${tel.damCapacity} %` : "Monitored";
    if (windEl) windEl.textContent = tel.windSpeed !== undefined ? `${tel.windSpeed} km/h` : "Calm";

    const popEl = document.getElementById("val-population");
    const breachEl = document.getElementById("val-breach-time");
    const actionEl = document.getElementById("val-prevention-action");

    if (popEl) popEl.textContent = scenario.preJudgement.impactedPopulation.toLocaleString("en-IN") + " Citizens";
    if (breachEl) breachEl.textContent = scenario.preJudgement.predictedBreachTimeMin > 0 ? `~${scenario.preJudgement.predictedBreachTimeMin} Minutes` : "Immediate Impact";
    if (actionEl) actionEl.textContent = scenario.preJudgement.recommendedAction;

    const sopList = document.getElementById("sop-list");
    if (sopList) {
      sopList.innerHTML = risk.damageMitigationSOP.map(item => `
        <li class="sop-item priority-${item.priority.toLowerCase()}">
          <span class="sop-tag">${item.priority}</span>
          <span class="sop-text">${item.task}</span>
        </li>
      `).join("");
    }
  }

  renderHardwareNode(state) {
    const battEl = document.getElementById("hw-battery-pct");
    const solarEl = document.getElementById("hw-solar-watts");
    const statusPill = document.getElementById("hw-status-pill");

    if (battEl) battEl.textContent = `${state.batteryPercentage}% (LiFePO4)`;
    if (solarEl) solarEl.textContent = `${state.solarGeneratingWatts}W Solar`;
    if (statusPill) {
      statusPill.textContent = state.state;
      statusPill.className = `status-pill ${state.state.toLowerCase()}`;
    }

    const sirenIndicator = document.getElementById("hw-siren-indicator");
    const strobeLight = document.getElementById("hw-strobe-lamp");
    const ledTicker = document.getElementById("hw-led-ticker");

    if (sirenIndicator) {
      sirenIndicator.className = `indicator-box ${state.sirenActive ? "active-siren" : ""}`;
      sirenIndicator.textContent = state.sirenActive ? "🔊 120dB SIREN: BLARING" : "🔈 Siren: Standby";
    }

    if (strobeLight) {
      strobeLight.className = `strobe-lamp ${state.strobeActive ? "pulsing-red" : "idle-amber"}`;
    }

    if (ledTicker) {
      ledTicker.textContent = state.tickerMessage;
    }
  }

  renderPacketInspector() {
    if (!this.lastEncodedPacket) return;

    const hexContainer = document.getElementById("packet-hex-display");
    const tableBody = document.getElementById("packet-breakdown-rows");

    if (hexContainer) {
      hexContainer.textContent = this.lastEncodedPacket.hexString;
    }

    if (tableBody) {
      tableBody.innerHTML = this.lastEncodedPacket.byteBreakdown.map(b => `
        <tr>
          <td><code>${b.offset}</code></td>
          <td><strong>${b.label}</strong></td>
          <td><code class="hex-badge">${b.hex}</code></td>
          <td>${b.desc}</td>
        </tr>
      `).join("");
    }
  }

  logTransmission(message) {
    const logBox = document.getElementById("transmission-log");
    if (!logBox) return;

    const time = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
    logBox.prepend(entry);
  }

  /**
   * Connects to Open-Meteo, USGS, and NASA EONET and updates UI in real-time
   */
  async syncMultiPlatformTelemetry() {
    const liveData = await this.feeds.syncAllLivePlatforms();

    // 1. Update Open-Meteo stream card
    const weatherBox = document.getElementById("stream-body-weather");
    if (weatherBox && liveData.weather) {
      const w = liveData.weather;
      weatherBox.innerHTML = `
        <div>Temp: <strong>${w.temperature}°C</strong> | Humidity: <strong>${w.humidity}%</strong></div>
        <div>Precipitation: <strong style="color:#38bdf8;">${w.precipitation} mm/hr</strong> | Wind Gusts: <strong>${w.windGusts} km/h</strong></div>
        <div>Pressure: <strong>${w.pressure} hPa</strong> | Source: <em style="color:#94a3b8;">${w.source}</em></div>
      `;
    }

    // 2. Update USGS stream card
    const seismicBox = document.getElementById("stream-body-seismic");
    if (seismicBox && liveData.seismic) {
      const s = liveData.seismic;
      const recent = s.earthquakes[0];
      seismicBox.innerHTML = `
        <div>Regional Events Today: <strong style="color:#f43f5e;">${s.regionalCount}</strong> | Global: <strong>${s.totalGlobalToday || 'Active'}</strong></div>
        <div>Latest: <strong>M${recent.mag}</strong> - ${recent.place}</div>
        <div>Depth: <strong>${recent.depthKm} km</strong> | Source: <em style="color:#94a3b8;">${s.source}</em></div>
      `;
      // Render earthquake circles on map
      this.mapCtrl.renderLiveEarthquakes(s.earthquakes);
    }

    // 3. Update NASA EONET stream card
    const nasaBox = document.getElementById("stream-body-nasa");
    if (nasaBox && liveData.nasaEvents) {
      const n = liveData.nasaEvents;
      const latestEvent = n.events[0] || { title: "Bay of Bengal Tropical Monsoonal Low", category: "Severe Storm" };
      nasaBox.innerHTML = `
        <div>Orbital Disasters Tracked: <strong style="color:#f59e0b;">${n.count} Active</strong></div>
        <div>Latest: <strong>${latestEvent.title}</strong></div>
        <div>Category: <strong style="color:#38bdf8;">${latestEvent.category}</strong> | Source: <em style="color:#94a3b8;">${n.source}</em></div>
      `;
    }

    // 4. Update Header Badge
    const liveStatus = document.getElementById("live-feed-status");
    if (liveStatus) {
      liveStatus.innerHTML = `
        <span style="color:#10b981;">● 6 STREAMS SYNCED</span> 
        | Open-Meteo: ${liveData.weather.precipitation}mm/h 
        | USGS: ${liveData.seismic.regionalCount} active quakes 
        | NASA EONET: ${liveData.nasaEvents.count} events
      `;
    }

    const clockEl = document.getElementById("exec-live-clock");
    if (clockEl) {
      clockEl.textContent = `LIVE MULTI-PLATFORM SYNC: ${liveData.platformsOnline}/3 SCIENTIFIC APIS CONNECTED (${liveData.lastSyncTime})`;
    }
  }
}

// Start on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  window.aegisApp = new AegisApp();
  window.aegisApp.init();
});
