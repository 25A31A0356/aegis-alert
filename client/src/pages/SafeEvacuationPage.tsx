import React, { useState, useEffect } from 'react';
import {
  Navigation,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  ShieldAlert,
  Layers,
  Sliders,
  Sparkles,
  PhoneCall,
  Activity,
  AlertCircle,
  Footprints,
} from 'lucide-react';
import { Shelter, EvacuationRoute } from '@shared';
import { ActiveView } from '../types';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';
import { TacticalEvacuationMap } from '../components/evacuation/TacticalEvacuationMap';
import { RouteDetailsPanel } from '../components/evacuation/RouteDetailsPanel';
import { ShelterDirectoryPanel } from '../components/evacuation/ShelterDirectoryPanel';

interface SafeEvacuationPageProps {
  setActiveView?: (view: ActiveView) => void;
}

export const SafeEvacuationPage: React.FC<SafeEvacuationPageProps> = ({
  setActiveView = () => {},
}) => {
  const { userLocation, selectedShelterId, setSelectedShelterId } = useEmergency();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [routes, setRoutes] = useState<EvacuationRoute[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [simulatedEvacState, setSimulatedEvacState] = useState<'normal' | 'loading' | 'no-route' | 'error'>('normal');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sheltersRes, routesRes] = await Promise.all([
        ApiService.getShelters(),
        ApiService.getRoutes(),
      ]);

      if (sheltersRes.success && sheltersRes.data && sheltersRes.data.length > 0) {
        setShelters(sheltersRes.data);
        // If a shelter was pre-selected from the Home page
        if (selectedShelterId) {
          const matched = sheltersRes.data.find((s) => s.id === selectedShelterId);
          setSelectedShelter(matched || sheltersRes.data[0]);
        } else {
          setSelectedShelter(sheltersRes.data[0]);
        }
      }

      if (routesRes.success && routesRes.data) {
        setRoutes(routesRes.data);
      }
    } catch (err) {
      console.warn('[SafeEvacuation] Failed to load data, using offline fallback:', err);
    }
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setSelectedRouteIndex(0); // Select the newly computed optimal safe route
    }, 1400);
  };

  const handleSelectShelter = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setSelectedShelterId(shelter.id);
    handleRecalculate();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Top Bar with Back Button, GPS Sector & State Simulators */}
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
                  <Navigation className="w-5 h-5 text-cyan-400" />
                  <span>2. SAFE EVACUATION & HIGH-GROUND PATHFINDER</span>
                </h2>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>From: {userLocation.address} (Origin Elev. +4m)</span>
              </div>
            </div>
          </div>

          {/* Right Tags & Recalculate */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              DEMO ELEVATION ENGINE
            </div>

            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Scanning Elevation...' : 'Recalculate Routes'}</span>
            </button>
          </div>
        </div>

        {/* State Simulator Switcher Strip */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-slate-400 font-bold">TEST EVACUATION STATES:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'normal', label: 'Normal Routes' },
              { id: 'loading', label: 'Scanning Radar' },
              { id: 'no-route', label: 'No Route (Trapped)' },
              { id: 'error', label: 'Route Error' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSimulatedEvacState(st.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  simulatedEvacState === st.id
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. State-Driven View Handling */}

      {/* A. ERROR STATE BANNER */}
      {simulatedEvacState === 'error' && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 shadow-red-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-200 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-400">
                PATHFINDING SERVER TIMEOUT
              </div>
              <div className="text-xs text-red-200">
                Unable to query live topological routing service. Displaying pre-cached offline evacuation ridge corridor.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSimulatedEvacState('normal')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* B. NO ROUTE / BASIN TRAPPED STATE */}
      {simulatedEvacState === 'no-route' ? (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-red-950/60 via-slate-900 to-slate-950 border-2 border-red-500/60 shadow-red-glow text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-red-glow animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
              CRITICAL INUNDATION • ALL SURFACE ROADS IMPASSABLE
            </span>
            <h2 className="text-2xl font-black text-slate-100 mt-2">
              No Safe Ground Evacuation Route Available from Current Sector
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
              All 3 low-lying road exits in your sector are submerged under &gt;1.4m of moving floodwaters. Attempting to walk or drive through water is strictly forbidden by NDMA.
            </p>
          </div>

          {/* Life-Saving Action Steps */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-200 space-y-2">
            <div className="font-bold text-cyan-400 font-mono">MANDATORY VERTICAL EVACUATION DIRECTIVES:</div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Ascend immediately to the 2nd floor or roof of a solid concrete structure.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Disconnect main power and gas regulators before water breaches ground sockets.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Broadcast a high-priority SOS Beacon for NDRF boat/airlift rescue.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('sos-beacon')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-red-glow transition-all active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" /> Broadcast SOS Emergency Rescue
            </button>
            <button
              onClick={() => setSimulatedEvacState('normal')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors border border-slate-700"
            >
              Reset Routes
            </button>
          </div>
        </div>
      ) : (
        /* C. FULL ACTIVE EVACUATION SITUATION ROOM */
        <div className="space-y-6">
          {/* Main Grid: Left 8 Cols (Map & Routes) | Right 4 Cols (Shelters & Protocols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Tactical Map & Active Route Panel */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Tactical Vector Map */}
              <TacticalEvacuationMap
                userLocation={userLocation}
                shelters={shelters}
                selectedShelter={selectedShelter}
                onSelectShelter={handleSelectShelter}
                routes={routes}
                selectedRouteIndex={selectedRouteIndex}
                onSelectRouteIndex={setSelectedRouteIndex}
                isRecalculating={isRecalculating || simulatedEvacState === 'loading'}
              />

              {/* 2. Route Details Panel */}
              <RouteDetailsPanel
                routes={routes}
                selectedRouteIndex={selectedRouteIndex}
                onSelectRouteIndex={setSelectedRouteIndex}
                onRecalculate={handleRecalculate}
                isRecalculating={isRecalculating || simulatedEvacState === 'loading'}
              />
            </div>

            {/* Right 4 Cols: Shelter Directory Panel & Evacuation Directives */}
            <div className="lg:col-span-4 space-y-6">
              {/* 3. Shelter Directory */}
              <ShelterDirectoryPanel
                shelters={shelters}
                selectedShelter={selectedShelter}
                onSelectShelter={handleSelectShelter}
              />

              {/* 4. Evacuation Protocol Card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>EVACUATION GOLDEN RULES</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <p>
                    • <strong>Follow High Ridge Markers:</strong> Stay on elevated highway embankments. Avoid valley underpasses and creek crossings.
                  </p>
                  <p>
                    • <strong>Check-In on Arrival:</strong> Once at the shelter, broadcast your "I Am Safe" Beacon to update your family and relieve emergency queues.
                  </p>
                  <p>
                    • <strong>Emergency Helpline:</strong> If stranded mid-route, dial <strong className="text-white font-mono">112</strong> or activate the Red SOS Beacon.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Safety Notice Advisory Bottom Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Evacuation corridors are computed from topological elevation data and CWC flood risk models. Always yield to on-ground NDRF / SDRF / Police instructions.
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Demo Topological Engine v2.4
        </div>
      </div>
    </div>
  );
};
