import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Droplets,
  HeartPulse,
  Flame,
  FileText,
  Package,
} from 'lucide-react';

interface ChecklistSection {
  title: string;
  icon: any;
  items: { id: string; label: string; priority: 'CRITICAL' | 'RECOMMENDED' }[];
}

const DEFAULT_SECTIONS: ChecklistSection[] = [
  {
    title: '1. Water & Hydration (Life-Critical)',
    icon: Droplets,
    items: [
      { id: 'item_w1', label: '3 Liters of sealed drinking water per person per day (minimum 9L per person for 3 days)', priority: 'CRITICAL' },
      { id: 'item_w2', label: 'Water purification chlorine tablets or portable filtration straw', priority: 'CRITICAL' },
      { id: 'item_w3', label: 'Oral Rehydration Salts (ORS) packets (5-10 sachets)', priority: 'RECOMMENDED' },
    ],
  },
  {
    title: '2. Nutrition & Food Rations',
    icon: Package,
    items: [
      { id: 'item_f1', label: 'High-calorie non-perishable food (dry fruits, roasted nuts, energy bars, glucose biscuits)', priority: 'CRITICAL' },
      { id: 'item_f2', label: 'Ready-to-eat canned food with manual pull-tab or non-electric can opener', priority: 'RECOMMENDED' },
      { id: 'item_f3', label: 'Infant formula / baby food / specialty dietary needs (if applicable)', priority: 'CRITICAL' },
    ],
  },
  {
    title: '3. Medical, First-Aid & Medications',
    icon: HeartPulse,
    items: [
      { id: 'item_m1', label: '14-Day supply of essential daily prescription medications (Insulin, BP, Heart meds)', priority: 'CRITICAL' },
      { id: 'item_m2', label: 'Complete first-aid kit (sterile gauze, roller bandages, adhesive tape, burn ointment, antiseptic liquid)', priority: 'CRITICAL' },
      { id: 'item_m3', label: 'Basic OTC medicine pack (paracetamol, antihistamine, antacid, pain relief)', priority: 'RECOMMENDED' },
    ],
  },
  {
    title: '4. Tactical Tools, Lighting & Power',
    icon: Flame,
    items: [
      { id: 'item_t1', label: 'High-lumen waterproof LED torch + 2 full sets of spare batteries', priority: 'CRITICAL' },
      { id: 'item_t2', label: 'High-capacity 20,000mAh charged power bank & multi-pin charging cables', priority: 'CRITICAL' },
      { id: 'item_t3', label: 'Battery-powered AM/FM emergency transistor radio (tuned to 102.8 MHz)', priority: 'RECOMMENDED' },
      { id: 'item_t4', label: 'High-decibel emergency rescue whistle (3-blast signal)', priority: 'CRITICAL' },
      { id: 'item_t5', label: 'Multi-tool pocket knife, heavy-duty duct tape & utility rope (15m)', priority: 'RECOMMENDED' },
    ],
  },
  {
    title: '5. Vital Documents & Sanitation',
    icon: FileText,
    items: [
      { id: 'item_d1', label: 'Aadhaar, Voter ID, Passport, Property deeds & Bank passbooks sealed in waterproof zip pouch', priority: 'CRITICAL' },
      { id: 'item_d2', label: 'Emergency cash in small denomination notes (ATMs will lose power during blackouts)', priority: 'CRITICAL' },
      { id: 'item_d3', label: 'N95 particulate/smoke masks, hand sanitizer, soap & heavy-duty trash bags', priority: 'RECOMMENDED' },
      { id: 'item_d4', label: 'Sanitary pads, wet wipes, and infant diapers (if applicable)', priority: 'RECOMMENDED' },
    ],
  },
];

export const SurvivalChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('aegis_survival_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aegis_survival_checklist', JSON.stringify(checkedIds));
    } catch {}
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    if (window.confirm('Reset all checklist items?')) {
      setCheckedIds({});
    }
  };

  const allItems = DEFAULT_SECTIONS.flatMap((s) => s.items);
  const totalCount = allItems.length;
  const checkedCount = allItems.filter((item) => checkedIds[item.id]).length;
  const percent = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-fadeIn">
      {/* Header & Progress Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            72-HOUR DISASTER PREPAREDNESS "GO-BAG"
          </div>
          <h3 className="text-lg font-black text-slate-100 mt-0.5 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <span>Interactive Survival Kit Checklist</span>
          </h3>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-slate-200">
              {checkedCount} / {totalCount} Items Packed
            </div>
            <div className="text-[10px] text-cyan-400 font-mono font-bold">
              {percent}% Preparedness Score
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Reset Checklist"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent === 100
              ? 'bg-emerald-400 shadow-emerald-glow'
              : percent > 50
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              : 'bg-gradient-to-r from-amber-500 to-cyan-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Section Items Grid */}
      <div className="space-y-4">
        {DEFAULT_SECTIONS.map((section, sIdx) => {
          const SectionIcon = section.icon;
          return (
            <div key={sIdx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                <SectionIcon className="w-4 h-4" />
                <span>{section.title}</span>
              </div>

              <div className="space-y-2">
                {section.items.map((item) => {
                  const isChecked = Boolean(checkedIds[item.id]);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      <div className="flex-1 text-xs">
                        <span className={isChecked ? 'line-through opacity-70' : 'font-medium'}>
                          {item.label}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                          item.priority === 'CRITICAL'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
