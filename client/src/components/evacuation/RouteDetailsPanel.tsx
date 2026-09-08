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
import {
  TicketAlpineScenicSvg,
  TicketSkyScenicSvg,
  TicketSunsetScenicSvg,
} from '../common/ScenicIllustrations';

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
  const getTicketBackground = (index: number) => {
    switch (index % 3) {
      case 0:
        return <TicketAlpineScenicSvg className="w-full h-full object-cover opacity-75 dark:opacity-40" />;
      case 1:
        return <TicketSkyScenicSvg className="w-full h-full object-cover opacity-75 dark:opacity-40" />;
      case 2:
      default:
        return <TicketSunsetScenicSvg className="w-full h-full object-cover opacity-75 dark:opacity-40" />;
    }
  };

  const getCenterIconColor = (index: number) => {
    switch (index % 3) {
      case 0:
        return 'text-emerald-600 dark:text-emerald-400';
      case 1:
        return 'text-blue-600 dark:text-blue-400';
      case 2:
      default:
        return 'text-amber-600 dark:text-amber-400';
    }
  };

  const getSectorCode = (index: number) => {
    const codes = ['SEC 04', 'SEC 07', 'SEC 12', 'SEC 02'];
    return codes[index % codes.length];
  };

  const getShelterCode = (index: number) => {
    const codes = ['SHL 01', 'SHL 03', 'SHL 05', 'SHL 02'];
    return codes[index % codes.length];
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Find Your Routes
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Verified high-ground corridors with live elevation profiles
          </p>
        </div>

        <button
          type="button"
          onClick={onRecalculate}
          disabled={isRecalculating}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Scanning...' : 'Refresh GPS'}</span>
        </button>
      </div>

      {/* Selectable Route "Ticket" Cards (Direct Screen 2 Reference Match) */}
      <div className="space-y-3.5">
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
              className={`relative rounded-[28px] overflow-hidden cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? 'border-2 border-cyan-500 shadow-lg ring-4 ring-cyan-500/15 scale-[1.01]'
                  : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Background Scenic Illustration */}
              <div className="absolute inset-0 z-0">
                {getTicketBackground(idx)}
              </div>

              {/* Card Foreground Content */}
              <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[150px]">
                {/* Top Row: Origin City/Sector -> Directional Center Waypoint -> Destination Shelter */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left Origin Column (ATL / SEC 04 style) */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate block">
                      Sector 04 Lowlands
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight block">
                      {getSectorCode(idx)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                      Dep: 07:30 AM
                    </span>
                  </div>

                  {/* Center Directional Waypoint Connector (Flight Dot Icon in Mockup) */}
                  <div className="flex flex-col items-center justify-center shrink-0 px-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200/60 dark:border-slate-700 flex items-center justify-center">
                      <Navigation className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rotate-45 ${getCenterIconColor(idx)}`} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300 mt-1 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700 shadow-xs">
                      {route.distanceKm} km
                    </span>
                  </div>

                  {/* Right Destination Column (LAX / SHL 01 style) */}
                  <div className="flex-1 min-w-0 text-right">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate block">
                      {destinationName.slice(0, 16)}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight block">
                      {getShelterCode(idx)}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                      Arrival: +{route.estimatedTimeMinutes}m
                    </span>
                  </div>
                </div>

                {/* Bottom Row: ETA times, elevation gain chip, safety status */}
                <div className="pt-3.5 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1 font-bold">
                      <Footprints className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{route.estimatedTimeMinutes}m walk</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{Math.round(route.estimatedTimeMinutes * 0.35)}m drive</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600">
                      +28m Elevation
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isRecommended
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                          : !isBlocked
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300'
                          : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-300'
                      }`}
                    >
                      {route.safetyStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
