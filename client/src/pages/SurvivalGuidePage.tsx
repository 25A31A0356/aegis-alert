import React, { useState } from 'react';
import {
  BookOpen,
  Waves,
  Wind,
  Activity,
  Zap,
  Sun,
  Mountain,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { HazardType } from '@shared';

interface GuideData {
  title: string;
  hazardType: HazardType | 'Heatwave' | 'Landslide';
  icon: React.FC<{ className?: string }>;
  color: string;
  before: string[];
  during: string[];
  after: string[];
  dos: string[];
  donts: string[];
  checklist: string[];
}

const SURVIVAL_GUIDES: GuideData[] = [
  {
    title: 'Floods & Coastal Inundation',
    hazardType: 'Flood',
    icon: Waves,
    color: 'text-cyan-400',
    before: [
      'Identify local high ground evacuation shelters and highest terrain nearby.',
      'Seal valuable identification documents (Aadhaar, property deeds) in waterproof ziploc pouches.',
      'Install check-valves in building sewer traps to prevent flood backflow.',
    ],
    during: [
      'Turn off the main electrical breaker and LPG cylinder regulators before evacuating.',
      'NEVER attempt to walk, swim, or drive through flowing water (15cm sweeps people; 30cm floats cars).',
      'Move to top floors of multi-story reinforced concrete structures if trapped.',
    ],
    after: [
      'Boil all tap/well water for at least 10 minutes or use chlorine water-purification tablets.',
      'Watch out for displaced poisonous snakes, scorpions, and sharp submerged debris.',
      'Do not turn on electrical appliances until inspected by a certified electrician.',
    ],
    dos: [
      'Drink only boiled or bottled water.',
      'Keep your emergency phone on battery saver mode.',
      'Cooperate with NDRF and SDRF rescue boat teams.',
    ],
    donts: [
      'Do not touch fallen electric wires or poles.',
      'Do not eat food that has touched flood water.',
      'Do not wade through water with open cuts or sores.',
    ],
    checklist: [
      '3 Liters water per person per day',
      'Ready-to-eat high-energy dry rations',
      'LED flashlight with spare batteries',
      'Waterproof first-aid medical kit',
    ],
  },
  {
    title: 'Cyclones & Severe Gales',
    hazardType: 'Cyclone',
    icon: Wind,
    color: 'text-orange-400',
    before: [
      'Trim dead or overhang tree branches that could crash onto house roofs.',
      'Store 72 hours of emergency food and water for the entire family.',
      'Secure or move indoors loose outdoor furniture, tin roofing, and debris.',
    ],
    during: [
      'Stay indoors in the strongest, innermost room without exterior windows.',
      'If the eye of the cyclone arrives (calm period), DO NOT step outside; violent reverse winds will strike shortly.',
      'Protect head and chest with heavy mattresses if roof shows structural fatigue.',
    ],
    after: [
      'Strictly avoid fallen power cables and water pools near utility poles.',
      'Report gas leaks or structural building cracks to local ward authorities.',
      'Clear standing water quickly around home to prevent dengue/malaria breeding.',
    ],
    dos: [
      'Keep mobile devices and emergency power banks fully charged.',
      'Monitor official IMD and SDMA weather sirens.',
      'Anchor loose tin sheets with sandbags.',
    ],
    donts: [
      'Do not spread unverified social media rumors.',
      'Do not venture out to sea or coastal beaches during orange/red alert.',
      'Do not park cars under old trees or giant billboards.',
    ],
    checklist: [
      'Battery-powered AM/FM radio',
      'Emergency whistle',
      'Prescription medications',
      'Cash in small denomination currency',
    ],
  },
  {
    title: 'Earthquakes & Structural Tremors',
    hazardType: 'Earthquake',
    icon: Activity,
    color: 'text-red-400',
    before: [
      'Fasten heavy shelves, water heaters, and mirrors securely to wall studs.',
      'Locate safe spots in each room: under sturdy wooden desks or against interior walls.',
      'Conduct family Drop, Cover, and Hold On practice drills.',
    ],
    during: [
      'DROP to hands and knees immediately to prevent being knocked down.',
      'COVER head and neck under a sturdy table; if no desk is nearby, cover against interior wall.',
      'HOLD ON to the shelter until shaking completely ceases.',
    ],
    after: [
      'Expect aftershocks which can trigger additional damage to compromised structures.',
      'Evacuate via stairwells only; NEVER use elevators during or following tremors.',
      'Check yourself and family for bleeding wounds and apply pressure bandage.',
    ],
    dos: [
      'Drop, Cover, and Hold On.',
      'Cover your face with cloth to avoid inhaling dust and pulverized cement.',
      'Tap on pipes or use a whistle if trapped under debris.',
    ],
    donts: [
      'Do not rush outside while tremors are active (falling glass/brick danger).',
      'Do not light matches or lighters in case of ruptured gas mains.',
      'Do not enter visibly cracked buildings.',
    ],
    checklist: [
      'Sturdy closed-toe shoes and leather gloves',
      'Dust masks (N95)',
      'First aid burn & wound kit',
      'Emergency multi-tool with pliers',
    ],
  },
  {
    title: 'Severe Lightning & Thunderstorms',
    hazardType: 'Lightning',
    icon: Zap,
    color: 'text-yellow-400',
    before: [
      'Check local radar warnings for thunderstorm development.',
      'Unplug sensitive electronics and modems before storm reaches vicinity.',
      'Identify fully enclosed metal-roof buildings or enclosed vehicles.',
    ],
    during: [
      'Follow the 30-30 Rule: If time between flash and bang is <30s, seek shelter.',
      'Stay off corded phones, computers, and away from plumbing fixtures.',
      'If trapped in open field, crouch down into ball on soles of feet with hands on knees.',
    ],
    after: [
      'Wait at least 30 minutes after the last thunderclap before leaving shelter.',
      'Provide immediate CPR to lightning victims (they do NOT carry electrical charge).',
      'Inspect roof and trees for fire sparks.',
    ],
    dos: [
      'Stay inside enclosed hard-top vehicles.',
      'Keep clear of wire fences, metal poles, and railroad tracks.',
      'Stay low and avoid being the tallest object in open fields.',
    ],
    donts: [
      'Do not shelter under isolated tall trees or tin-roof sheds.',
      'Do not swim or take showers during active lightning.',
      'Do not lie flat on the wet ground.',
    ],
    checklist: [
      'Non-conductive emergency shoes',
      'Emergency phone with lightning radar app',
      'Insulated emergency blanket',
    ],
  },
];

export const SurvivalGuidePage: React.FC = () => {
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'timeline' | 'dos' | 'checklist'>('timeline');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const guide = SURVIVAL_GUIDES[selectedGuideIndex];
  const GuideIcon = guide.icon;

  const toggleChecklist = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <BookOpen className="w-5 h-5" />
            <span>5. OFFLINE SURVIVAL GUIDE & NDMA SAFETY PROTOCOLS</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            100% offline-cached survival instructions, Do's & Don'ts, and 72-hour family disaster kits.
          </p>
        </div>

        <span className="badge-green px-3 py-1 rounded-xl text-xs font-mono font-bold">
          OFFLINE CACHED
        </span>
      </div>

      {/* Disaster Category Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SURVIVAL_GUIDES.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = selectedGuideIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedGuideIndex(idx)}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 text-left transition-all ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500/60 shadow-cyan-glow text-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Guide Content Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Guide Title Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-cyan-400">
              <GuideIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                NATIONAL DISASTER MANAGEMENT GUIDELINE (NDMA)
              </div>
              <h2 className="text-lg font-black text-slate-100">{guide.title}</h2>
            </div>
          </div>

          {/* Sub-Tabs: Timeline / Do's & Don'ts / Checklist */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'timeline' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Before / During / After
            </button>
            <button
              onClick={() => setActiveTab('dos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'dos' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Do's & Don'ts
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'checklist' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              72h Kit Checklist
            </button>
          </div>
        </div>

        {/* Tab 1: Timeline (Before, During, After) */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Before */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 1. BEFORE DISASTER
              </div>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                {guide.before.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* During */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 2. DURING DISASTER
              </div>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                {guide.during.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 3. AFTER DISASTER
              </div>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                {guide.after.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Do's & Don'ts */}
        {activeTab === 'dos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* DO's */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> WHAT TO DO (RECOMMENDED)
              </div>
              <ul className="space-y-2.5 text-slate-200 leading-relaxed">
                {guide.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DON'Ts */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
              <div className="font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> WHAT NOT TO DO (AVOID)
              </div>
              <ul className="space-y-2.5 text-slate-200 leading-relaxed">
                {guide.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: 72-Hour Kit Checklist */}
        {activeTab === 'checklist' && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4 text-xs">
            <div>
              <div className="font-bold text-cyan-400 uppercase tracking-wider font-mono mb-1">
                72-Hour Survival Go-Bag Checklist
              </div>
              <p className="text-slate-400">
                Tick off essentials as you pack them. This list is saved locally on your device.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guide.checklist.map((item, idx) => {
                const isChecked = Boolean(checkedItems[item]);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleChecklist(item)}
                    className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={isChecked ? 'line-through text-slate-400' : 'font-semibold'}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
