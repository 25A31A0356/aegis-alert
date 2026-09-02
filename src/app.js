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
import { DisasterSimulatorEngine } from "./telemetry/disaster_simulator_engine.js";

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

    // 9. Initial Media Wire & Verified Govt Social Feed
    this.renderMediaBulletins();

    // Auto-refresh live streams every 45 seconds
    setInterval(() => this.syncMultiPlatformTelemetry(), 45000);

    // Dynamic Media & Verified Social updates from time to time (every 18 seconds)
    setInterval(() => {
      this.feeds.pushNextMediaBulletin();
      this.renderMediaBulletins();
    }, 18000);

    // 10. Initialize Live Disaster Drill & Real-Time Crisis Simulator
    this.drillEngine = new DisasterSimulatorEngine(this);
    this.drillEngine.init();

    // 11. Connect to Local Enterprise Disaster Server APIs & SSE Stream
    this.connectLiveServerFeed();
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
    if (stateCode === "AS") {
      this.loadScenario("assam_brahmaputra_surge");
    } else if (stateCode === "KL") {
      this.loadScenario("wayanad_mountain_landslide");
    } else if (stateCode === "UK") {
      this.loadScenario("kedarnath_intense_cloudburst");
    } else if (stateCode === "OD" || stateCode === "AP") {
      this.loadScenario("bay_of_bengal_super_cyclone");
    } else if (stateCode === "WB") {
      this.loadScenario("bengal_violent_tornado");
    } else if (stateCode === "RJ" || stateCode === "DL") {
      this.loadScenario("rajasthan_extreme_heatwave");
    } else if (stateCode === "HP") {
      this.loadScenario("himalayan_seismic_rupture");
    } else {
      this.loadScenario("assam_brahmaputra_surge");
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

    // 4b. Targeted Offline Siren Button (Red Zone Only)
    const btnTargetedSiren = document.getElementById("btn-targeted-red-siren");
    if (btnTargetedSiren) {
      btnTargetedSiren.addEventListener("click", () => this.handleTargetedOfflineSiren());
    }

    // 4c. Push Official PIB Media Fact-Check Button
    const btnPushMedia = document.getElementById("btn-push-media-bulletin");
    if (btnPushMedia) {
      btnPushMedia.addEventListener("click", () => {
        const next = this.feeds.pushNextMediaBulletin();
        if (next) {
          this.logTransmission(`📢 DISPATCHED OFFICIAL PRESS BULLETIN: ${next.title}`);
          this.renderMediaBulletins();
        }
      });
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

    // 10. Mobile Evacuation Alert & SMS Dispatch Simulator
    const btnSendMobile = document.getElementById("btn-send-mobile-alert");
    if (btnSendMobile) {
      btnSendMobile.addEventListener("click", async () => {
        const phone = document.getElementById("sms-phone-input")?.value || "+91 98450 11223";
        const calId = document.getElementById("sms-calamity-select")?.value || "CAL-01";
        const cal = (this.calamities || []).find(c => c.id === calId) || { region: "Majuli, Assam", safe_shelter: "Garmur Highland Camp (+38m)" };

        try {
          const res = await fetch("/api/mobile/simulate-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: phone,
              location: cal.region,
              evacuation_target: cal.safe_shelter
            })
          });

          if (res.ok) {
            const data = await res.json();
            const notifBody = document.getElementById("phone-notif-body");
            if (notifBody) {
              notifBody.textContent = `Severe hazard in ${cal.region}. Immediate evacuation ordered. Follow marked route to ${cal.safe_shelter}. Helpline: 112. Free medical care available.`;
            }
            this.logTransmission(`📲 MOBILE EVACUATION ALERT DISPATCHED: Recipient ${phone} [${cal.region}] via C-DOT SACHET Cell Broadcast.`);
            alert(`🚨 Evacuation SMS Sent to ${phone}!\nCarrier: C-DOT SACHET Cell Broadcast\nSafe Route: ${cal.safe_shelter}`);
          }
        } catch (err) {
          console.warn("SMS dispatch error:", err);
        }
      });
    }

    // 11. Geographical Hazard Area Sirens
    document.querySelectorAll(".btn-toggle-geo-siren").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const calId = e.target.getAttribute("data-id");
        const card = document.getElementById(`siren-card-${calId}`);
        const isCurrentlyActive = btn.classList.contains("btn-siren-active");
        const nextState = !isCurrentlyActive;

        try {
          const res = await fetch("/api/alerts/siren/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ calamity_id: calId, state: nextState })
          });

          if (res.ok) {
            if (nextState) {
              btn.classList.add("btn-siren-active");
              btn.textContent = "🚨 Siren: ACTIVE (120dB)";
              if (card) card.classList.add("active");
              this.hardwareNode.soundAlert();
              this.logTransmission(`🚨 GEOGRAPHICAL SIREN ENGAGED: 120dB Acoustic Horn sounding for ${calId}.`);
            } else {
              btn.classList.remove("btn-siren-active");
              btn.textContent = "🔈 Siren: STANDBY";
              if (card) card.classList.remove("active");
              this.hardwareNode.silenceAlert();
              this.logTransmission(`🔇 GEOGRAPHICAL SIREN SILENCED for ${calId}.`);
            }
          }
        } catch (err) {
          console.warn("Siren trigger error:", err);
        }
      });
    });

    // Expose helpers for map popups
    window.__triggerAreaSiren = (calId) => {
      const btn = document.querySelector(`.btn-toggle-geo-siren[data-id="${calId}"]`);
      if (btn) btn.click();
    };

    window.__openMobileModal = (region, shelter) => {
      const sel = document.getElementById("sms-calamity-select");
      if (sel) {
        for (let opt of sel.options) {
          if (opt.text.includes(region.split(',')[0])) {
            sel.value = opt.value;
            break;
          }
        }
      }
      const btn = document.getElementById("btn-send-mobile-alert");
      if (btn) btn.click();
    };
  }

  async connectLiveServerFeed() {
    try {
      const res = await fetch("/api/calamities/live");
      if (res.ok) {
        const data = await res.json();
        this.calamities = data.calamities || [];
        this.mapCtrl.renderAllCalamityPins(this.calamities);
        this.logTransmission(`✅ Connected to Local Disaster Server API. Loaded ${this.calamities.length} national calamity sectors.`);
      }
    } catch (e) {
      console.warn("Local server feed unavailable:", e);
    }

    // Connect to Server-Sent Events (SSE) stream
    try {
      const evtSource = new EventSource("/api/stream");
      evtSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "TELEMETRY_TICK") {
            const timeBadge = document.getElementById("live-platform-count-tag");
            if (timeBadge) timeBadge.textContent = `SSE LIVE STREAM: ${payload.time}`;
          }
        } catch (e) {}
      };
    } catch (e) {}
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
    this.logTransmission(`🏛️ SOVEREIGN GOVERNMENT AUTHORIZATION VERIFIED: Incident Commander Shri R. K. Verma, IAS [SEC. 10(2)(l) DM ACT]`);
    this.logTransmission(`🔐 Cryptographic Seal Applied: SHA256: 7F4B92C8E109DA3541BF884E0C392A`);
    this.logTransmission(`🛰️ TRANSMITTING GEOFENCED AIRWAVE BROADCAST (ISRO NavIC / C-DOT SACHET / Sub-GHz)...`);
    this.logTransmission(`📦 32-Byte Binary Frame: ${this.lastEncodedPacket.hexString} [CRC16: 0x${this.lastEncodedPacket.crc}]`);
    this.logTransmission(`🎯 Targeted Geofence Polygon: Alerting only citizens inside 16.0 km Red Hazard Radius.`);

    this.mapCtrl.animateRadioBroadcast(currentScenario.coordinates, 25);

    setTimeout(() => {
      this.hardwareNode.receiveRadioPacket(this.lastEncodedPacket.buffer);
      this.logTransmission(`✅ Packet received by ${this.hardwareNode.nodeId} (Airwave RSSI: -72dBm).`);
      this.logTransmission(`🚨 120dB National Siren ENGAGED. 360° Optical Strobes ACTIVATED.`);
      this.logTransmission(`📢 Multilingual Spoken Voice Broadcast starting in ${I18N[this.currentLang].name}.`);
    }, 450);
  }

  handleTargetedOfflineSiren() {
    if (!this.lastEncodedPacket) return;

    const currentScenario = this.feeds.activeScenario;
    this.logTransmission(`🎯 INITIATING TARGETED OFFLINE SIREN (RED ZONE POLYGON ONLY)...`);
    this.logTransmission(`📡 Sub-GHz Airwave Frame (868 MHz): Target Geofence Zone [${currentScenario.theater.toUpperCase()}]`);
    this.logTransmission(`🔐 Overriding 120dB Remote Siren on Autonomous Beacon Masts within 16.0km.`);
    this.logTransmission(`⚡ Zero-Internet Command: [NODE_ADDR: 0x7E4A -> SIREN_FORCE_ENGAGE]`);

    this.mapCtrl.animateRadioBroadcast(currentScenario.coordinates, 18);

    setTimeout(() => {
      this.hardwareNode.receiveRadioPacket(this.lastEncodedPacket.buffer);
      this.logTransmission(`✅ 4 Autonomous Warning Masts inside RED ZONE confirmed receipt via LoRa Mesh.`);
      this.logTransmission(`📢 120dB Acoustic Horns sounding in Red Hazard Sector. Outside sectors remain silent.`);
    }, 400);
  }

  renderMediaBulletins() {
    const container = document.getElementById("media-bulletins-stream");
    if (!container) return;

    const bulletins = this.feeds.mediaBulletins;
    container.innerHTML = bulletins.map(b => `
      <div class="media-bulletin-card badge-${b.urgency.toLowerCase()}">
        <div class="bulletin-header">
          <span class="source-badge ${b.badgeClass}">${b.source}</span>
          <span class="bulletin-time">${b.timestamp}</span>
        </div>
        <strong class="bulletin-title">${b.title}</strong>
        <p class="bulletin-body">${b.body}</p>
      </div>
    `).join("");
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
    const lbl1 = document.getElementById("lbl-metric-1");
    const val1 = document.getElementById("val-metric-1");
    const lbl2 = document.getElementById("lbl-metric-2");
    const val2 = document.getElementById("val-metric-2");
    const lbl3 = document.getElementById("lbl-metric-3");
    const val3 = document.getElementById("val-metric-3");
    const lbl4 = document.getElementById("lbl-metric-4");
    const val4 = document.getElementById("val-metric-4");

    if (scenario.type === "LANDSLIDE") {
      if (lbl1) lbl1.textContent = "72h Rain Accumulation";
      if (val1) val1.textContent = `${tel.rainfall72h} mm [Saturation]`;
      if (lbl2) lbl2.textContent = "Mountain Slope Gradient";
      if (val2) val2.textContent = `${tel.slopeAngle}° Steep Incline`;
      if (lbl3) lbl3.textContent = "Sub-Surface Pore Pressure";
      if (val3) val3.textContent = `${tel.porePressureKPa} kPa [Critical]`;
      if (lbl4) lbl4.textContent = "Debris Mudflow Velocity";
      if (val4) val4.textContent = "45 km/h";
    } else if (scenario.type === "CLOUDBURST") {
      if (lbl1) lbl1.textContent = "Precipitation Core Rate";
      if (val1) val1.textContent = `${tel.rainfall1h} mm/hr [Torrent]`;
      if (lbl2) lbl2.textContent = "15-Min Flash Influx";
      if (val2) val2.textContent = `${tel.rainfall15m} mm`;
      if (lbl3) lbl3.textContent = "Mountain Runoff Velocity";
      if (val3) val3.textContent = `${tel.flashSurgeVelocityKmh} km/h`;
      if (lbl4) lbl4.textContent = "Valley Squall Wind";
      if (val4) val4.textContent = `${tel.windSpeed} km/h`;
    } else if (scenario.type === "CYCLONE") {
      if (lbl1) lbl1.textContent = "Destructive Toofan Wind";
      if (val1) val1.textContent = `${tel.windSpeed} km/h [Category 5]`;
      if (lbl2) lbl2.textContent = "Central Barometric Eye";
      if (val2) val2.textContent = `${tel.centralPressure} hPa (Deep)`;
      if (lbl3) lbl3.textContent = "Coastal Storm Surge";
      if (val3) val3.textContent = `${tel.stormSurgeHeight} m Tide`;
      if (lbl4) lbl4.textContent = "24h Accumulated Rain";
      if (val4) val4.textContent = `${tel.rainfall24h} mm`;
    } else if (scenario.type === "TORNADO") {
      if (lbl1) lbl1.textContent = "Vortex Funnel Wind";
      if (val1) val1.textContent = `${tel.vortexWindSpeed} km/h [Tornado]`;
      if (lbl2) lbl2.textContent = "Doppler Hook Echo";
      if (val2) val2.textContent = `${tel.radarReflectivityDbz} dBZ [Severe]`;
      if (lbl3) lbl3.textContent = "Lightning Strike Density";
      if (val3) val3.textContent = `${tel.lightningFlashesPerMin} flashes/min`;
      if (lbl4) lbl4.textContent = "Eye Pressure Drop";
      if (val4) val4.textContent = `${tel.centralPressure} hPa`;
    } else if (scenario.type === "HEATWAVE") {
      if (lbl1) lbl1.textContent = "Peak Scorching Heat (Loo)";
      if (val1) val1.textContent = `${tel.temperatureMax} °C [Scorching]`;
      if (lbl2) lbl2.textContent = "Climate Departure";
      if (val2) val2.textContent = `+${(tel.temperatureMax - tel.normalClimateTemp).toFixed(1)} °C Above Normal`;
      if (lbl3) lbl3.textContent = "Relative Humidity";
      if (val3) val3.textContent = `${tel.relativeHumidity} % (Dry Heat)`;
      if (lbl4) lbl4.textContent = "Thermal Stress (WBGT)";
      if (val4) val4.textContent = "54.2 °C [Heatstroke]";
    } else if (scenario.type === "EARTHQUAKE") {
      if (lbl1) lbl1.textContent = "Richter Magnitude";
      if (val1) val1.textContent = `M${tel.magnitude} Severe`;
      if (lbl2) lbl2.textContent = "Focal Hypocenter Depth";
      if (val2) val2.textContent = `${tel.depthKm} km (Shallow)`;
      if (lbl3) lbl3.textContent = "Surface Shaking";
      if (val3) val3.textContent = "MMI VIII (Destructive)";
      if (lbl4) lbl4.textContent = "Tectonic Fault Zone";
      if (val4) val4.textContent = "Main Central Thrust";
    } else {
      if (lbl1) lbl1.textContent = "Live Rain Rate";
      if (val1) val1.textContent = `${tel.rainfall1h !== undefined ? tel.rainfall1h + " mm/hr" : "N/A"}`;
      if (lbl2) lbl2.textContent = "River Gauge (CWC)";
      if (val2) val2.textContent = `${tel.riverLevel !== undefined ? tel.riverLevel + " m (Danger: " + tel.riverDangerMark + "m)" : "Normal"}`;
      if (lbl3) lbl3.textContent = "Dam Safety (NDSA)";
      if (val3) val3.textContent = `${tel.damCapacity !== undefined ? tel.damCapacity + " %" : "Monitored"}`;
      if (lbl4) lbl4.textContent = "Surface Wind";
      if (val4) val4.textContent = `${tel.windSpeed !== undefined ? tel.windSpeed + " km/h" : "Calm"}`;
    }

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
