import React from 'react';
import { ActiveView } from '../types';
import { AegisChatInterface } from '../components/chat/AegisChatInterface';
import {
  ShieldAlert,
  PhoneCall,
  Sparkles,
  BookOpen,
  MapPin,
  Radio,
  FileText,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';

interface AskAegisPageProps {
  setActiveView?: (view: ActiveView) => void;
}

export const AskAegisPage: React.FC<AskAegisPageProps> = ({ setActiveView = () => {} }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Main Chat Interface Component */}
      <AegisChatInterface setActiveView={setActiveView} />

      {/* 2. Emergency Disaster Topics Quick Guide */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
              Offline Knowledge Base Directory
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            9 NDMA PROTOCOLS EMBEDDED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>🌊 Floods & Hydrology</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              15cm/30cm water hazard rule, high-ground elevation, electrical and gas disconnection, water chlorination.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>🌀 Cyclones & Gales</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Eye-of-storm calm period trap, internal room shelter, window storm protection, tidal surge evacuation.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>🏚️ Earthquakes</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              "Drop, Cover, and Hold On", elevator avoidance, post-tremor gas leak detection, aftershock safety.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>⚡ Lightning & Storms</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              30-30 safety rule, indoor plumbing avoidance, vehicle Faraday cage protection, open field crouch posture.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>☀️ Extreme Heatwaves</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Heat stroke vs exhaustion symptoms, rapid cooling first-aid, ORS rehydration, sun exposure limits.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>🎒 72h Survival Kit</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              3L water/person/day, calorie-dense dry food, vital document waterproof pouch, torches, whistle, medications.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Emergency Authorities & Non-Official Advisory Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            National Emergency: <strong className="text-slate-100 font-mono">112</strong> | NDRF Disaster Command: <strong className="text-slate-100 font-mono">1078</strong> | Ambulance: <strong className="text-slate-100 font-mono">108</strong>
          </span>
        </div>
        <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Aegis is an advisory assistant. Not an official government command.</span>
        </div>
      </div>
    </div>
  );
};
