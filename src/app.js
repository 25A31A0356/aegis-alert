/**
 * AEGIS ALERT - Master Application Controller
 * AI-Powered Multi-Hazard Early Warning & Situational Awareness Platform
 * Inspired by Smart India Hackathon problem statements: SIH26001 - SIH26192
 *
 * NOTE: PROTOTYPE DEMO PLATFORM - NOT FOR REAL-WORLD EMERGENCY DECISION MAKING
 */

import { LOCATIONS_DATA, VULNERABILITY_RED_ZONES, WEATHER_STATIONS_DATA } from "./data/locations_data.js";
import { RiskFusionEngine } from "./telemetry/risk_fusion_engine.js";
import { LiveDataService } from "./telemetry/live_data_service.js";
import { AegisAiAssistant } from "./ai/aegis_assistant.js";
import { ChartsController } from "./ui/charts_controller.js";
import { MapController } from "./ui/map_controller.js";
import { I18N } from "./i18n/languages.js";

class AegisApp {
  constructor() {
    this.currentLocation = LOCATIONS_DATA[0]; // Hyderabad default
    this.currentScenario = "flash_flood";
    this.currentLanguage = localStorage.getItem("aegis_lang") || "en";
    this.currentRisks = null;
    this.activeView = "view-dashboard";

    this.mapCtrlDashboard = null;
    this.mapCtrlFull = null;
    this.chartsCtrl = new ChartsController();
    this.aiAssistant = new AegisAiAssistant(this);
    this.liveDataService = new LiveDataService();
    this.liveForecastData = null;
    this.isLiveSyncActive = true;

    this.scenarioInterval = null;
    this.scenarioTimeSec = 0;
  }

  async init() {
    console.log("Initializing AEGIS ALERT Multilingual Multi-Hazard Platform...");

    try {
      // 1. Calculate Initial Multi-Hazard Risk Fusion FIRST
      this.updateRiskCalculations();

      // 2. Apply Saved/Initial Language
      this.applyLanguage(this.currentLanguage, false);

      // 3. Initialize GIS Maps
      this.initMaps();

      // 4. Render Dashboard Metrics & Red Zones Table
      this.renderDashboard();
      this.renderRedZonesTable();

      // 5. Initialize Interactive Charts
      setTimeout(() => {
        try {
          this.chartsCtrl.renderForecastChart("chart-forecast-main", this.currentLocation);
          this.chartsCtrl.renderForecastChart("chart-flood-detail", this.currentLocation);
          this.chartsCtrl.renderAnalyticsTrends("chart-analytics-main", "24h");
          this.chartsCtrl.renderRiskRadar("chart-risk-radar", this.currentRisks);
          this.chartsCtrl.renderSensorVarianceChart("chart-sensor-variance");
        } catch (err) {
          console.warn("Charts render caught:", err);
        }
      }, 200);

      // 6. Setup Global Event Listeners & Navigation
      this.setupEventListeners();

      // 7. Render Initial AI Chat Stream
      this.renderAiChat();

      // 8. Register Global Helpers
      window.__selectLocation = (locId) => this.selectLocation(locId);
    } catch (e) {
      console.error("Critical app.js init error:", e);
    }
  }

  initMaps() {
    try {
      if (document.getElementById("gis-map-dashboard")) {
        this.mapCtrlDashboard = new MapController("gis-map-dashboard", (loc) => this.selectLocation(loc.id));
        this.mapCtrlDashboard.initMap();
      }
      if (document.getElementById("gis-map-full")) {
        this.mapCtrlFull = new MapController("gis-map-full", (loc) => this.selectLocation(loc.id));
        this.mapCtrlFull.initMap();
      }
    } catch (err) {
      console.warn("initMaps caught:", err);
    }
  }

  updateRiskCalculations() {
    const env = { ...this.currentLocation.current };

    // Apply scenario overrides if available
    if (this.currentLocation.scenarios && this.currentLocation.scenarios[this.currentScenario]) {
      Object.assign(env, this.currentLocation.scenarios[this.currentScenario]);
    }

    this.currentRisks = RiskFusionEngine.calculateRisks(env);
  }

