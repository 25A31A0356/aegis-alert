/**
 * AegisAlert Real-Time Disaster Crisis & Drill Simulator Engine
 * 
 * Provides a hyper-realistic, live-ticking disaster progression experience:
 * - Dynamic second-by-second escalation (rain ramping, river level rising, dam overtopping, breach)
 * - Automated crisis phases (Monitoring -> Surge -> Breach -> Grid Collapse -> Military Airlift)
 * - 1-Click Real-Time Chaos Injectors (Blackout, Cell Tower Failure, Sudden Breach, Trapped SOS)
 * - Authoritative Emergency Voice Announcer (Web Speech Synthesis)
 */

export class DisasterSimulatorEngine {
  constructor(app) {
    this.app = app;
    this.isRunning = false;
    this.speed = 1; // 1x, 5x, 10x
    this.elapsedSeconds = 0;
    this.intervalId = null;
    this.voiceEnabled = true;
    this.currentPhase = "PHASE 1: MONITORING";
  }

  init() {
    this.bindEvents();
    this.renderState();
  }

  bindEvents() {
    const btnToggle = document.getElementById("btn-drill-toggle");
    const btnSpeed = document.getElementById("btn-drill-speed");
    const btnReset = document.getElementById("btn-drill-reset");
    const btnVoice = document.getElementById("btn-drill-voice-announcer");

    if (btnToggle) {
      btnToggle.addEventListener("click", () => this.toggleDrill());
    }

    if (btnSpeed) {
      btnSpeed.addEventListener("click", () => this.toggleSpeed());
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => this.resetDrill());
    }

    if (btnVoice) {
      btnVoice.addEventListener("click", () => {
        this.voiceEnabled = !this.voiceEnabled;
        btnVoice.textContent = this.voiceEnabled ? "🗣️ Voice: ON" : "🗣️ Voice: MUTED";
        btnVoice.classList.toggle("muted", !this.voiceEnabled);
      });
    }

