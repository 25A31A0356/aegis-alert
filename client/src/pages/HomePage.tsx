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
} from 'lucide-react';
import { ActiveView } from '../types';
import {
  useEmergency,
  SECTOR_PRESETS,
  DisasterScenario,
  SimulatedState,
} from '../stores/EmergencyContext';
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
  } = useEmergency();

  const [showSimControls, setShowSimControls] = useState<boolean>(false);

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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Location, Telemetry & Simulation Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          {/* Location Sector Selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                <span>GPS SECTOR TELEMETRY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-bold">ACCURATE &plusmn;8m</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedSectorId}
                  onChange={(e) => setSelectedSectorId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-xs sm:text-sm rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 max-w-full truncate"
                >
                  {SECTOR_PRESETS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Status Tags & Simulation Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              DEMO SIMULATION ACTIVE
            </div>

            <div
              className={`px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
                isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}
              ></span>
              {isOnline ? 'LIVE MESH SYNC' : 'OFFLINE CACHED'}
            </div>

            <button
              onClick={() => setShowSimControls(!showSimControls)}
              className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showSimControls
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sim Scenarios</span>
            </button>
          </div>
        </div>

        {/* Expandable Scenario & State Simulator Drawer */}
        {showSimControls && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
            {/* Scenario Switcher */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-1.5 font-bold">
                1. DISASTER SCENARIO SWITCHER:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'FLOOD', label: 'Flood Surge', color: 'hover:border-cyan-500' },
                  { id: 'CYCLONE', label: 'Cyclone Landfall', color: 'hover:border-red-500' },
                  { id: 'EARTHQUAKE', label: 'Earthquake M5.8', color: 'hover:border-amber-500' },
                  { id: 'NORMAL', label: 'All Clear / Safe', color: 'hover:border-emerald-500' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setScenario(sc.id as DisasterScenario);
                      setSimulatedState('normal');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      scenario === sc.id && simulatedState === 'normal'
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 ' + sc.color
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard State Tester */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-1.5 font-bold">
                2. TEST APP STATES (Loading, Empty, Error, Offline):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'loading', label: 'Loading Skeleton' },
                  { id: 'empty', label: 'Empty Normal' },
                  { id: 'error', label: 'Error Banner' },
                  { id: 'offline', label: 'Offline Mesh' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleStateChange(st.id as SimulatedState)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      simulatedState === st.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
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

      {/* 2. State-Driven View Handling */}

      {/* A. ERROR STATE BANNER */}
      {(simulatedState === 'error' || error) && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 shadow-red-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-400">
                TELEMETRY SERVER UNREACHABLE
              </div>
              <div className="text-xs text-red-200">
                Operating in local autonomous mode. Cached emergency shelters and offline protocols remain 100% active.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSimulatedState('normal');
                refreshEmergencyData();
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
            </button>
            <button
              onClick={() => handleStateChange('offline')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              Use Offline Mode
            </button>
          </div>
        </div>
      )}

      {/* B. OFFLINE MESH STATE NOTIFICATION */}
      {(!isOnline || simulatedState === 'offline') && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-amber-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <WifiOff className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                OFFLINE ZERO-INTERNET MESH MODE ACTIVE
              </div>
              <div className="text-xs text-amber-200/90">
                Last verified telemetry cached 12 mins ago. SOS Beacon and "I Am Safe" will automatically fall back to direct emergency SMS if cellular data fails.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveView('safe-beacon')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            Generate Offline SMS Check-In
          </button>
        </div>
      )}

      {/* C. LOADING SKELETON STATE */}
      {(isLoading || simulatedState === 'loading') ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 h-64 rounded-2xl bg-slate-850 border border-slate-800" />
            <div className="lg:col-span-4 h-64 rounded-2xl bg-slate-850 border border-slate-800" />
            <div className="lg:col-span-4 h-64 rounded-2xl bg-slate-850 border border-slate-800" />
          </div>
          <div className="h-28 rounded-2xl bg-slate-850 border border-slate-800" />
          <div className="h-56 rounded-2xl bg-slate-850 border border-slate-800" />
        </div>
      ) : simulatedState === 'empty' || scenario === 'NORMAL' ? (
        /* D. EMPTY / NORMAL ALL-CLEAR STATE */
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ALL CLEAR • CONDITIONS NORMAL
              </span>
              <h2 className="text-2xl font-black text-slate-100 mt-2">
                No Active Severe Hazards Detected in Your Sector
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
                {currentSector.name} is currently safe with normal meteorological and river discharge parameters. Use this calm window to verify your 72-hour survival kit.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('survival-guide')}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" /> Review 72h Disaster Kit Checklist
              </button>
              <button
                onClick={() => setActiveView('safe-beacon')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition-colors"
              >
                Send Peace-of-Mind "I Am Safe" Ping
              </button>
            </div>
          </div>

          {/* Quick Action Grid */}
          <QuickActionGrid setActiveView={setActiveView} />

          {/* Shelters Directory */}
          <NearbySheltersList setActiveView={setActiveView} />
        </div>
      ) : (
        /* E. FULL ACTIVE EMERGENCY DASHBOARD */
        <div className="space-y-6">
          {/* 1. Core 4-Questions Hero Status */}
          <HomeHeroStatus setActiveView={setActiveView} />

          {/* 2. Quick Action Tactical Command Grid */}
          <QuickActionGrid setActiveView={setActiveView} />

          {/* 3. Nearby High-Ground Shelters Directory */}
          <NearbySheltersList setActiveView={setActiveView} />

          {/* 4. Active Regional Disaster Intelligence Feed */}
          <ActiveAlertsFeed setActiveView={setActiveView} />
        </div>
      )}

      {/* Emergency Helpline Bottom Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            National Disaster Helpline: <strong className="text-slate-100 font-mono">1078</strong> | NDRF Command: <strong className="text-slate-100 font-mono">1070</strong> | State Emergency: <strong className="text-slate-100 font-mono">112</strong>
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Official NDMA & IMD Disaster Management Advisory Feeds
        </div>
      </div>
    </div>
  );
};
