/**
 * AegisBeacon: Autonomous Physical Hardware Node State Machine
 * 
 * Simulates the physical solar-powered pole deployed at village chowks.
 * Operates with 0% internet and 0% cellular signal.
 */

import { RadioProtocol } from "../transmission/radio_protocol.js";
import { AudioSynthesizer } from "./audio_synthesizer.js";

export class BeaconNode {
  constructor(nodeId = "BEACON-KL-01", locationName = "Meppadi Riverfront Pole") {
    this.nodeId = nodeId;
    this.locationName = locationName;

    // Power & Grid State
    this.gridPowerConnected = false; // Grid is dead during disasters
    this.solarGeneratingWatts = 42.5;
    this.batteryPercentage = 96.0;
    this.cellularAvailable = false; // Zero internet / zero cellular
    this.loraSignalDbm = -78; // Strong LoRa Sub-GHz link
    this.navicSatLocked = true; // 5 NavIC satellites locked

    // Actuator States
    this.state = "STANDBY"; // 'STANDBY', 'ALERT_ACTIVE', 'MUTED'
    this.activeAlert = null;
    this.strobeActive = false;
    this.sirenActive = false;
    this.currentTickerMessage = "SYSTEM NORMAL • AEGIS SUB-GHZ LISTENING • SOLAR BATTERY OPTIMAL";

    // Audio & PA System
    this.audio = new AudioSynthesizer();

    // Event listeners
    this.listeners = [];

    // Periodic battery telemetry loop
    this.startTelemetryLoop();
  }

  startTelemetryLoop() {
    setInterval(() => {
      // Simulate slow solar float charging / discharge
      if (this.sirenActive) {
        this.batteryPercentage = Math.max(10, this.batteryPercentage - 0.05); // High power siren draw
      } else {
        this.batteryPercentage = Math.min(100, this.batteryPercentage + 0.01);
      }
      this.notify();
    }, 3000);
  }

  /**
   * Receives a raw 32-byte radio packet broadcasted over airwaves
   * @param {Uint8Array} packetBuffer 
   */
  receiveRadioPacket(packetBuffer) {
    const decoded = RadioProtocol.decodePacket(packetBuffer);

    if (!decoded.valid) {
      console.error(`[${this.nodeId}] Packet rejected:`, decoded.error);
      return { success: false, reason: decoded.error };
    }

    console.log(`[${this.nodeId}] Valid 32-Byte Radio Packet Received:`, decoded);
    this.triggerAlert(decoded);
    return { success: true, payload: decoded };
  }

  /**
   * Triggers the 4-phase physical alert response
   */
  triggerAlert(alertData) {
    this.activeAlert = alertData;
    this.state = "ALERT_ACTIVE";
    this.strobeActive = true;
    this.sirenActive = alertData.alertLevel === "RED" || alertData.alertLevel === "ORANGE";

    // 1. Update High-Contrast Alphanumeric LED Ticker
    this.currentTickerMessage = `🚨 ${alertData.alertLevel} ALERT: ${alertData.disasterType} • EVACUATE TO SHELTER ${alertData.shelterCode} • AVOID LOW BRIDGES`;

    // 2. Fire 120dB Acoustic Siren
    if (this.sirenActive) {
      this.audio.startSiren();
    }

    // 3. Queue Multilingual Voice PA Broadcast after initial siren blast
    setTimeout(() => {
      let voiceHindi = "सावधान! नदी में भयंकर बाढ़ की चेतावनी है। तुरंत ऊंचे स्थान पर जाएं!";
      let voiceEnglish = "Attention! Emergency flash flood warning. Move to designated high ground immediately!";

      if (alertData.disasterType === "CYCLONE") {
        voiceHindi = "सावधान! चक्रवात का खतरा। तुरंत पक्के राहत शिविर में शरण लें!";
        voiceEnglish = "Warning! Severe cyclone landfall. Take shelter in cyclone relief centers now!";
      } else if (alertData.disasterType === "EARTHQUAKE") {
        voiceHindi = "भूकंप अलर्ट! खुले मैदान में निकलें, इमारतों से दूर रहें!";
        voiceEnglish = "Earthquake alert! Move to open ground away from structures!";
      }

      // Play Hindi first, then English
      this.audio.speakVoiceAlert(voiceHindi, "hi-IN");
      setTimeout(() => {
        this.audio.speakVoiceAlert(voiceEnglish, "en-IN");
      }, 5000);
    }, 2800);

    this.notify();
  }

  /**
   * Clears or silences the alert
   */
  silenceAlert() {
    this.state = "STANDBY";
    this.sirenActive = false;
    this.strobeActive = false;
    this.audio.stopSiren();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    this.currentTickerMessage = "ALERT CLEARED • RESCUE TEAMS ACTIVE • MAINTAIN SAFE DISTANCE FROM HAZARDS";
    this.notify();
  }

  /**
   * Toggle Blackout Simulation (Cuts power grid)
   */
  toggleGridPower() {
    this.gridPowerConnected = !this.gridPowerConnected;
    this.notify();
    return this.gridPowerConnected;
  }

  /**
   * Toggle Cellular Tower Simulation
   */
  toggleCellular() {
    this.cellularAvailable = !this.cellularAvailable;
    this.notify();
    return this.cellularAvailable;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getStateSummary()));
  }

  getStateSummary() {
    return {
      nodeId: this.nodeId,
      locationName: this.locationName,
      state: this.state,
      gridPowerConnected: this.gridPowerConnected,
      cellularAvailable: this.cellularAvailable,
      solarGeneratingWatts: this.solarGeneratingWatts,
      batteryPercentage: Math.round(this.batteryPercentage),
      loraSignalDbm: this.loraSignalDbm,
      navicSatLocked: this.navicSatLocked,
      strobeActive: this.strobeActive,
      sirenActive: this.sirenActive,
      activeAlert: this.activeAlert,
      tickerMessage: this.currentTickerMessage,
      isMuted: this.audio.isMuted
    };
  }
}