    // Problem Injectors
    document.querySelectorAll(".btn-inject-chaos").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const type = e.target.getAttribute("data-type");
        if (type) this.injectChaos(type);
      });
    });
  }

  toggleDrill() {
    if (this.isRunning) {
      this.pauseDrill();
    } else {
      this.startDrill();
    }
  }

  startDrill() {
    if (this.isRunning) return;
    this.isRunning = true;

    const btnToggle = document.getElementById("btn-drill-toggle");
    if (btnToggle) {
      btnToggle.classList.add("btn-drill-running");
      document.getElementById("drill-icon").textContent = "⏸️";
      document.getElementById("drill-text").textContent = "PAUSE DRILL";
    }

    this.speak("Disaster drill initiated. Telemetry monitoring live.");
    this.app.logTransmission("🚨 [DRILL] Live Crisis Simulation STARTED. Real-time telemetry escalation active.");

    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pauseDrill() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    const btnToggle = document.getElementById("btn-drill-toggle");
    if (btnToggle) {
      btnToggle.classList.remove("btn-drill-running");
      document.getElementById("drill-icon").textContent = "▶️";
      document.getElementById("drill-text").textContent = "RESUME DRILL";
    }

    this.app.logTransmission("⏸️ [DRILL] Crisis simulation paused.");
  }

  resetDrill() {
    this.pauseDrill();
    this.elapsedSeconds = 0;
    this.currentPhase = "PHASE 1: MONITORING";
    this.renderState();
    this.app.loadScenario(this.app.feeds.activeScenario.id);
    this.app.logTransmission("🔄 [DRILL] Simulation reset to baseline environmental telemetry.");
  }

  toggleSpeed() {
    if (this.speed === 1) this.speed = 5;
    else if (this.speed === 5) this.speed = 10;
    else this.speed = 1;

    const lbl = document.getElementById("val-drill-speed");
    if (lbl) lbl.textContent = `${this.speed}x`;
    this.app.logTransmission(`⏩ [DRILL] Simulation speed set to ${this.speed}x real-time.`);
  }

  tick() {
    this.elapsedSeconds += this.speed;
    this.renderState();
    this.processEscalation();
  }

  formatTime(secs) {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `T+${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  renderState() {
    const timeEl = document.getElementById("drill-timer-val");
    if (timeEl) timeEl.textContent = this.formatTime(this.elapsedSeconds);

    const phaseEl = document.getElementById("drill-phase-val");
    if (phaseEl) {
      phaseEl.textContent = this.currentPhase;
      phaseEl.className = `drill-stage-val ${this.getPhaseClass()}`;
    }
  }

  getPhaseClass() {
    if (this.currentPhase.includes("MONITORING")) return "phase-watch";
    if (this.currentPhase.includes("SURGE")) return "phase-warning";
    if (this.currentPhase.includes("BREACH") || this.currentPhase.includes("BLACKOUT")) return "phase-critical";
    return "phase-rescue";
  }

  processEscalation() {
    const s = this.elapsedSeconds;
    const scenario = this.app.feeds.activeScenario;

    // Phase 1: 0 to 25s - Rainfall surges & River swells
    if (s >= 10 && s < 30 && !this.p1_done) {
      this.p1_done = true;
      this.currentPhase = "PHASE 2: MONSOONAL SURGE INFLUX";
      this.renderState();

      // Dynamically fluctuate metric cells
      const val1 = document.getElementById("val-metric-1");
      const val2 = document.getElementById("val-metric-2");
      if (val1) val1.textContent = "95 mm/hr [Torrent]";
      if (val2) val2.textContent = "105.8 m (Danger: 105.7m breached)";

      this.app.logTransmission("⚠️ [DRILL T+00:15] Catchment torrent reached 95 mm/hr. River gauge crossed official CWC Danger Mark!");
      this.speak("Warning: River level has crossed danger mark. Catchment precipitation intensity critical.");
    }

    // Phase 2: 30s to 60s - Catastrophic Breach / Impact Event
    if (s >= 30 && s < 60 && !this.p2_done) {
      this.p2_done = true;
      this.currentPhase = "PHASE 3: CATASTROPHIC EMBANKMENT BREACH";
      this.renderState();

      // Score jump
      const scoreVal = document.getElementById("risk-score-value");
      if (scoreVal) scoreVal.textContent = "98/100";

      const breachEl = document.getElementById("val-breach-time");
      if (breachEl) breachEl.textContent = "🚨 BREACH OCCURRED - WATER OVERTOPPING";

      this.app.logTransmission("🚨 [DRILL T+00:30] CATASTROPHIC BREACH: 30-meter embankment collapse detected at Kamalabari!");
      this.speak("Emergency alert. Catastrophic embankment breach detected. Automatic siren broadcast dispatched to red zone.");

      // Auto-trigger the targeted red zone siren
      this.app.handleTargetedOfflineSiren();

      // Add emergency citizen SOS
      this.app.responderView.addSOS({
        id: `SOS-DRILL-${Math.floor(100 + Math.random() * 900)}`,
        name: "Majuli Secondary School Roof (80 Children)",
        location: `${scenario.coordinates[0].toFixed(4)}°N, ${scenario.coordinates[1].toFixed(4)}°E (Red Zone)`,
        coordinates: scenario.coordinates,
        triageScore: 99,
        priority: "CRITICAL",
        peopleTrapped: 80,
        category: "Mass Entrapment on School Roof",
        forcesRequired: "IAF Mi-17 + 2x NDRF Gemini Boats",
        time: "Just now",
        status: "DISPATCHED"
      });
    }

    // Phase 3: 60s to 90s - Power Grid Collapse & Cellular Destruction
    if (s >= 60 && s < 90 && !this.p3_done) {
      this.p3_done = true;
      this.currentPhase = "PHASE 4: TOTAL GRID & CELLULAR BLACKOUT";
      this.renderState();

      this.app.hardwareNode.toggleGridPower(); // Cut power
      this.app.hardwareNode.toggleCellular();  // Destroy cell tower

      const btnGrid = document.getElementById("toggle-grid-power");
      const btnCell = document.getElementById("toggle-cellular");
      if (btnGrid) {
        btnGrid.classList.remove("active");
        btnGrid.textContent = "⚡ Grid Power: BLACKOUT (CUT)";
      }
      if (btnCell) {
        btnCell.classList.remove("active");
        btnCell.textContent = "📶 Cell Tower: DESTROYED (0 BARS)";
      }

      this.app.logTransmission("⚡ [DRILL T+01:00] GRID BLACKOUT: Local substations submerged. 40,000 homes in dark.");
      this.app.logTransmission("📶 [DRILL T+01:00] CELLULAR COLLAPSE: All telecom towers down. AegisAlert Sub-GHz Airwaves in full control!");
      this.speak("Power grid blackout and cellular collapse confirmed. System operating on autonomous solar airwaves.");
    }

    // Phase 4: 90s+ - Armed Forces Mass Airlift & Media Fact-Check
    if (s >= 90 && !this.p4_done) {
      this.p4_done = true;
      this.currentPhase = "PHASE 5: ARMED FORCES HADR AIRLIFT";
      this.renderState();

      this.app.feeds.pushNextMediaBulletin();
      this.app.renderMediaBulletins();

      this.app.logTransmission("🚁 [DRILL T+01:30] IAF Tezpur Air Command Mi-17 choppers commenced rooftop winching.");
      this.app.logTransmission("📰 [DRILL T+01:30] PIB Fact Check wire broadcasted rumor debunk to all media channels.");
      this.speak("Indian Air Force helicopters airborne. Joint rescue operations proceeding with zero loss of life.");
    }
  }

  injectChaos(type) {
    const scenario = this.app.feeds.activeScenario;

    if (type === "blackout") {
      this.app.hardwareNode.toggleGridPower();
      const btnGrid = document.getElementById("toggle-grid-power");
      if (btnGrid) {
        btnGrid.classList.remove("active");
        btnGrid.textContent = "⚡ Grid Power: BLACKOUT (CUT)";
      }
      this.app.logTransmission("⚡ [CHAOS INJECTION] Simulating catastrophic regional power substation blackout!");
      this.speak("Grid failure injected. Switching to backup lithium iron phosphate storage.");
    } else if (type === "tower_down") {
      this.app.hardwareNode.toggleCellular();
      const btnCell = document.getElementById("toggle-cellular");
      if (btnCell) {
        btnCell.classList.remove("active");
        btnCell.textContent = "📶 Cell Tower: DESTROYED (0 BARS)";
      }
      this.app.logTransmission("📶 [CHAOS INJECTION] Mobile telecom towers wiped out by 120km/h gale winds. 0 bars signal!");
      this.speak("Cellular connectivity lost. Switching to zero-internet broadcast protocol.");
    } else if (type === "breach") {
      const val2 = document.getElementById("val-metric-2");
      if (val2) val2.textContent = "108.4 m (Catastrophic Breach)";
      const breachEl = document.getElementById("val-breach-time");
      if (breachEl) breachEl.textContent = "🚨 EMBANKMENT BREACHED IN REAL-TIME";
      this.app.logTransmission("🌊 [CHAOS INJECTION] Uncontrolled water surge breaches primary floodwall! Red Alert!");
      this.app.handleTargetedOfflineSiren();
      this.speak("Catastrophic breach injected. Red zone siren engaged.");
    } else if (type === "citizen_sos") {
      const sosId = `SOS-INJECT-${Math.floor(100 + Math.random() * 900)}`;
      this.app.responderView.addSOS({
        id: sosId,
        name: "Distressed Family with Pregnant Mother",
        location: `${scenario.coordinates[0].toFixed(4)}°N, ${scenario.coordinates[1].toFixed(4)}°E (Submerged Lowland)`,
        coordinates: scenario.coordinates,
        triageScore: 97,
        priority: "CRITICAL",
        peopleTrapped: 6,
        category: "Urgent Medical Obstetric Trauma",
        forcesRequired: "Army Medical Corps + NDRF Boat",
        time: "Just now",
        status: "DISPATCHED"
      });
      this.app.logTransmission(`🆘 [CHAOS INJECTION] Citizen distress beacon received: ${sosId} - Pregnant mother trapped.`);
      this.speak("High-priority citizen distress beacon received. Dispatched to military first responders.");
    } else if (type === "rockslide") {
      this.app.responderView.addSOS({
        id: `BRO-INJECT-${Math.floor(100 + Math.random() * 900)}`,
        name: "National Highway Blockade (Debris Avalanche)",
        location: "Mountain Pass Kilometer 42",
        coordinates: [scenario.coordinates[0] + 0.05, scenario.coordinates[1] + 0.05],
        triageScore: 94,
        priority: "CRITICAL",
        peopleTrapped: 40,
        category: "Highway Cutoff / Stranded Pilgrims",
        forcesRequired: "BRO Project Shivalik Earthmovers",
        time: "Just now",
        status: "DISPATCHED"
      });
      this.app.logTransmission("⛰️ [CHAOS INJECTION] 8,000 tons of boulder debris blocks highway. BRO bulldozers dispatched.");
      this.speak("Highway landslide reported. Border Roads Organisation task force deployed.");
    }
  }

  speak(text) {
    if (!this.voiceEnabled) return;
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 0.95;
        // Try to pick an English Indian voice if available
        const voices = window.speechSynthesis.getVoices();
        const inVoice = voices.find(v => v.lang.includes("en-IN") || v.name.includes("India"));
        if (inVoice) utterance.voice = inVoice;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
}
