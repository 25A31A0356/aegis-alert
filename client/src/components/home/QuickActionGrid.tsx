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
    <div className="space-y-2.5">
      {/* 3 Primary Action Tiles (Matching Screen 1 Mockup) */}
      <div className="grid grid-cols-3 gap-3">
        {/* 1. SOS Beacon */}
        <button
          type="button"
          onClick={() => setActiveView('sos-beacon')}
          className="action-tile flex flex-col justify-between text-left group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-4 hover:border-red-400 dark:hover:border-red-500 transition-all active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 mb-3 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 font-semibold">Emergency</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5 leading-tight">
              SOS Beacon
            </div>
          </div>
        </button>

        {/* 2. Safe Evacuation */}
        <button
          type="button"
          onClick={() => setActiveView('safe-evacuation')}
          className="action-tile flex flex-col justify-between text-left group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-4 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 font-semibold">High-Ground</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5 leading-tight">
              Evacuation
            </div>
          </div>
        </button>

        {/* 3. Safe Check-In */}
        <button
          type="button"
          onClick={() => setActiveView('safe-beacon')}
          className="action-tile flex flex-col justify-between text-left group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-4 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 font-semibold">Status Ping</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5 leading-tight">
              Safe Beacon
            </div>
          </div>
        </button>
      </div>

      {/* Secondary Quick Action Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* 4. Ask Aegis */}
        <button
          type="button"
          onClick={() => setActiveView('ask-aegis')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-left transition-all active:scale-95 flex items-center gap-2.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Ask Aegis</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">24/7 AI Advice</div>
          </div>
        </button>

        {/* 5. Community Report */}
        <button
          type="button"
          onClick={() => setActiveView('community-report')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 text-left transition-all active:scale-95 flex items-center gap-2.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Report Hazard</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">Road Damage</div>
          </div>
        </button>

        {/* 6. Survival Guide */}
        <button
          type="button"
          onClick={() => setActiveView('survival-guide')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 text-left transition-all active:scale-95 flex items-center gap-2.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Survival Guide</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">72h Go-Bag</div>
          </div>
        </button>
      </div>
    </div>
  );
};
