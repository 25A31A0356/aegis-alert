/**
 * AegisAlert Master Application Orchestrator
 * Multidisciplinary SIH Edition
 * Coordinates Command War Room, Citizen Hub, NDRF Responders, and Relief Shelters.
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
    this.currentLang = "en";
    this.currentRole = "war-room";

    this.feeds = new OfficialFeeds();
    this.hardwareNode = new BeaconNode("BEACON-KL-01", "Meppadi Riverfront Mast");
    this.mapCtrl = new MapController("gis-map");
    this.lastEncodedPacket = null;

    // Multidisciplinary Sub-Views
    this.citizenView = null;
    this.responderView = null;
    this.shelterView = null;
  }

  async init() {
    console.log("Initializing AegisAlert Multidisciplinary Disaster Ecosystem...");

    // 1. Initialize Map
    this.mapCtrl.initMap();

    // 2. Initialize Sub-Views
    this.initMultidisciplinaryViews();

    // 3. Setup UI Event Listeners & Role Switcher
    this.setupEventListeners();

    // 4. Subscribe Hardware Node updates
    this.hardwareNode.subscribe(state => this.renderHardwareNode(state));

    // 5. Initial Scenario Load (Wayanad)
    this.loadScenario("wayanad_flash_flood");

    // 6. Apply Default Language
    this.applyLanguage(this.currentLang);

    // 7. Background live sensor polling
    this.pollLiveAPIs();
  }

  initMultidisciplinaryViews() {
    // When a citizen triggers an SOS, automatically send it to the NDRF responder queue
    this.citizenView = new CitizenView("citizen-mount-point", (newSos) => {
      this.logTransmission(`🚨 INCOMING CITIZEN SOS: ${newSos.id} at ${newSos.location}`);
      if (this.responderView) {
        this.responderView.addSOS(newSos);
      }
    });

    this.responderView = new ResponderView("responder-mount-point");
    this.shelterView = new ShelterView("shelter-mount-point");

    // Render initial views
    this.citizenView.render(I18N[this.currentLang], this.feeds.activeScenario);
    this.responderView.render();
    this.shelterView.render();
  }

  setupEventListeners() {
    // 1. Multidisciplinary Role Switcher Tabs
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
        this.logTransmission("ALERT SILENCED by Incident Commander. Beacons standing down.");
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

  /**
   * Switches between the 4 Multidisciplinary Views
   */
  switchRole(roleId) {
    this.currentRole = roleId;

    // Update Tab Buttons
    document.querySelectorAll(".role-tab").forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-tab") === roleId);
    });

    // Update Role Views
    document.querySelectorAll(".role-view").forEach(v => {
      v.classList.remove("active");
    });

    const targetView = document.getElementById(`view-${roleId}`);
    if (targetView) targetView.classList.add("active");

    // Re-render citizen or responder view with current scenario context if needed
    if (roleId === "citizen" && this.citizenView) {
      this.citizenView.render(I18N[this.currentLang], this.feeds.activeScenario);
    } else if (roleId === "responder" && this.responderView) {
      this.responderView.render();
    } else if (roleId === "shelter" && this.shelterView) {
      this.shelterView.render();
    } else if (roleId === "war-room" && this.mapCtrl.map) {
      // Trigger map resize fix when switching back to war room
      setTimeout(() => this.mapCtrl.map.invalidateSize(), 150);
    }
  }

  /**
   * Translates UI elements dynamically across Indian languages
   */
  applyLanguage(langCode) {
    this.currentLang = langCode;
    const l = I18N[langCode] || I18N.en;

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

    // Re-render Citizen Hub with new language
    if (this.citizenView) {
      this.citizenView.render(l, this.feeds.activeScenario);
    }

    this.logTransmission(`🌐 Language switched to ${l.name}. Vernacular speech engine updated.`);
  }

  /**
   * Loads and renders a crisis scenario
   */
  loadScenario(scenarioId) {
    const scenario = this.feeds.setScenario(scenarioId);
    if (!scenario) return;

    // 1. Focus Map
    this.mapCtrl.focusScenario(scenario);

    // 2. Analyze Risk
    const riskAnalysis = RiskEngine.analyzeRisk(scenario.type, scenario.telemetry);

    // 3. Update War Room UI
    this.renderWarRoom(scenario, riskAnalysis);

    // 4. Pre-encode radio packet
    this.lastEncodedPacket = RadioProtocol.encodePacket({
      disasterType: scenario.type,
      alertLevel: riskAnalysis.alertLevel,
      zoneId: 101,
      lat: scenario.coordinates[0],
      lng: scenario.coordinates[1],
      radiusKm: 15,
      voiceCode: 1,
      routeId: 2,
      shelterCode: "CAMP01",
      hopLimit: 5
    });

    // 5. Update Citizen View with new shelter
    if (this.citizenView) {
      this.citizenView.render(I18N[this.currentLang], scenario);
    }

    this.logTransmission(`Telemetry loaded for ${scenario.title}. Risk Index: ${riskAnalysis.score}/100 [${riskAnalysis.alertLevel}]`);
  }

  /**
   * Dispatches the 32-Byte Sub-GHz / NavIC Radio Broadcast
   */
  handleBroadcast() {
    if (!this.lastEncodedPacket) return;

    const currentScenario = this.feeds.activeScenario;
    this.logTransmission(`🛰️ INITIATING ZERO-SIGNAL TRANSMISSION (868.1 MHz / NavIC S-Band)...`);
    this.logTransmission(`📦 Binary Frame: ${this.lastEncodedPacket.hexString} [CRC: 0x${this.lastEncodedPacket.crc}]`);

    // 1. Trigger visual radio wave animation on Leaflet map
    this.mapCtrl.animateRadioBroadcast(currentScenario.coordinates, 15);

    // 2. Transmit to the autonomous physical hardware node
    setTimeout(() => {
      this.hardwareNode.receiveRadioPacket(this.lastEncodedPacket.buffer);
      this.logTransmission(`✅ Packet captured by ${this.hardwareNode.nodeId} (Airwave RSSI: -78dBm). CRC16 Verified.`);
      this.logTransmission(`🚨 120dB Siren ENGAGED. 360° Optical Strobes ACTIVATED.`);
      this.logTransmission(`📢 Vernacular Spoken Voice Broadcast starting in ${I18N[this.currentLang].name}.`);
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
      scoreBadge.textContent = `CODE ${risk.alertLevel}`;
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
    if (riverEl) riverEl.textContent = tel.riverLevel !== undefined ? `${tel.riverLevel} m (Danger: ${tel.riverDangerMark}m)` : "Normal";
    if (damEl) damEl.textContent = tel.damCapacity !== undefined ? `${tel.damCapacity} %` : "N/A";
    if (windEl) windEl.textContent = tel.windSpeed !== undefined ? `${tel.windSpeed} km/h` : (tel.magnitude ? `M${tel.magnitude} Rich.` : "Calm");

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

  async pollLiveAPIs() {
    const liveWeather = await this.feeds.fetchLiveWeather();
    const liveSeismic = await this.feeds.fetchLiveEarthquakes();

    const feedStatus = document.getElementById("live-feed-status");
    if (feedStatus) {
      feedStatus.innerHTML = `
        <span style="color:#10b981;">● CONNECTED</span> 
        | Open-Meteo: ${liveWeather.success ? `${liveWeather.temperature}°C, ${liveWeather.pressure}hPa` : 'Simulated'} 
        | NCS/USGS: ${liveSeismic.success ? `${liveSeismic.count} active M3+ events` : 'Online'}
      `;
    }
  }
}

// Start on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  window.aegisApp = new AegisApp();
  window.aegisApp.init();
});