  renderDashboard() {
    if (!this.currentRisks) {
      this.updateRiskCalculations();
    }
    const loc = this.currentLocation;
    const env = { ...loc.current, ...(loc.scenarios?.[this.currentScenario] || {}) };
    const r = this.currentRisks;

    // Overview Hero
    const elLocName = document.getElementById("overview-location-name");
    const elLocDesc = document.getElementById("overview-location-desc");
    const elCompScore = document.getElementById("composite-score-num");
    const elCompLevel = document.getElementById("composite-level-badge");
    const elCompMeter = document.getElementById("composite-meter-fill");
    const elAiExpl = document.getElementById("overview-ai-explanation");

    if (elLocName) elLocName.textContent = `${loc.name}, ${loc.state}`;
    if (elLocDesc) elLocDesc.textContent = `${loc.terrain} • ${loc.description}`;
    if (elCompScore) elCompScore.innerHTML = `${r.composite.score}<span class="score-max">/100</span>`;
    if (elCompLevel) {
      elCompLevel.textContent = `${r.composite.level} RISK`;
      elCompLevel.className = `risk-badge-pill level-${r.composite.level.toLowerCase()}`;
    }
    if (elCompMeter) {
      elCompMeter.style.width = `${r.composite.score}%`;
      elCompMeter.style.background = r.composite.score >= 85 ? "#ef4444" : r.composite.score >= 70 ? "#f97316" : r.composite.score >= 40 ? "#f59e0b" : "#10b981";
    }
    if (elAiExpl) {
      elAiExpl.innerHTML = `<strong>AI Threat Diagnosis:</strong> ${r.composite.explanation}`;
    }

    // 6 Hazard Cards
    const hazards = r.hazards;
    this.updateHazardCard("rain", hazards.rainfall);
    this.updateHazardCard("flood", hazards.flood);
    this.updateHazardCard("landslide", hazards.landslide);
    this.updateHazardCard("lightning", hazards.lightning);
    this.updateHazardCard("heat", hazards.heat);
    this.updateHazardCard("pollution", hazards.pollution);

    // Current Environmental Variables Panel
    document.getElementById("val-env-rain").textContent = `${env.rainfall_mmh} mm/h`;
    document.getElementById("val-env-rain24").textContent = `${env.accumulated_24h_mm} mm`;
    document.getElementById("val-env-temp").textContent = `${env.temperature_c} °C`;
    document.getElementById("val-env-humidity").textContent = `${env.humidity_pct} %`;
    document.getElementById("val-env-wind").textContent = `${env.wind_speed_kmh} km/h`;
    document.getElementById("val-env-pressure").textContent = `${env.pressure_hpa} hPa`;
    document.getElementById("val-env-elevation").textContent = `${loc.elevation_m} m MSL`;
    document.getElementById("val-env-slope").textContent = `${loc.current.slope_deg} °`;
    document.getElementById("val-env-soil").textContent = `${env.soil_moisture_pct} %`;
    document.getElementById("val-env-aqi").textContent = `${env.aqi || 120} (${env.aqi > 200 ? 'Poor' : env.aqi > 100 ? 'Moderate' : 'Good'})`;
    document.getElementById("val-env-pop").textContent = loc.current.population_exposed.toLocaleString("en-IN");
    document.getElementById("val-env-habitations").textContent = `${loc.current.vulnerable_habitations} Sectors`;

    // Flood Sub-view metrics
    const elStage = document.getElementById("flood-metric-stage");
    const elDanger = document.getElementById("flood-metric-danger");
    const elProb = document.getElementById("flood-metric-prob");
    if (elStage) elStage.textContent = `${env.water_level_m} m`;
    if (elDanger) elDanger.textContent = `${env.danger_mark_m} m`;
    if (elProb) elProb.textContent = `${hazards.flood.score} %`;

    // Landslide Sub-view metrics
    const elSlope = document.getElementById("landslide-metric-slope");
    const elRain72 = document.getElementById("landslide-metric-rain72");
    const elSoil = document.getElementById("landslide-metric-soil");
    if (elSlope) elSlope.textContent = `${loc.current.slope_deg} °`;
    if (elRain72) elRain72.textContent = `${env.accumulated_24h_mm} mm`;
    if (elSoil) elSoil.textContent = `${env.soil_moisture_pct} %`;

    // Lightning Sub-view metrics
    const elCape = document.getElementById("lightning-metric-cape");
    const elStrikes = document.getElementById("lightning-metric-strikes");
    if (elCape) elCape.textContent = `${env.cape_index || 2400} J/kg`;
    if (elStrikes) elStrikes.textContent = `${env.lightning_strikes_10m || 12} Strikes`;

    // Heat Sub-view metrics
    const elTemp = document.getElementById("heat-metric-temp");
    const elHum = document.getElementById("heat-metric-humidity");
    if (elTemp) elTemp.textContent = `${env.temperature_c} °C`;
    if (elHum) elHum.textContent = `${env.humidity_pct} %`;

    // Pollution Sub-view metrics
    const elAqi = document.getElementById("poll-metric-aqi");
    const elPm25 = document.getElementById("poll-metric-pm25");
    const elPm10 = document.getElementById("poll-metric-pm10");
    if (elAqi) elAqi.textContent = `${env.aqi || 120} (${env.aqi > 200 ? 'Poor' : 'Moderate'})`;
    if (elPm25) elPm25.textContent = `${env.pm25} µg/m³`;
    if (elPm10) elPm10.textContent = `${env.pm10} µg/m³`;
  }

