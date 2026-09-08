import React from 'react';
import {
  ShieldAlert,
  Navigation,
  Radio,
  HeartHandshake,
  MapPin,
  AlertTriangle,
  Home as HomeIcon,
  Wind,
  Droplets,
  Eye,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { ActiveView } from '../types';
import { useEmergency } from '../stores/EmergencyContext';

interface HomePageProps {
  setActiveView: (view: ActiveView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveView }) => {
  const { alerts, userLocation, activeSos, isOnline } = useEmergency();
  const criticalAlert = alerts.find((a) => a.severity === 'RED') || alerts[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Location & Emergency Condition Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <span>CURRENT GPS SECTOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-bold">ACCURATE &plusmn;8m</span>
            </div>
            <div className="text-sm font-black text-slate-100">
              {userLocation.address} ({userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            SECTOR RISK: CRITICAL (LEVEL 4)
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
            {isOnline ? 'LIVE TELEMETRY' : 'CACHED OFFLINE'}
          </div>
        </div>
      </div>

      {/* 2. Critical Alert Banner */}
      {criticalAlert && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-2 border-red-500/50 shadow-red-glow text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 mt-0.5">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-red text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {criticalAlert.severity} ALERT • {criticalAlert.hazardType}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Issued by {criticalAlert.issuedBy}
                </span>
              </div>
              <h2 className="text-base md:text-lg font-black text-slate-100 leading-snug">
                {criticalAlert.headline}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                {criticalAlert.instruction}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveView('safe-evacuation')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4" /> View Evacuation Route
            </button>
            <button
              onClick={() => setActiveView('sos-beacon')}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-red-300 text-xs font-semibold rounded-xl border border-red-500/30 transition-colors text-center"
            >
              Broadcast SOS
            </button>
          </div>
        </div>
      )}

      {/* 3. The 4 Essential Emergency Answers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Q1: Am I Safe? */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Q1. AM I SAFE?</span>
              <span className="text-red-400 font-bold">WARNING</span>
            </div>
            <div className="text-sm font-bold text-slate-100 mb-1">
              Active Coastal Inundation Zone
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Your sector is currently at high risk of waterlogging above 1.2m. High ground evacuation is advised.
            </div>
          </div>
          <button
            onClick={() => setActiveView('safe-beacon')}
            className="mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <HeartHandshake className="w-3.5 h-3.5" /> Send "I Am Safe" Ping →
          </button>
        </div>

        {/* Q2: What is happening? */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Q2. WHAT IS HAPPENING?</span>
              <span className="text-amber-400 font-bold">MONITORING</span>
            </div>
            <div className="text-sm font-bold text-slate-100 mb-1">
              Flash Flood & 85km/h Gale Winds
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              180mm rain recorded in 6 hours. Storm surge high tide peaking at 18:30 IST.
            </div>
          </div>
          <button
            onClick={() => setActiveView('recent-events')}
            className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> View Incident Feed →
          </button>
        </div>

        {/* Q3: What should I do? */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Q3. WHAT SHOULD I DO?</span>
              <span className="text-cyan-400 font-bold">ACTION</span>
            </div>
            <div className="text-sm font-bold text-slate-100 mb-1">
              Follow NDMA Flood Protocols
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Disconnect main power & gas. Pack 72h survival kit. Move immediately to verified shelters.
            </div>
          </div>
          <button
            onClick={() => setActiveView('survival-guide')}
            className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Open Survival Guide →
          </button>
        </div>

        {/* Q4: Where should I go? */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Q4. WHERE SHOULD I GO?</span>
              <span className="text-emerald-400 font-bold">OPEN</span>
            </div>
            <div className="text-sm font-bold text-slate-100 mb-1">
              APSDMA Central Cyclone Shelter
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              4.2 km via Ridge Highway. 610 beds open with drinking water, medical station & power.
            </div>
          </div>
          <button
            onClick={() => setActiveView('safe-evacuation')}
            className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Navigation className="w-3.5 h-3.5" /> Navigate to Shelter →
          </button>
        </div>
      </div>

      {/* 4. Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveView('sos-beacon')}
          className="p-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-glow border border-red-400/40 text-left transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-3">
            <ShieldAlert className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black bg-black/30 px-2 py-0.5 rounded-full">EMERGENCY</span>
          </div>
          <div className="text-sm font-black uppercase tracking-wide">3. SOS Beacon</div>
          <div className="text-[11px] text-red-100/80 mt-0.5">One-Tap Broadcast</div>
        </button>

        <button
          onClick={() => setActiveView('safe-evacuation')}
          className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-cyan-500/40 text-left transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-3">
            <Navigation className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          <div className="text-sm font-bold">2. Safe Evacuation</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Shelters & Routes</div>
        </button>

        <button
          onClick={() => setActiveView('ask-aegis')}
          className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-cyan-500/40 text-left transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-3">
            <Radio className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">AI 24/7</span>
          </div>
          <div className="text-sm font-bold">4. Ask Aegis</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Offline/Online Bot</div>
        </button>

        <button
          onClick={() => setActiveView('safe-beacon')}
          className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-emerald-500/40 text-left transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-3">
            <HeartHandshake className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">&lt;1KB PING</span>
          </div>
          <div className="text-sm font-bold">7. Safe Beacon</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Family Check-In</div>
        </button>
      </div>
    </div>
  );
};
