import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  CheckCircle2,
  TrendingUp,
  Maximize2,
  Minimize2,
  Printer,
  Sparkles,
  AlertTriangle,
  Radio,
  MapPin,
  Cpu,
  Database,
  Lock,
  Users,
  Compass
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Proposed Solution',
    subtitle: 'Next-Gen Decentralized Disaster Response & Life-Safety Ecosystem',
    badge: 'Slide 1 of 4 • Solution Architecture',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    icon: <Shield className="w-8 h-8 text-emerald-400" />
  },
  {
    id: 2,
    title: 'Technical Approach',
    subtitle: 'Edge-Resilient Hybrid Client-Server Architecture & Spatial Algorithms',
    badge: 'Slide 2 of 4 • Tech Stack & Architecture',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    icon: <Layers className="w-8 h-8 text-blue-400" />
  },
  {
    id: 3,
    title: 'Feasibility and Viability',
    subtitle: 'Technical, Operational, Economic & Scalability Assessment',
    badge: 'Slide 3 of 4 • Feasibility Matrix',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    icon: <CheckCircle2 className="w-8 h-8 text-amber-400" />
  },
  {
    id: 4,
    title: 'Impact and Benefits',
    subtitle: 'Measurable Life-Safety Metrics, Stakeholder Value & Response Acceleration',
    badge: 'Slide 4 of 4 • Impact & ROI',
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    icon: <TrendingUp className="w-8 h-8 text-purple-400" />
  }
];

import { ActiveView } from '../types';

interface PresentationPageProps {
  setActiveView?: (view: ActiveView) => void;
}