  updateHazardCard(type, h) {
    const elScore = document.getElementById(`card-${type}-score`);
    const elLevel = document.getElementById(`card-${type}-level`);
    const elTrend = document.getElementById(`card-${type}-trend`);
    const elDesc = document.getElementById(`card-${type}-desc`);

    if (elScore) elScore.textContent = `${h.score}%`;
    if (elLevel) {
      elLevel.textContent = h.level;
      elLevel.className = `risk-badge-sm level-${h.level.toLowerCase()}`;
    }
    if (elTrend) elTrend.textContent = h.trend;
    if (elDesc) elDesc.textContent = h.explanation;
  }

  renderRedZonesTable() {
    const tbody = document.getElementById("red-zones-table-body");
    if (!tbody) return;

    tbody.innerHTML = VULNERABILITY_RED_ZONES.map(z => `
      <tr>
        <td><strong>${z.name}</strong></td>
        <td>📍 ${z.location}</td>
        <td><strong>${z.population_exposure.toLocaleString("en-IN")}</strong></td>
        <td>${z.vulnerable_habitations} Sectors</td>
        <td><span class="text-red">${z.flood_risk}</span></td>
        <td><span>${z.landslide_risk}</span></td>
        <td><span class="risk-badge-sm level-critical">${z.composite_risk}</span></td>
        <td><small style="color: #10b981;">🧭 ${z.evacuation_corridor}</small></td>
      </tr>
    `).join("");
  }

  renderAiChat() {
    const thread = document.getElementById("ai-chat-thread");
    if (!thread) return;

    thread.innerHTML = this.aiAssistant.chatHistory.map(msg => `
      <div class="chat-bubble bubble-${msg.sender}">
        <div class="bubble-header">
          <strong>${msg.sender === 'aegis' ? '🤖 Ask AEGIS AI' : '👤 You (Demo User)'}</strong>
          <span>${msg.time}</span>
        </div>
        <div class="bubble-text">${this.formatMarkdown(msg.text)}</div>
      </div>
    `).join("");

    thread.scrollTop = thread.scrollHeight;
  }

  formatMarkdown(txt) {
    return txt
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  }

  applyLanguage(langKey, speak = false) {
    const t = I18N[langKey] || I18N.en;
    this.currentLanguage = langKey;
    localStorage.setItem("aegis_lang", langKey);

    // Update Select Dropdown & Language Pills
    const selLang = document.getElementById("global-language-select") || document.getElementById("lang-select");
    if (selLang) selLang.value = langKey;

    document.querySelectorAll(".lang-pill-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === langKey);
    });

    // Brand & Header
    const heading = document.getElementById("app-heading");
    if (heading) heading.innerHTML = `${t.appHeading} <span class="brand-tag">MULTI-HAZARD INTELLIGENCE</span>`;
    const subheading = document.getElementById("app-subheading");
    if (subheading) subheading.textContent = `"${t.tagline}" • SIH26001–SIH26192`;

