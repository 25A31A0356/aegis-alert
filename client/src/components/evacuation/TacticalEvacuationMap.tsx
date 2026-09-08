import React, { useState } from 'react';
import {
  MapPin,
  Home,
  AlertTriangle,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Navigation2,
  ShieldCheck,
  Droplets,
  Eye,
  EyeOff,
  Maximize2,
} from 'lucide-react';
import { Shelter, EvacuationRoute, GeoCoordinate } from '@shared';

interface TacticalEvacuationMapProps {
  userLocation: GeoCoordinate;
  shelters: Shelter[];
  selectedShelter: Shelter | null;
  onSelectShelter: (shelter: Shelter) => void;
  routes: EvacuationRoute[];
  selectedRouteIndex: number;
  onSelectRouteIndex: (index: number) => void;
  isRecalculating?: boolean;
}

export const TacticalEvacuationMap: React.FC<TacticalEvacuationMapProps> = ({
  userLocation,
  shelters,
  selectedShelter,
  onSelectShelter,
  routes,
  selectedRouteIndex,
  onSelectRouteIndex,
  isRecalculating = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showInundationLayer, setShowInundationLayer] = useState<boolean>(true);
  const [showElevationHeatmap, setShowElevationHeatmap] = useState<boolean>(true);

  // Fallback demo routes matching shared contract
  const activeRoutes: EvacuationRoute[] = routes.length > 0 ? routes : [
    {
      id: 'route-1',
      name: 'Ridge Highway Safe Corridor',
      origin: userLocation,
      destination: { lat: 17.7012, lng: 83.2281, address: 'APSDMA High-Ground Shelter' },
      destinationShelterId: selectedShelter?.id || 'shelter-1',
      distanceKm: 4.2,
      estimatedTimeMinutes: 18,
      safetyStatus: 'Recommended Route',
      hazardsEnRoute: ['Zero waterlogging on elevated ridge'],
      waypoints: [
        [17.6868, 83.2185],
        [17.693, 83.222],
        [17.7012, 83.2281],
      ],
      isSimulated: true,
    },
    {
      id: 'route-2',
      name: 'Eastern Bypass Outer Ring',
      origin: userLocation,
      destination: { lat: 17.7012, lng: 83.2281, address: 'APSDMA High-Ground Shelter' },
      destinationShelterId: selectedShelter?.id || 'shelter-1',
      distanceKm: 5.8,
      estimatedTimeMinutes: 26,
      safetyStatus: 'Potentially Safer Route',
      hazardsEnRoute: ['Minor 10cm puddling near canal culvert'],
      waypoints: [
        [17.6868, 83.2185],
        [17.689, 83.235],
        [17.7012, 83.2281],
      ],
      isSimulated: true,
    },
    {
      id: 'route-3',
      name: 'Coastal Creek Low Road (BLOCKED)',
      origin: userLocation,
      destination: { lat: 17.7012, lng: 83.2281, address: 'APSDMA High-Ground Shelter' },
      destinationShelterId: selectedShelter?.id || 'shelter-1',
      distanceKm: 3.1,
      estimatedTimeMinutes: 45,
      safetyStatus: 'Route Blocked',
      hazardsEnRoute: ['IMPASSABLE: 1.8m flash flood water depth', 'Road washed out'],
      waypoints: [
        [17.6868, 83.2185],
        [17.691, 83.219],
        [17.7012, 83.2281],
      ],
      isSimulated: true,
    },
  ];

  return (
    <div className="relative rounded-3xl bg-slate-950 border border-slate-800 h-[440px] overflow-hidden shadow-2xl flex flex-col justify-between group">
      {/* Background Tactical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Map Status Bar */}
      <div className="relative z-10 p-3.5 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>TACTICAL ELEVATION RADAR</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
            <span>ORIGIN:</span>
            <strong className="text-slate-200">{userLocation.lat.toFixed(2)}° N, {userLocation.lng.toFixed(2)}° E</strong>
          </div>
        </div>

        {/* Layer Toggles & Map Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInundationLayer(!showInundationLayer)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all ${
              showInundationLayer
                ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800'
            }`}
            title="Toggle Flood Danger Polygons"
          >
            <Droplets className="w-3 h-3 text-red-400" />
            <span>Flood Zones</span>
          </button>

          <button
            onClick={() => setShowElevationHeatmap(!showElevationHeatmap)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all ${
              showElevationHeatmap
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800'
            }`}
            title="Toggle High Ground Elevation Contours"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>High Ground</span>
          </button>

          <div className="flex items-center bg-slate-900/90 rounded-lg border border-slate-800 p-0.5 ml-1">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
              className="p-1 text-slate-400 hover:text-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
              className="p-1 text-slate-400 hover:text-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas for High-Ground Vector Trajectories & Hazard Overlays */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg className="w-full h-full" viewBox="0 0 800 500" fill="none">
          <defs>
            {/* Safe Route Gradient */}
            <linearGradient id="safeRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Caution Route Gradient */}
            <linearGradient id="cautionRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Inundation Pattern */}
            <pattern id="floodHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.4" />
            </pattern>

            {/* Elevation Contour Pattern */}
            <radialGradient id="highGroundContour" cx="70%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.12" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. High-Ground Elevation Contour Zones */}
          {showElevationHeatmap && (
            <g className="animate-fadeIn">
              <ellipse cx="600" cy="180" rx="190" ry="140" fill="url(#highGroundContour)" />
              <ellipse cx="640" cy="160" rx="110" ry="80" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
              <text x="620" y="100" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                HIGH RIDGE (+28m to +45m)
              </text>
            </g>
          )}

          {/* 2. Submerged Flood Danger Polygons */}
          {showInundationLayer && (
            <g className="animate-fadeIn">
              {/* Creek Basin Flooding Zone */}
              <polygon
                points="220,290 380,270 420,380 260,420"
                fill="url(#floodHatch)"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />
              <rect x="250" y="320" width="130" height="22" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
              <text x="258" y="335" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
                ⚠️ FLOOD BASIN (+1.8m)
              </text>

              {/* Coastal Tidal Inlet Zone */}
              <polygon
                points="80,180 200,160 230,240 100,260"
                fill="url(#floodHatch)"
                stroke="#f97316"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            </g>
          )}

          {/* 3. Route C: Low Road (BLOCKED) */}
          <path
            d="M 180 340 Q 280 350, 360 330 T 580 180"
            stroke="#ef4444"
            strokeWidth={selectedRouteIndex === 2 ? 4 : 2}
            strokeDasharray="6 6"
            strokeOpacity={selectedRouteIndex === 2 ? 0.9 : 0.4}
          />

          {/* 4. Route B: Eastern Bypass (CAUTION) */}
          <path
            d="M 180 340 Q 320 420, 500 340 T 580 180"
            stroke="url(#cautionRouteGrad)"
            strokeWidth={selectedRouteIndex === 1 ? 5 : 2.5}
            strokeDasharray={selectedRouteIndex === 1 ? 'none' : '4 4'}
            strokeOpacity={selectedRouteIndex === 1 ? 1 : 0.5}
          />

          {/* 5. Route A: Ridge Highway Corridor (RECOMMENDED - HIGH GROUND) */}
          <path
            d="M 180 340 Q 260 210, 420 190 T 580 180"
            stroke="url(#safeRouteGrad)"
            strokeWidth={selectedRouteIndex === 0 ? 6 : 3}
            strokeOpacity={selectedRouteIndex === 0 ? 1 : 0.6}
            filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))"
          />

          {/* Route Elevation Waypoint Checkpoints */}
          <circle cx="180" cy="340" r="7" fill="#06b6d4" stroke="#fff" strokeWidth="2" />
          <circle cx="340" cy="205" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
          <text x="315" y="190" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            RIDGE ELEVATION (+24m)
          </text>
        </svg>
      </div>

      {/* Interactive Overlay Markers for Shelters and Citizen */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Origin: Citizen Location Marker */}
        <div
          className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
          style={{ left: '22.5%', top: '68%' }}
        >
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-cyan-glow animate-pulse">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/95 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-lg">
            YOU (Elev. +4m)
          </div>
        </div>

        {/* Destination: Shelter 1 (APSDMA Central) */}
        <div
          onClick={() => shelters[0] && onSelectShelter(shelters[0])}
          className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group/shelter transition-transform hover:scale-110"
          style={{ left: '72.5%', top: '36%' }}
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-emerald-glow">
            <Home className="w-5 h-5" />
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded bg-slate-900/95 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 font-bold whitespace-nowrap shadow-xl flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>APSDMA Cyclone Shelter (+28m)</span>
          </div>
        </div>

        {/* Secondary Shelter 2 (St. Aloysius Hall) */}
        <div
          onClick={() => shelters[1] && onSelectShelter(shelters[1])}
          className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group/shelter transition-transform hover:scale-110"
          style={{ left: '80%', top: '62%' }}
        >
          <div className="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-amber-400 shadow-md">
            <Home className="w-4 h-4" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[9px] font-mono text-slate-300 font-bold whitespace-nowrap">
            St. Aloysius Hall (+35m)
          </div>
        </div>
      </div>

      {/* Recalculating Pathfinding Scan Overlay */}
      {isRecalculating && (
        <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <Navigation2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center">
            <div className="text-sm font-black text-slate-100 font-mono tracking-wider">
              COMPUTING ELEVATION-OPTIMIZED ROUTE...
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Evaluating CWC flood hydrographs & topological ridge clearance
            </div>
          </div>
        </div>
      )}

      {/* Bottom Map Legend Strip */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-400 rounded-full"></span>
            <span>Recommended Route (High Ground)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-400 rounded-full"></span>
            <span>Alternate Corridor</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-red-500 border border-dashed rounded-full"></span>
            <span>Flooded Road (Impasse)</span>
          </span>
        </div>

        <div className="text-cyan-400 font-bold">
          [SIMULATED TOPOLOGICAL VECTOR ENGINE]
        </div>
      </div>
    </div>
  );
};
