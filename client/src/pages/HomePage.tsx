import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Sliders,
  ShieldCheck,
  AlertCircle,
  WifiOff,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Droplets,
  Activity,
  MessageSquare,
  Search,
  User,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { ActiveView } from '../types';
import {
  useEmergency,
  SECTOR_PRESETS,
  DisasterScenario,
  SimulatedState,
} from '../stores/EmergencyContext';
import { useSettings } from '../stores/SettingsContext';
import { HomeHeroStatus } from '../components/home/HomeHeroStatus';
import { QuickActionGrid } from '../components/home/QuickActionGrid';
import { NearbySheltersList } from '../components/home/NearbySheltersList';
import { ActiveAlertsFeed } from '../components/home/ActiveAlertsFeed';

interface HomePageProps {
  setActiveView: (view: ActiveView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveView }) => {
  const {
    userLocation,
    selectedSectorId,
    setSelectedSectorId,
    scenario,
    setScenario,
    isOnline,
    setIsOnline,
    isLoading,
    error,
    simulatedState,
    setSimulatedState,
    refreshEmergencyData,
    alerts,
  } = useEmergency();

  const { profile } = useSettings();
  const [showSimControls, setShowSimControls] = useState<boolean>(false);
  const [askQuery, setAskQuery] = useState<string>('');

  const currentSector = SECTOR_PRESETS.find((s) => s.id === selectedSectorId) || SECTOR_PRESETS[0];

  // Handle Simulated State Changes
  const handleStateChange = (state: SimulatedState) => {
    setSimulatedState(state);
    if (state === 'offline') {
      setIsOnline(false);
    } else {
      setIsOnline(true);
    }
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('ask-aegis');
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-24 max-w-4xl mx-auto">
      {/* 1. Header Greeting Section (Screen 1 Reference) */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Good Day{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome to AegisAlert emergency network
          </p>
        </div>

        {/* Citizen Avatar with Live Signal Indicator */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-sm">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-cyan-500" />}
            </div>
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </div>
      </div>

      {/* 2. Quick Action Tiles (Screen 1 Reference) */}
      <QuickActionGrid setActiveView={setActiveView} />

      {/* 3. "Ask Aegis for..." Capsule Prompt Bar (Screen 1 Reference) */}
      <form onSubmit={handleAskSubmit} className="relative">
        <div
          onClick={() => setActiveView('ask-aegis')}
          className="w-full bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200/80 dark:hover:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3.5 flex items-center justify-between text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
              Ask Aegis for flood rules, shelters, safety advice...
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            24/7 AI
          </span>
        </div>
      </form>

      {/* 4. "In Seasons Guide" / Hero Disaster Feature Card (Screen 1 Reference) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>In Seasons Guide</span>
          </h2>
          <button
            type="button"
            onClick={() => setActiveView('survival-guide')}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-bold flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Atmospheric Hero Card */}
        <div
          onClick={() => setActiveView('safe-evacuation')}
          className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 text-white shadow-xl cursor-pointer group transition-transform active:scale-99"
        >
          {/* Subtle Mountain / Coastal Silhouette Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent opacity-80" />
          
          <div className="relative z-10 flex flex-col justify-between h-48 sm:h-52">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-black tracking-wider uppercase backdrop-blur-md">
                HIGH-GROUND EVACUATION
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4 text-cyan-300" />
              </div>
            </div>

            <div className="space-y-2 max-w-lg">
              <h3 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight leading-tight">
                Your ultimate disaster response companion awaits with Aegis
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                Real-time elevation mapping, safe high-ground corridors, and verified NDMA relief centers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Situational Status & Core Risk Meter */}
      <HomeHeroStatus setActiveView={setActiveView} />

      {/* 6. Nearby Shelters List */}
      <NearbySheltersList setActiveView={setActiveView} />

      {/* 7. Active Alerts Feed */}
      <ActiveAlertsFeed setActiveView={setActiveView} />

      {/* 8. Location Sector Telemetry & Simulation Drawer */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold flex items-center gap-1.5">
                <span>GPS SECTOR TELEMETRY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {currentSector.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedSectorId}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {SECTOR_PRESETS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowSimControls(!showSimControls)}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                showSimControls
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Disaster Simulation Scenarios"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Scenario Drawer */}
        {showSimControls && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
            <div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                DISASTER SCENARIO:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'FLOOD', label: 'Flood Surge' },
                  { id: 'CYCLONE', label: 'Cyclone Landfall' },
                  { id: 'EARTHQUAKE', label: 'Earthquake M5.8' },
                  { id: 'NORMAL', label: 'All Clear' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setScenario(sc.id as DisasterScenario);
                      setSimulatedState('normal');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      scenario === sc.id && simulatedState === 'normal'
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                NETWORK & STATE:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'loading', label: 'Loading State' },
                  { id: 'empty', label: 'Empty State' },
                  { id: 'error', label: 'Error Banner' },
                  { id: 'offline', label: 'Offline Mesh' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStateChange(st.id as SimulatedState)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      simulatedState === st.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Helpline Bottom Strip */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <PhoneCall className="w-4 h-4 text-cyan-500 shrink-0" />
          <span>
            Disaster Helpline: <strong className="text-slate-900 dark:text-slate-100 font-mono">1078</strong> | Emergency: <strong className="text-slate-900 dark:text-slate-100 font-mono">112</strong> | Ambulance: <strong className="text-slate-900 dark:text-slate-100 font-mono">108</strong>
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          NDMA & IMD CAP-V1.2
        </div>
      </div>
    </div>
  );
};
