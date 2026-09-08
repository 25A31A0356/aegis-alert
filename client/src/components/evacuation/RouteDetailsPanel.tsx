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
  MapPin,
  Building,
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
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available Evacuation Corridors
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Real-time elevation corridors mapped from low-lying origin to high-ground shelters
          </p>
        </div>

        <button
          type="button"
          onClick={onRecalculate}
          disabled={isRecalculating}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Scanning...' : 'Recalculate'}</span>
        </button>
      </div>

      {/* Selectable Route "Ticket" Cards (Matching Screen 2 Reference) */}
      <div className="space-y-3">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteIndex === idx;
          const isRecommended = route.safetyStatus === 'Recommended Route';
          const isBlocked = route.safetyStatus === 'Route Blocked';

          // Extract shelter or destination name
          const destinationName = route.name.includes('to ')
            ? route.name.split('to ')[1]
            : route.name;

          return (
            <div
              key={route.id}
              onClick={() => onSelectRouteIndex(idx)}
              className={`route-ticket-card p-4 sm:p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-cyan-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-cyan-500/20'
                  : 'border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Top Row: Origin, Plane/Arrow Waypoint, Destination (Screen 2 Mockup) */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                {/* Left Origin */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-slate-400 font-semibold truncate">
                    Current Sector
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    SEC 04
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                    Elev: +4m
                  </div>
                </div>

                {/* Center Connector / Elevation Gain */}
                <div className="flex flex-col items-center justify-center px-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-[9px] font-mono font-black mb-1">
                    +24m ▲
                  </span>
                  <div className="flex items-center gap-1 text-cyan-500">
                    <span className="w-8 sm:w-12 h-0.5 bg-cyan-400/40" />
                    <Navigation className="w-3.5 h-3.5 text-cyan-500 rotate-90" />
                    <span className="w-8 sm:w-12 h-0.5 bg-cyan-400/40" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 font-bold">
                    {route.distanceKm} km
                  </span>
                </div>

                {/* Right Destination */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-[11px] font-mono text-slate-400 font-semibold truncate">
                    Safe Shelter
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    {destinationName.slice(0, 10).toUpperCase()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-0.5 truncate">
                    Elev: +28m
                  </div>
                </div>
              </div>

              {/* Bottom Row: Departure / ETA time, Walking & Vehicle duration, Status Badge */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-bold">
                    <Footprints className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{route.estimatedTimeMinutes} min walk</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <Car className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{Math.round(route.estimatedTimeMinutes * 0.35)} min drive</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isRecommended
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40'
                        : !isBlocked
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40'
                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/40'
                    }`}
                  >
                    {route.safetyStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Corridor Deep-Dive Details */}
      {currentRoute && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
              SELECTED CORRIDOR SAFETY BREAKDOWN
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Topographic Engine v2.4
            </span>
          </div>

          <div className="text-sm font-black text-slate-900 dark:text-slate-100">
            {currentRoute.name}
          </div>

          {/* Elevation Ascent Points */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { label: 'Origin Point', dist: '0.0 km', elev: '+4m' },
              { label: 'Flyover Highway', dist: '1.2 km', elev: '+14m' },
              { label: 'Highland Ridge', dist: '2.4 km', elev: '+24m' },
              { label: 'Shelter Crest', dist: `${currentRoute.distanceKm} km`, elev: '+28m' },
            ].map((p, i) => (
              <div
                key={i}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center"
              >
                <div className="text-[10px] text-slate-400 font-mono">{p.label}</div>
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {p.elev}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">{p.dist}</div>
              </div>
            ))}
          </div>

          {/* Road Conditions */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase">
              Terrain & Hazard Advisories:
            </div>
            {currentRoute.hazardsEnRoute.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  {i + 1}
                </span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
