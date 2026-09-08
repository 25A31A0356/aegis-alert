import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Search,
  Waves,
  Wind,
  Activity,
  Zap,
  Mountain,
  Sun,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Layers,
  PhoneCall,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';
import { ActiveView } from '../types';
import { SURVIVAL_GUIDE_DATA, GuideCategory } from '../data/survivalGuideData';
import { DosAndDontsMatrix } from '../components/guide/DosAndDontsMatrix';
import { SurvivalChecklist } from '../components/guide/SurvivalChecklist';

interface SurvivalGuidePageProps {
  setActiveView?: (view: ActiveView) => void;
}

export type GuidePhase = 'all' | 'before' | 'during' | 'after' | 'dos-donts' | 'checklist';

export const SurvivalGuidePage: React.FC<SurvivalGuidePageProps> = ({
  setActiveView = () => {},
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('flood');
  const [activePhase, setActivePhase] = useState<GuidePhase>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentCategory: GuideCategory =
    SURVIVAL_GUIDE_DATA.find((c) => c.id === selectedCategoryId) || SURVIVAL_GUIDE_DATA[0];

  // Helper icon resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves':
        return Waves;
      case 'Wind':
        return Wind;
      case 'Activity':
        return Activity;
      case 'Zap':
        return Zap;
      case 'Mountain':
        return Mountain;
      case 'Sun':
        return Sun;
      default:
        return ShieldCheck;
    }
  };

  const CurrentIcon = getCategoryIcon(currentCategory.iconName);

  // Search filtering
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Top Header & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
              title="Return to Home Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>5. NDMA DISASTER SURVIVAL GUIDE</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Official life-saving instructions before, during, and after natural disasters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              OFFLINE CACHED • ZERO DATA REQUIRED
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search survival instructions (e.g. 'boil water', 'eye of storm', '30-30 rule', 'drop cover hold')..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Horizontal Category Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SURVIVAL_GUIDE_DATA.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setActivePhase('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.title.split(' & ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Category Banner & Phase Navigation Tabs */}
      <div className={`p-6 rounded-3xl bg-gradient-to-r ${currentCategory.bgGradient} border border-slate-800 shadow-2xl space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-cyan-glow">
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-100">
                {currentCategory.title}
              </h1>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {currentCategory.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { id: 'all', label: 'All Protocols' },
            { id: 'before', label: '1. BEFORE (Preparedness)' },
            { id: 'during', label: '2. DURING (Life-Safety)' },
            { id: 'after', label: '3. AFTER (Safe Return)' },
            { id: 'dos-donts', label: "4. DO'S & DON'TS MATRIX" },
            { id: 'checklist', label: '5. 72H CHECKLIST' },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id as GuidePhase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePhase === phase.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Phase-Specific Content Sections */}

      {/* A. 72H SURVIVAL CHECKLIST VIEW */}
      {activePhase === 'checklist' ? (
        <SurvivalChecklist />
      ) : activePhase === 'dos-donts' ? (
        /* B. DO'S & DON'TS MATRIX VIEW */
        <DosAndDontsMatrix
          dos={currentCategory.dos}
          donts={currentCategory.donts}
          hazardTitle={currentCategory.title}
        />
      ) : (
        /* C. BEFORE / DURING / AFTER PHASE CARDS VIEW */
        <div className="space-y-4">
          {/* Phase 1: BEFORE */}
          {(activePhase === 'all' || activePhase === 'before') && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>PHASE 1: BEFORE DISASTER (ADVANCE PREPARATION)</span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                  Readiness
                </span>
              </div>

              <div className="space-y-2">
                {currentCategory.before
                  .filter((item) => matchesSearch(item))
                  .map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Phase 2: DURING */}
          {(activePhase === 'all' || activePhase === 'during') && (
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/40 shadow-red-glow space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>PHASE 2: DURING DISASTER (IMMEDIATE LIFE-SAFETY ACTION)</span>
                </div>
                <span className="text-[10px] font-mono bg-red-500/15 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold uppercase">
                  High Priority
                </span>
              </div>

              <div className="space-y-2">
                {currentCategory.during
                  .filter((item) => matchesSearch(item))
                  .map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-red-500/30 text-xs text-slate-100">
                      <span className="w-5 h-5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Phase 3: AFTER */}
          {(activePhase === 'all' || activePhase === 'after') && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>PHASE 3: AFTER DISASTER (RECOVERY & CLEAN WATER PROTOCOLS)</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  Recovery
                </span>
              </div>

              <div className="space-y-2">
                {currentCategory.after
                  .filter((item) => matchesSearch(item))
                  .map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* If All is selected, also append the Do's & Don'ts Matrix for quick scanning */}
          {activePhase === 'all' && (
            <DosAndDontsMatrix
              dos={currentCategory.dos}
              donts={currentCategory.donts}
              hazardTitle={currentCategory.title}
            />
          )}
        </div>
      )}

      {/* Emergency Helpline Bottom Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            National Disaster Helpline: <strong className="text-white font-mono">1078</strong> | Emergency: <strong className="text-white font-mono">112</strong> | Ambulance: <strong className="text-white font-mono">108</strong>
          </span>
        </div>
        <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>NDMA Verified Disaster Management Guidelines</span>
        </div>
      </div>
    </div>
  );
};
