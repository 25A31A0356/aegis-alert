import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Home,
  MapPin,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Droplets,
  Phone,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { Shelter, EvacuationRoute } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';

export const SafeEvacuationPage: React.FC = () => {
  const { userLocation } = useEmergency();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [routes, setRoutes] = useState<EvacuationRoute[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  useEffect(() => {
    loadEvacuationData();
  }, []);

  const loadEvacuationData = async () => {
    const [sheltersRes, routesRes] = await Promise.all([
      ApiService.getShelters(),
      ApiService.getRoutes(),
    ]);

    if (sheltersRes.success && sheltersRes.data) {
      setShelters(sheltersRes.data);
      if (sheltersRes.data.length > 0) {
        setSelectedShelter(sheltersRes.data[0]);
      }
    }
    if (routesRes.success && routesRes.data) {
      setRoutes(routesRes.data);
    }
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Navigation className="w-5 h-5" />
            <span>2. SAFE EVACUATION & SHELTER NAVIGATOR</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Elevation-aware routes, high-ground verified disaster shelters, and flood hazard avoidance.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Recalculating Safe Routes...' : 'Recalculate Routes'}</span>
        </button>
      </div>

      {/* Safety Notice Advisory */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold">CAUTION:</span> Evacuation routes reflect modeled flood risk contours and crowd reports. Always obey NDRF / SDRF barricades and on-ground emergency police directions.
        </div>
      </div>

      {/* Main Grid: Tactical Map Representation & Shelters List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evacuation Map Canvas & Active Route Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tactical Vector Route Visualizer */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 h-80 flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Map Top Indicators */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-slate-200">Origin: User GPS ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                HIGH ELEVATION CORRIDOR (+48.5m)
              </div>
            </div>

            {/* Visual Route Path Simulation */}
            <div className="relative z-10 my-auto flex items-center justify-between px-6">
              {/* User Node */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center font-bold text-xs shadow-cyan-glow animate-pulse">
                  YOU
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">Low Elevation</span>
              </div>

              {/* Waypoint 1 */}
              <div className="flex-1 h-1 bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-500 mx-2 relative">
                <div className="absolute -top-3 left-1/3 text-[9px] font-mono bg-slate-900 px-1 rounded text-amber-300 border border-slate-700">
                  Avoid Underpass (-2.1m)
                </div>
              </div>

              {/* Shelter Node */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center text-lg shadow-lg">
                  🏠
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1">Safe Shelter</span>
              </div>
            </div>

            {/* Active Route Telemetry Footer */}
            <div className="relative z-10 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">RECOMMENDED ROUTE</div>
                  <div className="font-bold text-slate-100">Ridge Highway via Kailasagiri Sector</div>
                </div>
                <div className="hidden sm:block border-l border-slate-800 pl-4">
                  <div className="text-[10px] text-slate-400 font-mono">DISTANCE</div>
                  <div className="font-bold text-cyan-400">4.2 km</div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-[10px] text-slate-400 font-mono">EST. TIME</div>
                  <div className="font-bold text-emerald-400">14 mins (Walking/Vehicle)</div>
                </div>
              </div>

              <span className="badge-green px-2 py-1 rounded text-[10px] font-bold">
                Potentially Safer Route
              </span>
            </div>
          </div>

          {/* Route Options Comparison Cards */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Calculated Route Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option A */}
              <div
                onClick={() => setActiveRouteIndex(0)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeRouteIndex === 0
                    ? 'bg-cyan-500/10 border-cyan-500 text-slate-100 shadow-cyan-glow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">Route 1: Ridge Highway</span>
                  <span className="badge-green text-[9px] font-bold px-1.5 py-0.5 rounded">Recommended</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  Avoids coastal lowlands. Road surface dry and monitored by SDRF traffic controllers.
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Distance: 4.2 km</span>
                  <span className="text-emerald-400 font-bold">ETA: 14 mins</span>
                </div>
              </div>

              {/* Option B */}
              <div
                onClick={() => setActiveRouteIndex(1)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeRouteIndex === 1
                    ? 'bg-cyan-500/10 border-cyan-500 text-slate-100 shadow-cyan-glow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">Route 2: Beach Road Link</span>
                  <span className="badge-orange text-[9px] font-bold px-1.5 py-0.5 rounded">Route Affected</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  0.4m waterlogging reported at RK Beach underpass. 4x4 or emergency vehicles only.
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Distance: 3.1 km</span>
                  <span className="text-amber-400 font-bold">ETA: 26 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Verified Shelters Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Verified High-Ground Shelters
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {shelters.length} SHELTERS ONLINE
            </span>
          </div>

          <div className="space-y-3">
            {shelters.map((shelter) => (
              <div
                key={shelter.id}
                onClick={() => setSelectedShelter(shelter)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedShelter?.id === shelter.id
                    ? 'bg-slate-850 border-cyan-500/60 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{shelter.name}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{shelter.location}</span>
                    </div>
                  </div>
                  <span className="badge-green text-[9px] font-bold px-2 py-0.5 rounded">
                    {shelter.status}
                  </span>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="text-emerald-400 font-bold">
                      {shelter.availableCapacity} / {shelter.totalCapacity} Available
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${(shelter.occupiedCapacity / shelter.totalCapacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Amenities Pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300 font-mono mb-3">
                  {shelter.amenities.drinkingWater && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      💧 Water
                    </span>
                  )}
                  {shelter.amenities.medicalStation && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      🏥 Medical
                    </span>
                  )}
                  {shelter.amenities.powerBackup && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      ⚡ Generator
                    </span>
                  )}
                  {shelter.amenities.foodSupply && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      🍲 Rations
                    </span>
                  )}
                </div>

                {/* Contact & Action */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <a
                    href={`tel:${shelter.contactNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> {shelter.contactNumber}
                  </a>
                  <span className="text-slate-400 font-mono">Elev: +{shelter.elevationMeters}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
