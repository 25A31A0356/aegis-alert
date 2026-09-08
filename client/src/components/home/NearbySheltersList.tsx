import React from 'react';
import {
  Home,
  MapPin,
  Navigation,
  CheckCircle2,
  Users,
  Shield,
  Phone,
  Zap,
  Droplets,
  HeartPulse,
  Utensils,
  ArrowUpRight,
} from 'lucide-react';
import { Shelter } from '@shared';
import { ActiveView } from '../../types';
import { useEmergency } from '../../stores/EmergencyContext';

interface NearbySheltersListProps {
  setActiveView: (view: ActiveView) => void;
}

export const NearbySheltersList: React.FC<NearbySheltersListProps> = ({ setActiveView }) => {
  const { shelters, setSelectedShelterId } = useEmergency();

  // Fallback demo shelters if not yet fetched
  const displayShelters: Shelter[] = shelters.length > 0 ? shelters : [
    {
      id: 'shelter-1',
      name: 'APSDMA Central Cyclone & High-Ground Shelter',
      type: 'Government Cyclone Shelter',
      location: 'Sector 12 Ridge Road, Visakhapatnam',
      coordinates: { lat: 17.7012, lng: 83.2281 },
      totalCapacity: 600,
      occupiedCapacity: 240,
      availableCapacity: 360,
      elevationMeters: 28,
      amenities: {
        drinkingWater: true,
        medicalStation: true,
        powerBackup: true,
        foodSupply: true,
        sanitation: true,
      },
      contactPerson: 'Command Officer R. Sharma',
      contactNumber: '+91-891-255-8901',
      status: 'OPEN',
    },
    {
      id: 'shelter-2',
      name: 'St. Aloysius Community High Ground Hall',
      type: 'Community Hall',
      location: 'Cathedral Hill, Ward 4',
      coordinates: { lat: 17.6945, lng: 83.2104 },
      totalCapacity: 450,
      occupiedCapacity: 390,
      availableCapacity: 60,
      elevationMeters: 35,
      amenities: {
        drinkingWater: true,
        medicalStation: true,
        powerBackup: true,
        foodSupply: true,
        sanitation: true,
      },
      contactPerson: 'Father Joseph',
      contactNumber: '+91-891-256-1122',
      status: 'NEAR_CAPACITY',
    },
    {
      id: 'shelter-3',
      name: 'Andhra University Indoor Sports Complex',
      type: 'School / College',
      location: 'AU North Campus Plateau',
      coordinates: { lat: 17.7219, lng: 83.3195 },
      totalCapacity: 1200,
      occupiedCapacity: 410,
      availableCapacity: 790,
      elevationMeters: 42,
      amenities: {
        drinkingWater: true,
        medicalStation: true,
        powerBackup: true,
        foodSupply: true,
        sanitation: true,
      },
      contactPerson: 'Campus Marshal K. Rao',
      contactNumber: '+91-891-284-4000',
      status: 'OPEN',
    },
  ];

  const handleNavigate = (shelterId: string) => {
    setSelectedShelterId(shelterId);
    setActiveView('safe-evacuation');
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            VERIFIED RESCUE INFRASTRUCTURE
          </div>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 mt-0.5">
            <Home className="w-5 h-5 text-emerald-400" />
            <span>Nearby High-Ground Shelters</span>
          </h3>
        </div>

        <button
          onClick={() => setActiveView('safe-evacuation')}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View All on Evacuation Map</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayShelters.slice(0, 3).map((shelter) => {
          const occupancyPercent = Math.round(
            (shelter.occupiedCapacity / shelter.totalCapacity) * 100
          );
          const isNearlyFull = occupancyPercent >= 80;

          return (
            <div
              key={shelter.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Status Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      shelter.status === 'OPEN'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : shelter.status === 'NEAR_CAPACITY'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}
                  >
                    {shelter.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                    +{shelter.elevationMeters}m High Ground
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {shelter.name}
                </h4>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{shelter.location}</span>
                </div>

                {/* Capacity Meter */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">BED OCCUPANCY</span>
                    <span
                      className={`font-bold ${
                        isNearlyFull ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {shelter.occupiedCapacity} / {shelter.totalCapacity} ({occupancyPercent}%)
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
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Available Capacity:</span>
                    <span className="font-bold text-slate-200">
                      {shelter.availableCapacity} beds open
                    </span>
                  </div>
                </div>

                {/* Amenities Icons */}
                <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs">
                  {shelter.amenities.drinkingWater && (
                    <span title="Clean Drinking Water" className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px]">Water</span>
                    </span>
                  )}
                  {shelter.amenities.medicalStation && (
                    <span title="Medical Station On-Site" className="flex items-center gap-1">
                      <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[10px]">Medical</span>
                    </span>
                  )}
                  {shelter.amenities.powerBackup && (
                    <span title="Generator Power Backup" className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px]">Power</span>
                    </span>
                  )}
                  {shelter.amenities.foodSupply && (
                    <span title="Food Rations" className="flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px]">Food</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => handleNavigate(shelter.id)}
                  className="w-full py-2 bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate to Shelter
                </button>
                <a
                  href={`tel:${shelter.contactNumber}`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
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
