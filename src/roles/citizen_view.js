/**
 * AegisAlert Citizen Survival Hub (Zero-Install Offline PWA)
 * 1-Tap Distress Beacon, Vernacular AI Voice SOS, and Precision Geofenced Red Zone Alerting
 * Only citizens within the active hazard polygon are alerted with high-decibel alarms and forced strobes.
 */

export class CitizenView {
  constructor(containerId, onSosTriggered) {
    this.container = document.getElementById(containerId);
    this.onSosTriggered = onSosTriggered;
    this.isRecordingVoice = false;
    this.recognition = null;
    this.audioCtx = null;
    this.isInsideRedZone = true; // Default simulated inside for demo
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  render(langData, currentScenario) {
    if (!this.container) return;

    const hazardRadiusKm = 16.0;
    const simulatedDistKm = this.isInsideRedZone ? 4.6 : 28.4;
    const isInZone = simulatedDistKm <= hazardRadiusKm;

    this.container.innerHTML = `
      <div class="citizen-card-shell">
        
        <!-- Precision Geofence Red Zone Status Card -->
        <div class="geofence-alert-box ${isInZone ? 'geofence-breached-red' : 'geofence-safe-green'}">
          <div class="geofence-header">
            <span class="geofence-icon">${isInZone ? '🚨' : '🛡️'}</span>
            <div>
              <strong class="geofence-title">
                ${isInZone ? 'CRITICAL GEOFENCE OVERRIDE: YOU ARE INSIDE THE RED ZONE!' : 'SAFE BUFFER ZONE: OUTSIDE ACTIVE HAZARD POLYGON'}
              </strong>
              <div class="geofence-desc">
                ${isInZone 
                  ? `Government Directive: Immediate evacuation mandatory. You are ${simulatedDistKm} km from ${currentScenario.title.split('(')[0].trim()} epicenter.` 
                  : `You are safely ${simulatedDistKm} km away from active impact. Normal activities permitted; maintain vigilance.`}
              </div>
            </div>
            <button id="btn-toggle-geofence" class="btn-toggle-geofence" title="Switch simulated location to demonstrate targeted alerting">
              ${isInZone ? 'Simulate Outside Zone' : 'Simulate Inside Red Zone'}
            </button>
          </div>

          ${isInZone ? `
            <div class="geofence-escape-guidance">
              <span>🏃 <strong>Immediate Escape Vector:</strong> Move 035° North-East away from riverbed/slope.</span>
              <span class="distance-to-safety">Safe Green Boundary: <strong>1.4 km</strong></span>
            </div>
          ` : ''}
        </div>

        <!-- Offline Status Bar -->
        <div class="offline-badge-bar">
          <span>📡 ${langData.offlineNotice}</span>
          <span style="color:#10b981;">● GPS: ${currentScenario.coordinates[0].toFixed(4)}°N, ${currentScenario.coordinates[1].toFixed(4)}°E (High Precision)</span>
        </div>

        <!-- Big Red 1-Tap SOS Distress Button -->
        <div class="sos-action-center">
          <button id="btn-citizen-sos" class="btn-mega-sos ${isInZone ? 'sos-pulsing-urgent' : ''}" title="Broadcast emergency GPS coordinates to NDRF and sound local alarm">
            <span class="sos-icon">🆘</span>
            <span class="sos-label">${langData.sosButton}</span>
            <span class="sos-sublabel">TRANSMITS GPS • SENSORY STROBE • LOCAL SIREN WAIL</span>
          </button>
        </div>

        <!-- Multilingual Voice SOS Input (For illiterate / injured victims) -->
        <div class="voice-sos-container">
          <div class="voice-header">
            <span>🎙️ VERNACULAR AI VOICE SOS (8 LANGUAGES)</span>
            <span style="font-size:0.75rem; color:#94a3b8;">Hindi • Assamese • Bengali • Marathi • Telugu • Tamil • Gujarati</span>
          </div>
          <div class="voice-input-row">
            <button id="btn-voice-mic" class="btn-mic-toggle">
              <span id="mic-icon">🎤</span>
              <span id="mic-label">Hold to Speak</span>
            </button>
            <input type="text" id="voice-transcript-input" class="voice-transcript-box" 
              placeholder="${langData.voiceSosPrompt}" />
            <button id="btn-submit-voice-sos" class="btn-voice-submit">SEND</button>
          </div>
          <div id="voice-triage-preview" class="voice-triage-card" style="display:none;"></div>
        </div>

        <!-- Safe Evacuation Navigation & Shelter Radar -->
        <div class="shelter-radar-box">
          <div class="shelter-radar-header">
            <h4>🧭 ${langData.safeRoute} & Relief Center</h4>
            <span class="elevation-badge">+38m Elevation (Safe Ground)</span>
          </div>
          <div class="shelter-details-grid">
            <div class="shelter-info">
              <div class="shelter-name">${currentScenario.preJudgement.safeShelter}</div>
              <div class="shelter-meta">Distance: <strong>1.2 km</strong> • Safe Walking Time: <strong>15 mins</strong></div>
              <div class="safe-path-tag">✅ Designated Safe Highland Route • Avoids Red Hazard Polygon</div>
            </div>
            <div class="compass-bearing">
              <div class="bearing-arrow">↗️</div>
              <span class="bearing-text">BEARING: 035° N-NE</span>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents(langData, currentScenario);
  }

  bindEvents(langData, currentScenario) {
    // 1. Geofence toggle simulation button
    const btnToggleGeo = document.getElementById("btn-toggle-geofence");
    if (btnToggleGeo) {
      btnToggleGeo.addEventListener("click", () => {
        this.isInsideRedZone = !this.isInsideRedZone;
        this.render(langData, currentScenario);
        if (this.isInsideRedZone) {
          this.flashScreenEmergency();
          this.startDeviceSiren();
        }
      });
    }

    // 2. 1-Tap SOS button
    const btnSos = document.getElementById("btn-citizen-sos");
    if (btnSos) {
      btnSos.addEventListener("click", () => {
        btnSos.classList.add("sos-activated");
        btnSos.querySelector(".sos-label").textContent = langData.sosTriggered;
        
        this.flashScreenEmergency();
        this.startDeviceSiren();

        if (this.onSosTriggered) {
          this.onSosTriggered({
            id: `SOS-CITIZEN-${Math.floor(1000 + Math.random() * 9000)}`,
            name: `Citizen Distress Alert (${currentScenario.title.split("&")[0].trim()})`,
            location: `${currentScenario.coordinates[0].toFixed(4)}°N, ${currentScenario.coordinates[1].toFixed(4)}°E (Inside Red Zone)`,
            coordinates: currentScenario.coordinates,
            triageScore: 98,
            priority: "CRITICAL",
            peopleTrapped: 4,
            category: "GEOFENCED RED ZONE EVACUATION",
            forcesRequired: "NDRF Zodiac + IAF Chopper",
            time: "Just now",
            status: "DISPATCHED"
          });
        }
      });
    }

    // 3. Voice mic and transcription
    const btnMic = document.getElementById("btn-voice-mic");
    const inputTranscript = document.getElementById("voice-transcript-input");
    const btnSubmit = document.getElementById("btn-submit-voice-sos");

    if (btnMic && this.recognition) {
      btnMic.addEventListener("click", () => {
        if (!this.isRecordingVoice) {
          this.isRecordingVoice = true;
          btnMic.classList.add("recording");
          btnMic.querySelector("#mic-label").textContent = "Listening...";
          try {
            this.recognition.start();
          } catch (e) {}

          this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (inputTranscript) inputTranscript.value = transcript;
            this.parseVoiceSOS(transcript, currentScenario);
          };

          this.recognition.onend = () => {
            this.isRecordingVoice = false;
            btnMic.classList.remove("recording");
            btnMic.querySelector("#mic-label").textContent = "Hold to Speak";
          };
        } else {
          this.recognition.stop();
        }
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", () => {
        const text = inputTranscript ? inputTranscript.value : "";
        if (text.trim()) {
          this.parseVoiceSOS(text, currentScenario);
        }
      });
    }
  }

  parseVoiceSOS(transcript, currentScenario) {
    const triageCard = document.getElementById("voice-triage-preview");
    if (!triageCard) return;

    let score = 70;
    let category = "Red Zone Distress";
    const lower = transcript.toLowerCase();

    if (
      lower.includes("child") || lower.includes("baby") || lower.includes("infant") ||
      lower.includes("बच्चा") || lower.includes("शिशु") ||
      lower.includes("ল'ৰা") || lower.includes("শিশু") ||
      lower.includes("বাচ্চা") ||
      lower.includes("बाळ") || lower.includes("मुलगा") ||
      lower.includes("పిల్లలు") ||
      lower.includes("குழந்தை") ||
      lower.includes("બાળક")
    ) {
      score += 15;
      category = "Infants & Children in Danger";
    }

    if (
      lower.includes("elderly") || lower.includes("pregnant") || lower.includes("injured") || lower.includes("blood") ||
      lower.includes("बुजुर्ग") || lower.includes("गर्भवती") || lower.includes("घायल") ||
      lower.includes("বৃদ্ধ") || lower.includes("আহত") ||
      lower.includes("বয়স্ক") || lower.includes("গর্ভবতী") ||
      lower.includes("म्हातारे") || lower.includes("जखमी") ||
      lower.includes("ముసలి") || lower.includes("గాయపడ్డారు") ||
      lower.includes("முதியவர்") || lower.includes("காயமடைந்த") ||
      lower.includes("વૃદ્ધ") || lower.includes("ઈજાગ્રસ્ત")
    ) {
      score += 15;
      category = "High-Priority Medical Trauma";
    }

    if (
      lower.includes("roof") || lower.includes("trapped") || lower.includes("drowning") || lower.includes("water inside") ||
      lower.includes("छत") || lower.includes("फंसे") || lower.includes("पानी भर गया") ||
      lower.includes("ছাদ") || lower.includes("আৱদ্ধ") || lower.includes("পানী সোমাইছে") ||
      lower.includes("ছাদে") || lower.includes("আটকে আছি") ||
      lower.includes("अडकलो") || lower.includes("पाणी शिरले") ||
      lower.includes("ఇరుక్కుపోయాం") || lower.includes("పైకప్పు") ||
      lower.includes("மாட்டிவிட்டோம்") || lower.includes("கூரை") ||
      lower.includes("ફસાયેલા")
    ) {
      score += 10;
      category = "Rooftop / Mudflow Entrapment";
    }

    score = Math.min(score, 100);

    triageCard.style.display = "block";
    triageCard.innerHTML = `
      <div style="font-size:0.8rem; font-weight:700; color:#38bdf8;">🧠 VERNACULAR AI TRIAGE RESULT:</div>
      <div style="font-size:0.82rem; margin:4px 0; color:#f8fafc;">"${transcript}"</div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; margin-top:6px;">
        <span>Classification: <strong style="color:#ef4444;">${category}</strong></span>
        <span>Priority Triage Score: <strong style="color:#ef4444;">${score}/100 [CRITICAL]</strong></span>
      </div>
    `;

    if (this.onSosTriggered) {
      this.onSosTriggered({
        id: `VOICE-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Vernacular Voice Distress Signal",
        location: `${currentScenario.coordinates[0].toFixed(4)}°N, ${currentScenario.coordinates[1].toFixed(4)}°E (Red Zone)`,
        coordinates: currentScenario.coordinates,
        triageScore: score,
        priority: score >= 90 ? "CRITICAL" : "HIGH",
        peopleTrapped: 3,
        category: category,
        transcript: transcript,
        forcesRequired: score >= 90 ? "IAF Helicopter Airlift" : "NDRF Zodiac Boat",
        time: "Just now",
        status: "DISPATCHED"
      });
    }
  }

  startDeviceSiren() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(650, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      let high = false;
      const interval = setInterval(() => {
        if (osc) {
          osc.frequency.setValueAtTime(high ? 950 : 650, this.audioCtx.currentTime);
          high = !high;
        }
      }, 350);

      osc.start();

      setTimeout(() => {
        clearInterval(interval);
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      }, 4000);
    } catch (err) {
      console.warn("Device Web Audio siren error:", err);
    }
  }

  flashScreenEmergency() {
    const flashEl = document.createElement("div");
    flashEl.className = "full-screen-emergency-strobe";
    document.body.appendChild(flashEl);
    setTimeout(() => {
      flashEl.remove();
    }, 3000);
  }
}
