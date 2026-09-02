/**
 * AegisAlert Citizen Survival Hub (Zero-Install Offline PWA)
 * 1-Tap Distress Beacon, Vernacular Voice SOS, and Safe Evacuation Routing
 */

export class CitizenView {
  constructor(containerId, onSosTriggered) {
    this.container = document.getElementById(containerId);
    this.onSosTriggered = onSosTriggered;
    this.isRecordingVoice = false;
    this.recognition = null;
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

    this.container.innerHTML = `
      <div class="citizen-card-shell">
        
        <!-- Offline Warning Bar -->
        <div class="offline-badge-bar">
          <span>📡 ${langData.offlineNotice}</span>
          <span style="color:#10b981;">● GPS: 11.6854°N, 76.1320°E (Accuracy: 4m)</span>
        </div>

        <!-- Big Red 1-Tap SOS Distress Button -->
        <div class="sos-action-center">
          <button id="btn-citizen-sos" class="btn-mega-sos" title="Broadcast emergency GPS coordinates to NDRF and local village sirens">
            <span class="sos-icon">🆘</span>
            <span class="sos-label">${langData.sosButton}</span>
            <span class="sos-sublabel">TRANSMITS GPS • BATTERY STATUS • MEDICAL TRIAGE</span>
          </button>
        </div>

        <!-- Multilingual Voice SOS Input (For illiterate / injured victims) -->
        <div class="voice-sos-container">
          <div class="voice-header">
            <span>🎙️ VERNACULAR VOICE SOS</span>
            <span style="font-size:0.75rem; color:#94a3b8;">Speak in Hindi, Telugu, Tamil, Bengali or English</span>
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
            <span class="elevation-badge">+42m Elevation (Safe Ground)</span>
          </div>
          <div class="shelter-details-grid">
            <div class="shelter-info">
              <div class="shelter-name">${currentScenario.preJudgement.safeShelter}</div>
              <div class="shelter-meta">Distance: <strong>1.4 km</strong> • Safe Walking Time: <strong>18 mins</strong></div>
              <div class="safe-path-tag">✅ Avoids Chooralmala Bridge (Flooded) • Use Ridge Road</div>
            </div>
            <div class="compass-bearing">
              <div class="bearing-arrow">↗️</div>
              <span class="bearing-text">BEARING: 045° NE</span>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents(langData);
  }

  bindEvents(langData) {
    const btnSos = document.getElementById("btn-citizen-sos");
    if (btnSos) {
      btnSos.addEventListener("click", () => {
        btnSos.classList.add("sos-activated");
        btnSos.querySelector(".sos-label").textContent = langData.sosTriggered;
        
        // Trigger Full Screen Emergency Strobe for visibility
        this.flashScreenEmergency();

        if (this.onSosTriggered) {
          this.onSosTriggered({
            id: `SOS-CITIZEN-${Math.floor(1000 + Math.random() * 9000)}`,
            name: "Citizen Alert (Meppadi Cluster)",
            location: "Chooralmala Riverbank, Kerala",
            coordinates: [11.5420, 76.1680],
            triageScore: 94,
            priority: "CRITICAL",
            peopleTrapped: 4,
            category: "RISING WATER / ROOFTOP",
            time: "Just now",
            status: "DISPATCHED"
          });
        }
      });
    }

    const btnMic = document.getElementById("btn-voice-mic");
    const inputTranscript = document.getElementById("voice-transcript-input");
    const btnSubmit = document.getElementById("btn-submit-voice-sos");
    const triageCard = document.getElementById("voice-triage-preview");

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
            this.parseVoiceSOS(transcript);
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
          this.parseVoiceSOS(text);
        }
      });
    }
  }

  parseVoiceSOS(transcript) {
    const triageCard = document.getElementById("voice-triage-preview");
    if (!triageCard) return;

    // AI Keyword extraction for triage severity
    let score = 70;
    let category = "Flood Assistance";
    const lower = transcript.toLowerCase();

    if (lower.includes("child") || lower.includes("बच्चा") || lower.includes("pillalu") || lower.includes("baby")) {
      score += 15;
      category = "Infants at Risk";
    }
    if (lower.includes("elderly") || lower.includes("बुजुर्ग") || lower.includes("pregnant") || lower.includes("injured")) {
      score += 15;
      category = "Medical Emergency";
    }
    if (lower.includes("roof") || lower.includes("छत") || lower.includes("trapped") || lower.includes("फंसे")) {
      score += 10;
      category = "Rooftop Evacuation Required";
    }

    triageCard.style.display = "block";
    triageCard.innerHTML = `
      <div style="font-size:0.8rem; font-weight:700; color:#38bdf8;">🧠 AI VOICE TRIAGE RESULT:</div>
      <div style="font-size:0.82rem; margin:4px 0;">"${transcript}"</div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; margin-top:6px;">
        <span>Classification: <strong style="color:#ef4444;">${category}</strong></span>
        <span>Priority Score: <strong style="color:#ef4444;">${score}/100 [CRITICAL]</strong></span>
      </div>
    `;

    if (this.onSosTriggered) {
      this.onSosTriggered({
        id: `VOICE-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Voice SOS Report",
        location: "GPS: 11.6854°N, 76.1320°E",
        coordinates: [11.6854, 76.1320],
        triageScore: score,
        priority: "CRITICAL",
        peopleTrapped: 3,
        category: category,
        transcript: transcript,
        time: "Just now",
        status: "DISPATCHED"
      });
    }
  }

  flashScreenEmergency() {
    const flashEl = document.createElement("div");
    flashEl.className = "full-screen-emergency-strobe";
    document.body.appendChild(flashEl);
    setTimeout(() => {
      flashEl.remove();
    }, 2500);
  }
}
