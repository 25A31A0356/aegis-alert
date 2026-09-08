import React from 'react';
import {
  Home,
  MapPin,
  CheckCircle2,
  Phone,
  Shield,
  Droplets,
  HeartPulse,
  Zap,
  Utensils,
  Navigation,
} from 'lucide-react';
import { Shelter } from '@shared';

interface ShelterDirectoryPanelProps {
  shelters: Shelter[];
  selectedShelter: Shelter | null;
  onSelectShelter: (shelter: Shelter) => void;
}

export const ShelterDirectoryPanel: React.FC<ShelterDirectoryPanelProps> = ({
  shelters,
  selectedShelter,
  onSelectShelter,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      <div>
        <div className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          DESTINATION SELECTOR
        </div>
        <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 mt-0.5">
          <Home className="w-5 h-5 text-emerald-400" />
          <span>Verified High-Ground Shelters</span>
        </h3>
      </div>

      <div className="space-y-3">
        {shelters.map((shelter) => {
          const isSelected = selectedShelter?.id === shelter.id;
          const occupancyPercent = Math.round(
            (shelter.occupiedCapacity / shelter.totalCapacity) * 100
          );
          const isNearlyFull = occupancyPercent >= 80;

          return (
            <div
              key={shelter.id}
              onClick={() => onSelectShelter(shelter)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-emerald-glow ring-1 ring-emerald-500'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      shelter.status === 'OPEN'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : shelter.status === 'NEAR_CAPACITY'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}
                  >
                    {shelter.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    +{shelter.elevationMeters}m MSL
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-100 line-clamp-1">
                  {shelter.name}
                </h4>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{shelter.location}</span>
                </div>

                {/* Occupancy bar */}
                <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-400">BED CAPACITY</span>
                    <span className={isNearlyFull ? 'text-amber-400' : 'text-emerald-400'}>
                      {shelter.occupiedCapacity}/{shelter.totalCapacity} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isNearlyFull ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Amenities Icons */}
                <div className="flex items-center gap-2.5 mt-2.5 text-slate-400 text-[10px]">
                  {shelter.amenities.drinkingWater && (
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> Water
                    </span>
                  )}
                  {shelter.amenities.medicalStation && (
                    <span className="flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-red-400" /> Medical
                    </span>
                  )}
                  {shelter.amenities.powerBackup && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Generator
                    </span>
                  )}
                  {shelter.amenities.foodSupply && (
                    <span className="flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-emerald-400" /> Food
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShelter(shelter);
                  }}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Destination Selected' : 'Route to Shelter'}</span>
                </button>
                <a
                  href={`tel:${shelter.contactNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors shrink-0"
                  title={`Call Shelter Command: ${shelter.contactNumber}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
