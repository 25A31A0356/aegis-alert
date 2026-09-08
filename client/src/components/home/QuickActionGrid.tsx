import React from 'react';
import {
  ShieldAlert,
  Navigation,
  Radio,
  HeartHandshake,
  AlertTriangle,
  BookOpen,
  Send,
  HelpCircle,
} from 'lucide-react';
import { ActiveView } from '../../types';

interface QuickActionGridProps {
  setActiveView: (view: ActiveView) => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ setActiveView }) => {
  return (
    <div className="space-y-3">
      {/* 3 Primary Squircle Action Cards (Direct Screen 1 Reference Match) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {/* 1. Safe Evacuation / Shelter (Green Olive Pastel Theme) */}
        <button
          type="button"
          onClick={() => setActiveView('safe-evacuation')}
          className="bg-[#f7f9fa] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 text-left flex flex-col justify-between h-[124px] sm:h-[138px] hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/50 transition-all duration-200 active:scale-96 group shadow-sm"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-[#617e4d] dark:bg-[#526f3f] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Navigation className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white rotate-45" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Today</span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-tight block mt-0.5">
              Find Shelter
            </span>
          </div>
        </button>

        {/* 2. SOS Beacon / Distress (Dusty Crimson Red Theme) */}
        <button
          type="button"
          onClick={() => setActiveView('sos-beacon')}
          className="bg-[#f7f9fa] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 text-left flex flex-col justify-between h-[124px] sm:h-[138px] hover:shadow-md hover:border-red-500/40 dark:hover:border-red-500/50 transition-all duration-200 active:scale-96 group shadow-sm"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-[#b85b5b] dark:bg-[#a64848] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Today</span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-tight block mt-0.5">
              SOS Beacon
            </span>
          </div>
        </button>

        {/* 3. Safe Beacon / Check-In (Cornflower Blue Theme) */}
        <button
          type="button"
          onClick={() => setActiveView('safe-beacon')}
          className="bg-[#f7f9fa] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 text-left flex flex-col justify-between h-[124px] sm:h-[138px] hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/50 transition-all duration-200 active:scale-96 group shadow-sm"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-[#4f80b8] dark:bg-[#3f6e9f] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Today</span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-tight block mt-0.5">
              Safe Ping
            </span>
          </div>
        </button>
      </div>

      {/* Secondary Quick Action Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-0.5">
        <button
          type="button"
          onClick={() => setActiveView('ask-aegis')}
          className="p-2.5 sm:p-3 rounded-2xl bg-[#ffffff] dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 hover:border-cyan-500/30 text-left transition-all active:scale-96 flex items-center gap-2 shadow-xs"
        >
          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-cyan-100/70 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Ask Aegis</div>
            <div className="text-[9px] text-slate-400 font-medium truncate">AI Triage</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('community-report')}
          className="p-2.5 sm:p-3 rounded-2xl bg-[#ffffff] dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 hover:border-amber-500/30 text-left transition-all active:scale-96 flex items-center gap-2 shadow-xs"
        >
          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/70 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Report</div>
            <div className="text-[9px] text-slate-400 font-medium truncate">Hazard Intel</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('survival-guide')}
          className="p-2.5 sm:p-3 rounded-2xl bg-[#ffffff] dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/30 text-left transition-all active:scale-96 flex items-center gap-2 shadow-xs"
        >
          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-100/70 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Protocols</div>
            <div className="text-[9px] text-slate-400 font-medium truncate">NDMA Rules</div>
          </div>
        </button>
      </div>
    </div>
  );
};
