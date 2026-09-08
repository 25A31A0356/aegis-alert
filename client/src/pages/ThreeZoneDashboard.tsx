import React from 'react';
import {
  Home,
  Navigation,
  ShieldAlert,
  Radio,
  BookOpen,
  Users,
  HeartHandshake,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ActiveView } from '../types';
import { useEmergency } from '../stores/EmergencyContext';

interface ThreeZoneDashboardProps {
  setActiveView: (view: ActiveView) => void;
}

export const ThreeZoneDashboard: React.FC<ThreeZoneDashboardProps> = ({ setActiveView }) => {
  const { alerts, userLocation, activeSos, latestSafeBeacon, isOnline } = useEmergency();
  const criticalAlert = alerts.find((a) => a.severity === 'RED') || alerts[0];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Alert Strip */}
      {criticalAlert && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-100 flex items-center justify-between gap-3 shadow-red-glow">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            <div className="text-xs">
              <span className="font-black uppercase text-red-300 mr-2">
                {criticalAlert.severity} ALERT • {criticalAlert.hazardType}:
              </span>
              <span className="font-bold text-slate-100">{criticalAlert.headline}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveView('safe-evacuation')}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-sm"
          >
            Evacuate →
          </button>
        </div>
      )}

      {/* 3-Zone Desktop Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================================================
            LEFT ZONE (Cols 1-3): Home, Safe Evacuation, SOS Beacon
            ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              LEFT: ACTION ZONE
            </span>
          </div>

          {/* 1. Home Quick Card */}
          <div
            onClick={() => setActiveView('home')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Home className="w-4 h-4" /> 1. Home Dashboard
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xs text-slate-300 font-semibold">
              Sector: {userLocation.address}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="text-red-400 font-bold">CRITICAL RISK</span>
              <span>•</span>
              <span className="text-emerald-400">2 Shelters Online</span>
            </div>
          </div>

          {/* 2. Safe Evacuation Quick Card */}
          <div
            onClick={() => setActiveView('safe-evacuation')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Navigation className="w-4 h-4" /> 2. Safe Evacuation
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-bold text-slate-100">APSDMA Cyclone Center</span> (+48.5m)
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Distance: 4.2 km</span>
              <span className="text-emerald-400 font-bold">14 mins ETA</span>
            </div>
          </div>

          {/* 3. SOS Emergency Beacon Card */}
          <div
            onClick={() => setActiveView('sos-beacon')}
            className="p-4 rounded-2xl bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-900 border-2 border-red-500/40 hover:border-red-500 shadow-red-glow transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 animate-pulse" /> 3. SOS Emergency Beacon
              </div>
              <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">
                1-TAP
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Broadcast GPS distress telemetry, trapped counts, and water levels to rescue dispatchers.
            </p>
            <div className="pt-1 flex items-center justify-between text-xs font-bold text-red-400 group-hover:text-red-300">
              <span>{activeSos ? 'SOS TRANSMITTING...' : 'Open SOS Console'}</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CENTER ZONE (Cols 4-8): Ask Aegis AI Assistant
            ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              CENTER: ASK AEGIS (AI EMERGENCY ASSISTANT)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {isOnline ? 'Online + Offline KB' : 'Offline Mode Active'}
            </span>
          </div>

          {/* Central Interactive AI Assistant Container */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg flex flex-col h-[520px]">
            {/* AI Console Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-bold shadow-cyan-glow">
                  <Bot className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-100">AEGIS CITIZEN ASSISTANT</div>
                  <div className="text-[10px] text-slate-400 font-mono">NDMA Emergency Knowledge Base</div>
                </div>
              </div>

              <button
                onClick={() => setActiveView('ask-aegis')}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
              >
                Expand Full View →
              </button>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {/* Bot Message */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 text-xs">
                  🤖
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed max-w-md">
                  <span className="font-bold text-cyan-400 block mb-1">
                    Emergency Advisory for Sector {userLocation.address}:
                  </span>
                  Severe flood surge is active in coastal lowlands. If water reaches 0.5m, shut main power switch and evacuate to high ground shelters. How can I help you right now?
                </div>
              </div>

              {/* Sample Action Chips */}
              <div className="pl-8 flex flex-wrap gap-1.5">
                {[
                  'Flood Safety Rules',
                  'Cyclone Preparation',
                  '72-Hour Survival Kit',
                  'Emergency Helplines',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveView('ask-aegis')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 text-[10px] font-semibold border border-slate-700/60 transition-colors"
                  >
                    {chip} →
                  </button>
                ))}
              </div>
            </div>

            {/* AI Input Trigger */}
            <div
              onClick={() => setActiveView('ask-aegis')}
              className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors shrink-0"
            >
              <input
                type="text"
                readOnly
                placeholder="Ask Aegis about flood survival, routes, first-aid..."
                className="flex-1 px-3 py-1.5 bg-transparent text-xs text-slate-400 cursor-pointer focus:outline-none"
              />
              <button className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> Ask
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT ZONE (Cols 9-12): Survival Guide, Community Report, Safe Beacon
            ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              RIGHT: SAFETY & COMMUNITY
            </span>
          </div>

          {/* 5. Survival Guide Quick Card */}
          <div
            onClick={() => setActiveView('survival-guide')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <BookOpen className="w-4 h-4" /> 5. Survival Guide
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-300">
              NDMA Do's & Don'ts for Floods, Cyclones, Earthquakes, and Lightning.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              ✓ 100% Offline Cached
            </div>
          </div>

          {/* 6. Community Report Quick Card */}
          <div
            onClick={() => setActiveView('community-report')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Users className="w-4 h-4" /> 6. Community Report
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-300">
              Crowdsource road blockages, fallen trees, and waterlogging.
            </p>
            <div className="text-[10px] font-mono text-amber-400 font-bold">
              3 Community Reports Active
            </div>
          </div>

          {/* 7. Safe Beacon Quick Card */}
          <div
            onClick={() => setActiveView('safe-beacon')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <HeartHandshake className="w-4 h-4" /> 7. Safe Beacon
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xs text-slate-300">
              Broadcast "I Am Safe" location status with sub-1KB payload.
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Last Ping: <span className="text-emerald-400 font-bold">{latestSafeBeacon?.status || 'Ready'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
