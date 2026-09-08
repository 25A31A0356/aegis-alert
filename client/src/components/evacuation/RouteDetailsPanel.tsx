import React from 'react';
import {
  Navigation,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Footprints,
  Car,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { EvacuationRoute } from '@shared';

interface RouteDetailsPanelProps {
  routes: EvacuationRoute[];
  selectedRouteIndex: number;
  onSelectRouteIndex: (index: number) => void;
  onRecalculate: () => void;
  isRecalculating: boolean;
}

export const RouteDetailsPanel: React.FC<RouteDetailsPanelProps> = ({
  routes,
  selectedRouteIndex,
  onSelectRouteIndex,
  onRecalculate,
  isRecalculating,
}) => {
  const currentRoute = routes[selectedRouteIndex] || routes[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      {/* Header & Recalculate Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            TOPOLOGICAL PATHFINDING CORRIDORS
          </div>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 mt-0.5">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <span>Recommended Evacuation Routes</span>
          </h3>
        </div>

        <button
          onClick={onRecalculate}
          disabled={isRecalculating}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Rerouting Elevation...' : 'Recalculate Route'}</span>
        </button>
      </div>

      {/* Selectable Route Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteIndex === idx;
          const isRecommended = route.safetyStatus === 'Recommended Route';
          const isBlocked = route.safetyStatus === 'Route Blocked';

          return (
            <div
              key={route.id}
              onClick={() => onSelectRouteIndex(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? !isBlocked
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-emerald-glow'
                    : 'bg-red-950/40 border-red-500'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isRecommended
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : !isBlocked
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {route.safetyStatus}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    {route.distanceKm} km
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-100 line-clamp-1">
                  {route.name}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3 h-3 text-cyan-400" />
                    <span>{route.estimatedTimeMinutes} min walk</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3 text-emerald-400" />
                    <span>{Math.round(route.estimatedTimeMinutes * 0.35)} min</span>
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 truncate">
                {route.hazardsEnRoute.join(', ')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Route Deep-Dive & Elevation Profile */}
      {currentRoute && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                ACTIVE CORRIDOR TELEMETRY
              </div>
              <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <span>{currentRoute.name}</span>
                {currentRoute.safetyStatus !== 'Route Blocked' ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High-Ground Clearance
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 text-xs">
                    <XCircle className="w-3.5 h-3.5" /> Impassable Road
                  </span>
                )}
              </h4>
            </div>

            <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
              SIMULATED ELEVATION
            </div>
          </div>

          {/* Elevation Profile Milestones */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                ELEVATION ASCENT PROFILE
              </span>
              <span className="text-emerald-400 font-bold">+24m Gain above Basin</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { dist: '0.0 km', elev: '+4m (Origin)' },
                { dist: '1.2 km', elev: '+14m (Flyover)' },
                { dist: '2.8 km', elev: '+24m (Ridge)' },
                { dist: `${currentRoute.distanceKm} km`, elev: '+28m (Shelter)' },
              ].map((prof, i) => (
                <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-mono">{prof.dist}</div>
                  <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">
                    {prof.elev}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hazards / Safety Warnings */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
              Roadway & Terrain Conditions:
            </div>
            {currentRoute.hazardsEnRoute.map((hazard, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  {i + 1}
                </span>
                <span>{hazard}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
