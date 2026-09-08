import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Navigation,
  Sparkles,
  HeartHandshake,
  Droplets,
  Wind,
  Activity,
  Gauge,
  ArrowRight,
  Radio,
  MapPin,
  Clock,
} from 'lucide-react';
import { ActiveView } from '../../types';
import { useEmergency, SECTOR_PRESETS } from '../../stores/EmergencyContext';

interface HomeHeroStatusProps {
  setActiveView: (view: ActiveView) => void;
}

export const HomeHeroStatus: React.FC<HomeHeroStatusProps> = ({ setActiveView }) => {
  const {
    selectedSectorId,
    scenario,
    shelters,
    setSelectedShelterId,
  } = useEmergency();

  const currentSector = SECTOR_PRESETS.find((s) => s.id === selectedSectorId) || SECTOR_PRESETS[0];

  // Dynamic scenario parameters
  const scenarioConfig = {
    FLOOD: {
      threatTitle: 'ACTIVE COASTAL & RIVER INUNDATION',
      threatScore: currentSector.threatScore,
      riskLevel: currentSector.riskLevel,
      safeAnswer: currentSector.riskLevel === 'CRITICAL' || currentSector.riskLevel === 'HIGH' ? 'NO - HIGH RISK ZONE' : 'MONITORING ZONE',
      safeBadgeColor: currentSector.riskLevel === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-amber-500 text-black',
      dangerDescription: `Sector is currently under flash-flood risk with water levels exceeding 1.4m in low-lying roads. High ground relocation is active.`,
      telemetry: [
        { label: 'Water Level', value: '205.85m', sub: '+1.4m Danger Threshold', icon: Droplets, color: 'text-red-400' },
        { label: 'Rainfall (6h)', value: '185 mm', sub: 'Extremely Heavy', icon: Activity, color: 'text-cyan-400' },
        { label: 'Wind Gust', value: '75 km/h', sub: 'Strong Breeze', icon: Wind, color: 'text-amber-400' },
        { label: 'Flood Trend', value: 'RISING', sub: '+8 cm/hr', icon: Gauge, color: 'text-red-400' },
      ],
      actions: [
        { step: '1', text: 'Cut off main circuit breaker & close LPG cylinder valve.' },
        { step: '2', text: 'Move family & pets to 2nd floor or designated high ground.' },
        { step: '3', text: 'Keep waterproof emergency kit, ID, and phone battery charged.' },
      ],
    },
    CYCLONE: {
      threatTitle: 'VERY SEVERE CYCLONIC STORM (CATEGORY 3)',
      threatScore: 92,
      riskLevel: 'CRITICAL' as const,
      safeAnswer: 'NO - IMMINENT LANDFALL DANGER',
      safeBadgeColor: 'bg-red-500 text-white',
      dangerDescription: `Cyclone landfall expected within 4 hours. Sustained gale winds of 130-150 km/h with storm surges up to 2.5 meters.`,
      telemetry: [
        { label: 'Wind Velocity', value: '142 km/h', sub: 'Gale to Storm', icon: Wind, color: 'text-red-400' },
        { label: 'Central Pressure', value: '964 hPa', sub: 'Deep Low System', icon: Gauge, color: 'text-cyan-400' },
        { label: 'Storm Surge', value: '2.2 meters', sub: 'High Inundation', icon: Droplets, color: 'text-red-400' },
        { label: 'Landfall ETA', value: '3h 45m', sub: 'Kalingapatnam Belt', icon: Clock, color: 'text-amber-400' },
      ],
      actions: [
        { step: '1', text: 'Remain strictly indoors in a reinforced concrete room away from glass windows.' },
        { step: '2', text: 'Do not venture outside during eye of cyclone calm period.' },
        { step: '3', text: 'Follow official civil defense radio alerts on 102.8 MHz.' },
      ],
    },
    EARTHQUAKE: {
      threatTitle: 'POST-SEISMIC AFTERSHOCK ADVISORY (M 5.8)',
      threatScore: 68,
      riskLevel: 'HIGH' as const,
      safeAnswer: 'CAUTION - STRUCTURAL VULNERABILITY',
      safeBadgeColor: 'bg-amber-500 text-black',
      dangerDescription: `Major seismic tremor recorded 24km NW. Multiple aftershocks expected. Inspect premises for load-bearing wall cracks.`,
      telemetry: [
        { label: 'Magnitude', value: 'M 5.8', sub: 'Epicenter Depth 12km', icon: Activity, color: 'text-red-400' },
        { label: 'Aftershock Prob.', value: '78%', sub: 'Next 12 Hours', icon: Gauge, color: 'text-amber-400' },
        { label: 'Intensity (MMI)', value: 'VI - Strong', sub: 'Felt Broadly', icon: ShieldAlert, color: 'text-cyan-400' },
        { label: 'Tsunami Risk', value: 'NIL', sub: 'Inland Epicenter', icon: Droplets, color: 'text-emerald-400' },
      ],
      actions: [
        { step: '1', text: 'DROP, COVER, and HOLD ON under sturdy furniture if shaking restarts.' },
        { step: '2', text: 'Evacuate damaged buildings via stairs; DO NOT use elevators.' },
        { step: '3', text: 'Stay clear of overhead power cables and high-rise facades.' },
      ],
    },
    NORMAL: {
      threatTitle: 'NORMAL CONDITIONS - ALL CLEAR',
      threatScore: 12,
      riskLevel: 'LOW' as const,
      safeAnswer: 'YES - SECTOR IS SAFE',
      safeBadgeColor: 'bg-emerald-500 text-white',
      dangerDescription: `No active meteorological, seismic, or hydrological threats in your sector. Routine regional telemetry active.`,
      telemetry: [
        { label: 'River Level', value: '201.10m', sub: 'Normal Flow (-3.8m)', icon: Droplets, color: 'text-emerald-400' },
        { label: 'Wind Speed', value: '18 km/h', sub: 'Gentle Breeze', icon: Wind, color: 'text-cyan-400' },
        { label: 'Rainfall Rate', value: '0.0 mm/h', sub: 'Clear Skies', icon: Activity, color: 'text-slate-400' },
        { label: 'Status', value: 'NORMAL', sub: 'Standard Watch', icon: ShieldCheck, color: 'text-emerald-400' },
      ],
      actions: [
        { step: '1', text: 'Review household disaster preparedness and first-aid kit.' },
        { step: '2', text: 'Ensure family members have offline SMS emergency contacts saved.' },
        { step: '3', text: 'Download regional offline map tile packs for zero-network resilience.' },
      ],
    },
  }[scenario] || {
    threatTitle: 'ACTIVE INCIDENT',
    threatScore: 70,
    riskLevel: 'HIGH' as const,
    safeAnswer: 'MONITORING',
    safeBadgeColor: 'bg-amber-500 text-black',
    dangerDescription: 'Standard emergency monitoring in progress.',
    telemetry: [],
    actions: [],
  };

  // Find nearest recommended shelter
  const nearestShelter = shelters.find((s) => s.status === 'OPEN') || shelters[0] || {
    id: 'shelter-1',
    name: 'APSDMA Central Cyclone & High-Ground Shelter',
    location: 'Ridge Road, Sector 12',
    elevationMeters: 28,
    totalCapacity: 600,
    occupiedCapacity: 240,
    availableCapacity: 360,
    status: 'OPEN',
  };

  const handleNavigateShelter = () => {
    setSelectedShelterId(nearestShelter.id);
    setActiveView('safe-evacuation');
  };

  return (
    <div className="space-y-4">
      {/* 4 Essential Emergency Answers Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Q1: AM I SAFE? (Threat Index & Safety Assessment) - 4 Cols */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Glow Background */}
          <div
            className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none ${
              scenarioConfig.riskLevel === 'CRITICAL'
                ? 'bg-red-500'
                : scenarioConfig.riskLevel === 'HIGH'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-[11px] font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                QUESTION 1
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  scenarioConfig.riskLevel === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : scenarioConfig.riskLevel === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {scenarioConfig.riskLevel} RISK
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <span>Am I safe?</span>
            </h3>

            {/* Answer Display */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs font-mono text-slate-400">CITIZEN STATUS IN SECTOR:</div>
              <div className="text-base font-black text-slate-100 mt-0.5 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${scenarioConfig.riskLevel === 'CRITICAL' ? 'bg-red-500 animate-ping' : scenarioConfig.riskLevel === 'HIGH' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span>{scenarioConfig.safeAnswer}</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {scenarioConfig.dangerDescription}
              </p>
            </div>

            {/* Threat Gauge Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">THREAT INDEX SCORE</span>
                <span
                  className={`font-black ${
                    scenarioConfig.threatScore > 75
                      ? 'text-red-400'
                      : scenarioConfig.threatScore > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {scenarioConfig.threatScore} / 100
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    scenarioConfig.threatScore > 75
                      ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-red-glow'
                      : scenarioConfig.threatScore > 40
                      ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                  }`}
                  style={{ width: `${scenarioConfig.threatScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => setActiveView('safe-beacon')}
              className="w-full py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" /> Broadcast "I Am Safe" Ping
            </button>
          </div>
        </div>

        {/* Q2: WHAT IS HAPPENING AROUND ME? (Live Telemetry & Radar Ticker) - 4 Cols */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-[11px] font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                QUESTION 2
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                RADAR SENSORS
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-100">
              What is happening?
            </h3>

            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide mt-1">
              {scenarioConfig.threatTitle}
            </div>

            {/* Environmental Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              {scenarioConfig.telemetry.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{t.label}</span>
                      <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                    </div>
                    <div className="text-base font-black text-slate-100 mt-1">
                      {t.value}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {t.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setActiveView('recent-events')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View Regional Disaster Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveView('ask-aegis')}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> Ask AI
            </button>
          </div>
        </div>

        {/* Q3 & Q4: WHAT SHOULD I DO & WHERE SHOULD I GO? - 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Q3: WHAT SHOULD I DO? */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-[11px] font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  QUESTION 3
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
                  PRIORITY DIRECTIVES
                </span>
              </div>

              <h3 className="text-base font-black text-slate-100">
                What should I do now?
              </h3>

              <div className="space-y-1.5 mt-2.5">
                {scenarioConfig.actions.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {act.step}
                    </span>
                    <span className="leading-tight">{act.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setActiveView('survival-guide')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Open 72h Survival Checklist →
              </button>
            </div>
          </div>

          {/* Q4: WHERE SHOULD I GO? */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-[11px] font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  QUESTION 4
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  {nearestShelter.status}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-100">
                Where should I go?
              </h3>

              <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-black text-slate-100 truncate">
                  {nearestShelter.name}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> 3.8 km
                  </span>
                  <span className="text-emerald-400 font-bold">
                    +{nearestShelter.elevationMeters}m High Ground
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Capacity: {nearestShelter.availableCapacity} / {nearestShelter.totalCapacity} beds open
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={handleNavigateShelter}
                className="w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
              >
                <Navigation className="w-3.5 h-3.5" /> Navigate to Safe Shelter
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