    // Navigation Tabs
    const navMap = {
      "view-dashboard": t.navDashboard,
      "view-map": t.navMap,
      "view-hazards": t.navHazards,
      "view-forecast": t.navForecast,
      "view-analytics": t.navAnalytics,
      "view-vulnerability": t.navRedZones,
      "view-alerts": t.navAlerts,
      "view-ai": t.navAi,
      "view-about": t.navAbout
    };
    document.querySelectorAll(".nav-btn").forEach(btn => {
      const v = btn.getAttribute("data-view");
      if (navMap[v]) btn.textContent = navMap[v];
    });

    // Buttons & Badges
    const btnRun = document.getElementById("label-run-scenario");
    if (btnRun) btnRun.textContent = t.runScenario.replace(/^🚨\s*/, "");
    const lblDemo = document.getElementById("label-demo-mode");
    if (lblDemo) lblDemo.textContent = t.demoMode;

    // Situation Overview Header
    const sitHeading = document.getElementById("situation-overview-heading");
    if (sitHeading) sitHeading.textContent = t.situationOverview;

    // Risk Meter Label
    const compLabel = document.getElementById("composite-risk-title");
    if (compLabel) compLabel.textContent = t.compositeScore;

    // 6 Hazard Card Titles
    const hazTitles = {
      "rain": t.rainRisk,
      "flood": t.floodRisk,
      "landslide": t.landslideRisk,
      "lightning": t.lightningRisk,
      "heat": t.heatRisk,
      "pollution": t.pollutionRisk
    };
    Object.keys(hazTitles).forEach(k => {
      const el = document.getElementById(`hazard-title-${k}`);
      if (el) el.textContent = hazTitles[k];
    });

    // Environmental Parameters Header
    const envHeader = document.getElementById("env-params-title");
    if (envHeader) envHeader.textContent = t.currentVariables;

    // Disclaimer
    const disc = document.querySelector(".demo-disclaimer-banner span");
    if (disc) disc.innerHTML = `⚠️ <strong>${t.demoMode}:</strong> ${t.disclaimer}`;

    // Re-render Dashboard & Tables
    this.renderDashboard();

