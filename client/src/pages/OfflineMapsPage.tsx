import React, { useState } from 'react';
import {
  MapPin,
  Download,
  Layers,
  CheckCircle2,
  HardDriveDownload,
  ShieldCheck,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { useEmergency } from '../stores/EmergencyContext';

export const OfflineMapsPage: React.FC = () => {
  const { userLocation } = useEmergency();
  const [cachedSectors, setCachedSectors] = useState([
    {
      id: 'sec_01',
      name: 'Visakhapatnam Metropolitan & Port Sector',
      size: '14.2 MB',
      isCached: true,
      lastUpdated: '2026-09-08 08:30 IST',
      sheltersCount: 18,
    },
    {
      id: 'sec_02',
      name: 'Anakapalli & Rushikonda Coastal Lowlands',
      size: '9.8 MB',
      isCached: false,
      lastUpdated: 'Available for Download',
      sheltersCount: 12,
    },
    {
      id: 'sec_03',
      name: 'Kakinada Estuary & Flood Basin',
      size: '18.5 MB',
      isCached: false,
      lastUpdated: 'Available for Download',
      sheltersCount: 24,
    },
  ]);

  const toggleSector = (id: string) => {
    setCachedSectors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isCached: !s.isCached } : s))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <MapPin className="w-5 h-5" />
            <span>OFFLINE MAPS & GEOGRAPHIC CACHE</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Locally stored offline topographic maps, elevation contours, safe corridors, and shelter coordinates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-green px-3 py-1 rounded-xl text-xs font-mono font-bold">
            DEMO GEOGRAPHIC LAYER
          </span>
        </div>
      </div>

      {/* Offline Map Interactive Canvas */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 h-96 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        {/* Map Header Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Topographic Elevation Map • Offline Ready</span>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
            ZOOM: 14x (VECTOR)
          </span>
        </div>

        {/* Mock Map Features Layer */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-cyan-glow animate-pulse">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">Visakhapatnam Coastal Sector #01</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              18 Shelters • 4 Flood Risk Polygons • 3 Elevation Ridges Cached
            </div>
          </div>
        </div>

        {/* Map Footer Bar */}
        <div className="relative z-10 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Cached Tile Storage: 14.2 MB on Device</span>
          <span className="text-emerald-400 font-bold">100% Offline Accessible</span>
        </div>
      </div>

      {/* Regional Sector Download Manager */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
          Downloadable Regional Map Packs
        </h3>

        <div className="space-y-3">
          {cachedSectors.map((sec) => (
            <div
              key={sec.id}
              className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>{sec.name}</span>
                  {sec.isCached && (
                    <span className="badge-green text-[9px] font-bold px-1.5 py-0.2 rounded">
                      Downloaded
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Size: {sec.size} • Shelters: {sec.sheltersCount} • Status: {sec.lastUpdated}
                </div>
              </div>

              <button
                onClick={() => toggleSector(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  sec.isCached
                    ? 'bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-300'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{sec.isCached ? 'Remove from Cache' : 'Download Sector Map'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
