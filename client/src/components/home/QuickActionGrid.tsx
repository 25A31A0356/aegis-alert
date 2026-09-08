import React from 'react';
import {
  ShieldAlert,
  Navigation,
  Radio,
  HeartHandshake,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { ActiveView } from '../../types';

interface QuickActionGridProps {
  setActiveView: (view: ActiveView) => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ setActiveView }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          QUICK TACTICAL ACTIONS
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">1-TAP FAST ACCESS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. SOS Beacon */}
        <button
          onClick={() => setActiveView('sos-beacon')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-glow border border-red-400/40 text-left transition-all active:scale-95 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldAlert className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black bg-black/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              EMERGENCY
            </span>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wide">3. SOS Beacon</div>
            <div className="text-[10px] text-red-100/80 mt-0.5">One-Tap Distress</div>
          </div>
        </button>

        {/* 2. Safe Evacuation */}
        <button
          onClick={() => setActiveView('safe-evacuation')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-cyan-500/50 text-left transition-all active:scale-95 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full">
              LIVE
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">2. Safe Evacuation</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High-Ground Routes</div>
          </div>
        </button>

        {/* 3. Ask Aegis */}
        <button
          onClick={() => setActiveView('ask-aegis')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-cyan-500/50 text-left transition-all active:scale-95 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
              24/7 AI
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">4. Ask Aegis</div>
            <div className="text-[10px] text-slate-400 mt-0.5">AI Triage Advisor</div>
          </div>
        </button>

        {/* 4. Safe Beacon */}
        <button
          onClick={() => setActiveView('safe-beacon')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-emerald-500/50 text-left transition-all active:scale-95 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <HeartHandshake className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
              &lt;1KB
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">7. Safe Beacon</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Family Check-In</div>
          </div>
        </button>

        {/* 5. Community Report */}
        <button
          onClick={() => setActiveView('community-report')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-amber-500/50 text-left transition-all active:scale-95 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">
              CITIZEN
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">6. Report Hazard</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Crowdsourced Alerts</div>
          </div>
        </button>

        {/* 6. Survival Guide */}
        <button
          onClick={() => setActiveView('survival-guide')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-cyan-500/50 text-left transition-all active:scale-95 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full">
              NDMA
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">5. Survival Guide</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Offline Protocols</div>
          </div>
        </button>
      </div>
    </div>
  );
};
