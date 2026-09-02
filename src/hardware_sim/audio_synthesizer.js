/**
 * AegisAlert Web Audio Emergency Siren & Vernacular Voice PA Synthesizer
 * 
 * Generates the authentic 120dB civil defense evacuation siren using Web Audio API
 * oscillators and plays vernacular voice warnings via Web Speech API.
 */

export class AudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isSirenPlaying = false;
    this.isMuted = false;
    this.sirenInterval = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  /**
   * Starts the authentic civil defense emergency siren (450Hz <-> 850Hz sweep)
   */
  startSiren() {
    if (this.isSirenPlaying || this.isMuted) return;
    this.initAudio();

    this.isSirenPlaying = true;
    const now = this.audioCtx.currentTime;

    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    // Sawtooth wave gives that piercing, high-harmonic tactical acoustic siren sound
    this.oscillator.type = "sawtooth";
    this.oscillator.frequency.setValueAtTime(450, now);

    // Initial soft ramp to prevent speaker click
    this.gainNode.gain.setValueAtTime(0.01, now);
    this.gainNode.gain.linearRampToValueAtTime(0.25, now + 0.3); // Safe listening volume for browser demo

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    this.oscillator.start();

    // Modulate pitch up and down every 2.4 seconds like a real municipal warning siren
    let pitchHigh = false;
    this.sirenInterval = setInterval(() => {
      if (!this.isSirenPlaying || !this.audioCtx) return;
      const t = this.audioCtx.currentTime;
      pitchHigh = !pitchHigh;
      const targetFreq = pitchHigh ? 880 : 440;
      this.oscillator.frequency.exponentialRampToValueAtTime(targetFreq, t + 1.2);
    }, 1200);
  }

  /**
   * Stops the siren wail
   */
  stopSiren() {
    if (!this.isSirenPlaying) return;
    clearInterval(this.sirenInterval);
    this.sirenInterval = null;

    if (this.gainNode && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.3);
      setTimeout(() => {
        if (this.oscillator) {
          try { this.oscillator.stop(); } catch (e) {}
          this.oscillator.disconnect();
          this.oscillator = null;
        }
        this.isSirenPlaying = false;
      }, 350);
    } else {
      this.isSirenPlaying = false;
    }
  }

  /**
   * Plays a high-frequency two-tone chime before spoken emergency announcement
   */
  playChime() {
    if (this.isMuted) return;
    this.initAudio();

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.setValueAtTime(880, t + 0.2);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.55);
  }

  /**
   * Broadcasts spoken voice instructions in English and Hindi
   * @param {string} text 
   * @param {string} langCode 'hi-IN' or 'en-IN'
   */
  speakVoiceAlert(text, langCode = "en-IN") {
    if (this.isMuted) return;
    if (!("speechSynthesis" in window)) {
      console.warn("Web Speech API not supported in this browser");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    this.playChime();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95; // Clear, deliberate pace for emergency PA
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(langCode.substring(0, 2)));
      if (match) utterance.voice = match;

      window.speechSynthesis.speak(utterance);
    }, 600);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isSirenPlaying) {
      this.stopSiren();
    }
    return this.isMuted;
  }
}