export const PresentationPage: React.FC<PresentationPageProps> = ({ setActiveView }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => (prev < 4 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 1 ? prev - 1 : prev));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans transition-colors duration-200">
      {/* Top Deck Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-950/40">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40">
                Smart India Hackathon Presentation Deck
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
              AegisAlert <span className="text-slate-500 font-normal">| Project Pitch</span>
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {setActiveView && (
            <button
              type="button"
              onClick={() => setActiveView('home')}
              aria-label="Exit presentation and return to dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print or export slides"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / Export PDF</span>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen presentation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </header>

      {/* Main Slide Card Container */}
      <main className="flex-1 my-6 flex flex-col justify-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Slide Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border mb-3 ${
                  slides[currentSlide - 1].badgeColor
                }`}
              >
                {slides[currentSlide - 1].badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {slides[currentSlide - 1].icon}
                {slides[currentSlide - 1].title}
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-1">
                {slides[currentSlide - 1].subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Slide</span>
              <span className="text-xl font-black text-cyan-400">{currentSlide}</span>
              <span className="text-slate-600 font-bold">/</span>
              <span className="text-slate-400 font-semibold">4</span>
            </div>
          </div>

          {/* Slide Body Content */}
          <div className="min-h-[420px] flex flex-col justify-center">
            {/* SLIDE 1: PROPOSED SOLUTION */}
            {currentSlide === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Problem Box */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3">
                      <AlertTriangle className="w-5 h-5" />
                      Critical Gaps Identified
                    </div>
                    <ul className="space-y-2.5 text-xs md:text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span><strong>Communication Blackouts:</strong> Tower outages isolate victims during peak crisis.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span><strong>Submerged Routes:</strong> Standard GPS directs evacuees into flooded underpasses.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span><strong>Fragmented Truth:</strong> Responders lack verified trapped counts & water level data.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-red-500/20 text-xs text-red-300/80 font-medium">
                    Critical barrier to saving lives during the "Golden Hour".
                  </div>
                </div>

                {/* Solution Core Pillars */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 hover:border-emerald-500/40 transition">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-2">
                      <Compass className="w-5 h-5" />
                      1. Elevation-Aware Evacuation
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Dynamic pathfinding directing citizens to high-ground shelters (&gt;15m safe elevation) while routing around active flood polygons.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 hover:border-red-500/40 transition">
                    <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm mb-2">
                      <Radio className="w-5 h-5" />
                      2. SOS & Safe Beacons
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      1-tap SOS distress signal broadcasting trapped count & water levels, plus ultra-low bandwidth (&lt;1KB) family check-ins.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 hover:border-cyan-500/40 transition">
                    <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm mb-2">
                      <Cpu className="w-5 h-5" />
                      3. Offline AI Triage ("Ask Aegis")
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Deterministic medical first-aid & NDMA survival decision trees functioning 100% offline without requiring internet.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 hover:border-amber-500/40 transition">
                    <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm mb-2">
                      <MapPin className="w-5 h-5" />
                      4. Verified Ground Telemetry
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Crowdsourced hazard reporting with peer verification and moderation to generate real-time live disaster heatmaps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: TECHNICAL APPROACH */}
            {currentSlide === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tech Stack Column */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-3">
                    <Layers className="w-5 h-5" />
                    Stack Architecture
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400 font-semibold block">Frontend (PWA):</span>
                      <span>React 18, TypeScript, Vite, Tailwind CSS, Dual-Theme (Dark Command & Daylight High-Contrast).</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Backend Services:</span>
                      <span>Node.js + Express with TypeScript, REST APIs, Rate Limiting, Helmet Security.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Data & Storage:</span>
                      <span>SQLite Engine with WAL mode, IndexedDB/LocalStorage for offline sync.</span>
                    </div>
                  </div>
                </div>

                {/* Architecture Flow */}
                <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 mb-3">
                    <Cpu className="w-5 h-5" />
                    Technical Methodologies & Pipeline
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-xs font-bold text-emerald-400 block mb-1">Offline-First Engine</span>
                      <p className="text-[11px] text-slate-400">Service Workers cache map tiles, survival guides & triage trees locally.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-xs font-bold text-cyan-400 block mb-1">Routing & GIS Filter</span>
                      <p className="text-[11px] text-slate-400">Multi-factor A* algorithm avoiding flood zones with elevation weighting.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-xs font-bold text-purple-400 block mb-1">Standard Interop</span>
                      <p className="text-[11px] text-slate-400">Common Alerting Protocol (CAP) compliant JSON broadcast schema.</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                    <strong>Performance:</strong> Sub-100ms API response latency with minimal 463 kB gzipped client footprint.
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: FEASIBILITY AND VIABILITY */}
            {currentSlide === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-3">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Technical Feasibility</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      Zero proprietary hardware dependency. Built using standard web technologies that operate reliably on low-cost Android smartphones and commodity edge servers.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    Rating: High Feasibility
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Operational Feasibility</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      Intuitive high-contrast 3-tile emergency interface requiring zero citizen training. Designed specifically for panic-induced, high-stress conditions.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] text-blue-400 font-bold uppercase tracking-wider">
                    Rating: Zero Training Required
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-3">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Economic Viability</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      100% open-source software stack lowers government and municipal disaster software deployment costs by over 70% with zero recurring licensing overhead.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                    Rating: 70%+ Cost Savings
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Security & Privacy</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      End-to-end data encryption over TLS 1.3, encrypted local SQLite caches, and peer validation to prevent false emergency broadcast spam.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] text-purple-400 font-bold uppercase tracking-wider">
                    Rating: Enterprise Secure
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: IMPACT AND BENEFITS */}
            {currentSlide === 4 && (
              <div className="space-y-6">
                {/* Metric Banners */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
                    <span className="text-3xl md:text-4xl font-black text-emerald-400 block mb-1">70%+</span>
                    <span className="text-xs font-semibold text-slate-300">Evacuation Delay Reduction</span>
                    <p className="text-[11px] text-slate-500 mt-1">Via elevation & flood-hazard avoidance routing</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center">
                    <span className="text-3xl md:text-4xl font-black text-cyan-400 block mb-1">85%+</span>
                    <span className="text-xs font-semibold text-slate-300">SOS Dispatch Acceleration</span>
                    <p className="text-[11px] text-slate-500 mt-1">Exact trapped count, water level & GPS telemetry</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-center">
                    <span className="text-3xl md:text-4xl font-black text-purple-400 block mb-1">60%+</span>
                    <span className="text-xs font-semibold text-slate-300">Telecom Load Reduction</span>
                    <p className="text-[11px] text-slate-500 mt-1">Micro-payload (&lt;1KB) Safe Beacon pings</p>
                  </div>
                </div>

                {/* Stakeholder Value Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                      For Citizens
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1.5">
                      <li>• Safe turn-by-turn guidance to high-ground shelters.</li>
                      <li>• 1-tap family reassurance eliminating panic.</li>
                      <li>• Offline life-saving medical triage steps.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                      For First Responders
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1.5">
                      <li>• Prioritized rescue queue sorted by urgency & count.</li>
                      <li>• Live dynamic hazard avoidance map.</li>
                      <li>• Direct GPS coordinates of trapped victims.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                      For Disaster Authorities
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1.5">
                      <li>• Real-time shelter capacity & supply tracking.</li>
                      <li>• Elimination of relief supply dumping & shortages.</li>
                      <li>• Tamper-evident post-disaster audit trails.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Deck Navigation Bar */}
      <footer className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        {/* Slide Selector Buttons */}
        <div className="flex items-center gap-2">
          {slides.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(s.id)}
              aria-label={`Jump to slide ${s.id}: ${s.title}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                currentSlide === s.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
              }`}
            >
              <span>{s.id}.</span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Previous / Next Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentSlide === 1}
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            aria-label="Previous slide"
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded-xl border border-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            disabled={currentSlide === 4}
            onClick={() => setCurrentSlide((prev) => Math.min(4, prev + 1))}
            aria-label="Next slide"
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