    // Optional Audio Voice Announcement
    if (speak) {
      this.playVoiceAlert();
    }
  }

  playVoiceAlert() {
    if (!('speechSynthesis' in window)) {
      console.warn("SpeechSynthesis API not supported in this browser.");
      return;
    }

    const t = I18N[this.currentLanguage] || I18N.en;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utter = new SpeechSynthesisUtterance(t.voiceAlert);
    utter.lang = t.langCode || "en-IN";
    utter.rate = 0.95; // Slightly slower for clarity
    utter.pitch = 1.05;

    // Visual button feedback
    const btnVoice = document.getElementById("btn-voice-readout");
    if (btnVoice) {
      btnVoice.classList.add("voice-active");
      utter.onend = () => btnVoice.classList.remove("voice-active");
      utter.onerror = () => btnVoice.classList.remove("voice-active");
    }

    window.speechSynthesis.speak(utter);
  }

  async selectLocation(locId, autoFetchLive = true) {
    const loc = LOCATIONS_DATA.find(l => l.id === locId) || LOCATIONS_DATA[0];
    this.currentLocation = loc;

    const sel = document.getElementById("global-location-select");
    if (sel) sel.value = locId;

    if (autoFetchLive && this.isLiveSyncActive) {
      await this.syncLivePublicTelemetry(true);
    } else {
      this.updateRiskCalculations();
      this.renderDashboard();
      this.renderRedZonesTable();
    }

    if (this.mapCtrlDashboard) this.mapCtrlDashboard.flyToLocation(loc);
    if (this.mapCtrlFull) this.mapCtrlFull.flyToLocation(loc);

    this.chartsCtrl.renderForecastChart("chart-forecast-main", loc, this.liveForecastData);
    this.chartsCtrl.renderForecastChart("chart-flood-detail", loc, this.liveForecastData);
    this.chartsCtrl.renderRiskRadar("chart-risk-radar", this.currentRisks);
  }

  async syncLivePublicTelemetry(showToast = false) {
    const loc = this.currentLocation;
    const [lat, lon] = loc.coordinates;
    const btnSync = document.getElementById("btn-sync-live-data");
    if (btnSync) btnSync.classList.add("syncing");

    try {
      // 1. Fetch Live NWP & Satellite Soundings from Open-Meteo
      const liveData = await this.liveDataService.fetchLiveWeather(lat, lon);

      if (liveData && liveData.isLive) {
        // Apply live parameters to current location
        loc.current.temperature_c = parseFloat(liveData.temperature_c.toFixed(1));
        loc.current.humidity_pct = Math.round(liveData.humidity_pct);
        loc.current.rainfall_mmh = parseFloat(liveData.rainfall_mmh.toFixed(1));
        loc.current.wind_speed_kmh = parseFloat(liveData.wind_speed_kmh.toFixed(1));
        loc.current.pressure_hpa = parseFloat(liveData.pressure_hpa.toFixed(1));
        if (liveData.cape_index) loc.current.cape_index = liveData.cape_index;

        this.liveForecastData = liveData.forecast_6h;

        // 2. Fetch Real-Time Global Seismic Tremors from USGS
        const quakes = await this.liveDataService.fetchSeismicActivity(lat, lon);
        if (quakes.length > 0) {
          console.log(`[AEGIS USGS Feed] ${quakes.length} seismic events detected near ${loc.name}`);
        }

        // Update badge text
        const badgeText = document.getElementById("label-demo-mode");
        if (badgeText) badgeText.textContent = `LIVE: ${liveData.source.split(" ")[0].toUpperCase()}`;

        if (showToast) {
          this.showLiveToast(`🌐 Live Public Telemetry Synchronized for ${loc.name}!\n• Temp: ${liveData.temperature_c}°C | Rain: ${liveData.rainfall_mmh}mm/h | Wind: ${liveData.wind_speed_kmh}km/h | CAPE: ${liveData.cape_index} J/kg`);
        }
      }
    } catch (err) {
      console.warn("Live telemetry ingestion caught:", err);
    } finally {
      if (btnSync) btnSync.classList.remove("syncing");
      this.updateRiskCalculations();
      this.renderDashboard();
      this.renderRedZonesTable();
      this.chartsCtrl.renderForecastChart("chart-forecast-main", loc, this.liveForecastData);
      this.chartsCtrl.renderForecastChart("chart-flood-detail", loc, this.liveForecastData);
      this.chartsCtrl.renderRiskRadar("chart-risk-radar", this.currentRisks);
    }
  }

  showLiveToast(message) {
    // Remove existing toast
    const existing = document.querySelector(".live-badge-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "live-badge-toast";
    toast.innerHTML = `<span>📡</span> <div>${message.replace(/\n/g, '<br/>')}</div>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  setScenario(scenarioKey) {
    this.currentScenario = scenarioKey;
    this.updateRiskCalculations();
    this.renderDashboard();

    this.chartsCtrl.renderForecastChart("chart-forecast-main", this.currentLocation, this.liveForecastData);
    this.chartsCtrl.renderRiskRadar("chart-risk-radar", this.currentRisks);
  }

  switchView(viewId) {
    this.activeView = viewId;

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-view") === viewId);
    });

    document.querySelectorAll(".app-view").forEach(v => {
      v.classList.remove("active");
    });

    const target = document.getElementById(viewId);
    if (target) target.classList.add("active");

    // Re-render components needing resize or refresh
    if (viewId === "view-map" && this.mapCtrlFull?.map) {
      setTimeout(() => this.mapCtrlFull.map.invalidateSize(), 150);
    }
    if (viewId === "view-forecast") {
      this.chartsCtrl.renderForecastChart("chart-forecast-main", this.currentLocation, this.liveForecastData);
    }
    if (viewId === "view-analytics") {
      this.chartsCtrl.renderAnalyticsTrends("chart-analytics-main", "24h");
      this.chartsCtrl.renderRiskRadar("chart-risk-radar", this.currentRisks);
    }
  }

  runEmergencyScenario() {
    const bar = document.getElementById("scenario-tracker-bar");
    const fill = document.getElementById("tracker-progress-fill");
    const elPhase = document.getElementById("tracker-phase-text");
    const elTimer = document.getElementById("tracker-timer");

    if (!bar) return;
    bar.classList.remove("hidden");

    if (this.scenarioInterval) clearInterval(this.scenarioInterval);
    this.scenarioTimeSec = 0;

    const phases = [
      { t: 0, text: "Phase 1: Heavy Rainfall Onset (45 mm/h detected across catchment)", scenario: "heavy_rain", pct: 15 },
      { t: 15, text: "Phase 2: Drainage Bottle-Neck & Hydrological Surge (Water Level Rising)", scenario: "heavy_rain", pct: 35 },
      { t: 30, text: "Phase 3: Flash Flood Threshold Breached (Level reaches 4.8m vs 5.2m Danger Mark)", scenario: "flash_flood", pct: 60 },
      { t: 50, text: "Phase 4: Convective Lightning Storm & Compound Multi-Hazard Spikes", scenario: "multi_hazard", pct: 80 },
      { t: 70, text: "Phase 5: Emergency Evacuation Alert Dispatched to Mobile Devices & Red Zones", scenario: "multi_hazard", pct: 95 },
      { t: 90, text: "Phase 6: Simulation Complete — AEGIS AI Synthesizes Post-Disaster Report", scenario: "flash_flood", pct: 100 }
    ];

    this.scenarioInterval = setInterval(() => {
      this.scenarioTimeSec += 1;

      const mins = String(Math.floor(this.scenarioTimeSec / 60)).padStart(2, '0');
      const secs = String(this.scenarioTimeSec % 60).padStart(2, '0');
      if (elTimer) elTimer.textContent = `T+${mins}:${secs}`;

      const activePhase = phases.slice().reverse().find(p => this.scenarioTimeSec >= p.t);
      if (activePhase) {
        if (elPhase) elPhase.textContent = activePhase.text;
        if (fill) fill.style.width = `${Math.min(100, (this.scenarioTimeSec / 90) * 100)}%`;

        if (this.currentScenario !== activePhase.scenario) {
          this.setScenario(activePhase.scenario);
        }
      }

      if (this.scenarioTimeSec >= 90) {
        clearInterval(this.scenarioInterval);
        setTimeout(() => {
          this.aiAssistant.chatHistory.push({
            sender: "aegis",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `📢 **EMERGENCY DRILL SYNTHESIS REPORT:**\n\n90-Second Multi-Hazard Crisis Scenario completed successfully.\n• **Peak Rain Influx:** 88.0 mm/h\n• **River Stage:** 5.6m (Embankment Overtopping)\n• **Habitations Cleared:** 24 Red-Zone clusters directed to Garmur Highland Complex (+38m MSL).\n• **Autonomous Sirens & Mobile Push:** 100% Dispatched.`
          });
          this.renderAiChat();
        }, 500);
      }
    }, 1000);
  }

  stopEmergencyScenario() {
    if (this.scenarioInterval) clearInterval(this.scenarioInterval);
    const bar = document.getElementById("scenario-tracker-bar");
    if (bar) bar.classList.add("hidden");
    this.setScenario("flash_flood");
  }

  setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const viewId = btn.getAttribute("data-view");
        this.switchView(viewId);
      });
    });

    // Multilingual Language Dropdown & Quick Language Pills
    const selLang = document.getElementById("global-language-select") || document.getElementById("lang-select");
    if (selLang) {
      selLang.addEventListener("change", (e) => {
        this.applyLanguage(e.target.value, true);
      });
    }

    document.querySelectorAll(".lang-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang") || "en";
        this.applyLanguage(lang, true);
      });
    });

    // Voice Readout Button
    const btnVoice = document.getElementById("btn-voice-readout");
    if (btnVoice) {
      btnVoice.addEventListener("click", () => {
        this.playVoiceAlert();
      });
    }

    // Live Public Data Sync Button
    const btnSyncLive = document.getElementById("btn-sync-live-data");
    if (btnSyncLive) {
      btnSyncLive.addEventListener("click", () => {
        this.syncLivePublicTelemetry(true);
      });
    }

    // Location Dropdown
    const selLoc = document.getElementById("global-location-select");
    if (selLoc) {
      selLoc.addEventListener("change", (e) => {
        this.selectLocation(e.target.value);
      });
    }

    // Scenario Dropdown
    const selScen = document.getElementById("demo-scenario-select");
    if (selScen) {
      selScen.addEventListener("change", (e) => {
        this.setScenario(e.target.value);
      });
    }

    // Run Scenario Button
    const btnRun = document.getElementById("btn-run-scenario");
    if (btnRun) {
      btnRun.addEventListener("click", () => this.runEmergencyScenario());
    }

    // Stop Scenario Button
    const btnStop = document.getElementById("btn-stop-scenario");
    if (btnStop) {
      btnStop.addEventListener("click", () => this.stopEmergencyScenario());
    }

    // Hazard Card Buttons -> Navigate to Hazard Sub-tabs
    document.querySelectorAll(".btn-hazard-details").forEach(btn => {
      btn.addEventListener("click", () => {
        const haz = btn.getAttribute("data-hazard") || "flood";
        this.switchView("view-hazards");
        const subBtn = document.querySelector(`.hazard-subnav-btn[data-sub="sub-${haz}"]`);
        if (subBtn) subBtn.click();
      });
    });

    // Hazard Sub-navigation
    document.querySelectorAll(".hazard-subnav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".hazard-subnav-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".hazard-subview").forEach(v => v.classList.remove("active"));
        btn.classList.add("active");
        const target = document.getElementById(btn.getAttribute("data-sub"));
        if (target) target.classList.add("active");
      });
    });

    // Analytics Time Range Buttons
    document.querySelectorAll(".time-range-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".time-range-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const range = btn.getAttribute("data-range") || "24h";
        this.chartsCtrl.renderAnalyticsTrends("chart-analytics-main", range);
      });
    });

    // Map Layer Toggles (Dashboard)
    const layerKeys = ["rain", "flood", "landslide", "lightning", "heat", "pollution", "redzones", "stations"];
    layerKeys.forEach(k => {
      const chkDash = document.getElementById(`chk-layer-${k}`);
      if (chkDash) {
        chkDash.addEventListener("change", (e) => {
          const mapKey = k === "rain" ? "rainfall" : k === "redzones" ? "vulnerability" : k === "heat" ? "heatwave" : k;
          if (this.mapCtrlDashboard) this.mapCtrlDashboard.toggleLayer(mapKey, e.target.checked);
        });
      }
      const chkFull = document.getElementById(`chk-fullmap-${k}`);
      if (chkFull) {
        chkFull.addEventListener("change", (e) => {
          const mapKey = k === "rain" ? "rainfall" : k === "redzones" ? "vulnerability" : k === "heat" ? "heatwave" : k;
          if (this.mapCtrlFull) this.mapCtrlFull.toggleLayer(mapKey, e.target.checked);
        });
      }
    });

    // AI Assistant Prompts & Send
    document.querySelectorAll(".ai-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-prompt");
        this.sendAiMessage(q);
      });
    });

    const btnSendAi = document.getElementById("btn-send-ai");
    const inputAi = document.getElementById("ai-user-input");
    if (btnSendAi && inputAi) {
      btnSendAi.addEventListener("click", () => {
        const text = inputAi.value.trim();
        if (text) {
          this.sendAiMessage(text);
          inputAi.value = "";
        }
      });
      inputAi.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const text = inputAi.value.trim();
          if (text) {
            this.sendAiMessage(text);
            inputAi.value = "";
          }
        }
      });
    }
  }

  sendAiMessage(query) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.aiAssistant.chatHistory.push({
      sender: "user",
      time: timeStr,
      text: query
    });
    this.renderAiChat();

    // AI Response with slight micro-delay for realistic typing feel
    setTimeout(() => {
      const response = this.aiAssistant.processQuery(query);
      this.aiAssistant.chatHistory.push({
        sender: "aegis",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response
      });
      this.renderAiChat();
    }, 350);
  }
}

// Instantiate on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  const app = new AegisApp();
  app.init();
});
