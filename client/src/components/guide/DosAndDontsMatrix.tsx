import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck, AlertOctagon } from 'lucide-react';

interface DosAndDontsMatrixProps {
  dos: string[];
  donts: string[];
  hazardTitle: string;
}

export const DosAndDontsMatrix: React.FC<DosAndDontsMatrixProps> = ({
  dos,
  donts,
  hazardTitle,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
      {/* 1. DO'S (Green High-Contrast Safe Actions) */}
      <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-emerald-glow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-emerald-500/30 text-emerald-400">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-300">
                RECOMMENDED DO'S
              </h4>
              <p className="text-[11px] text-emerald-400/80 font-mono">
                Verified life-safety actions for {hazardTitle}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mt-3">
            {dos.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Follow strictly during active emergency phase</span>
        </div>
      </div>

      {/* 2. DON'TS (Red High-Contrast Dangerous Pitfalls) */}
      <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/40 shadow-red-glow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-red-500/30 text-red-400">
            <div className="p-1.5 rounded-xl bg-red-500/20 border border-red-500/40">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-red-300">
                CRITICAL DON'TS
              </h4>
              <p className="text-[11px] text-red-400/80 font-mono">
                Prohibited high-hazard behaviors & common mistakes
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mt-3">
            {donts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-red-100">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-red-500/20 text-[10px] font-mono text-red-400 flex items-center gap-1">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Severe injury or fatality risk if violated</span>
        </div>
      </div>
    </div>
  );
};
