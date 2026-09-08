import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Users,
  AlertTriangle,
  Droplets,
  HeartPulse,
  Baby,
  MapPin,
  Send,
} from 'lucide-react';
import { GeoCoordinate } from '@shared';

interface SosConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    emergencyType: string;
    trappedCount: number;
    hasElderlyOrInfants: boolean;
    hasMedicalEmergency: boolean;
    waterLevelMeters: number;
    notes: string;
  }) => void;
  userLocation: GeoCoordinate;
  isSubmitting?: boolean;
}

export const SosConfirmationModal: React.FC<SosConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userLocation,
  isSubmitting = false,
}) => {
  const [emergencyType, setEmergencyType] = useState<string>('Flood Inundation');
  const [trappedCount, setTrappedCount] = useState<number>(1);
  const [hasElderlyOrInfants, setHasElderlyOrInfants] = useState<boolean>(false);
  const [hasMedicalEmergency, setHasMedicalEmergency] = useState<boolean>(false);
  const [waterLevelMeters, setWaterLevelMeters] = useState<number>(1.2);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      emergencyType,
      trappedCount,
      hasElderlyOrInfants,
      hasMedicalEmergency,
      waterLevelMeters,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-red-500/60 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-950/80 to-slate-900 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide text-red-100">
                CONFIRM EMERGENCY SOS BEACON
              </h3>
              <p className="text-[11px] text-red-300/80 font-mono">
                Verify situation details before broadcasting distress packet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Location Verification */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs font-mono">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400">GPS COORDINATES: </span>
              <strong className="text-slate-100 font-bold">
                {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
              </strong>
            </div>
          </div>

          {/* 1. Emergency Category */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase font-bold mb-1.5">
              1. Type of Emergency:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                'Flood Inundation',
                'Medical Critical',
                'Structure Collapse',
                'Trapped in Room/Roof',
                'Cyclone Gale Damage',
                'Other Hazard',
              ].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setEmergencyType(type)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-left truncate ${
                    emergencyType === type
                      ? 'bg-red-600 text-white border-red-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Trapped Persons Count & Water Depth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase font-bold mb-1">
                2. People Trapped:
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setTrappedCount((c) => Math.max(1, c - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-900 text-slate-200 font-black text-sm flex items-center justify-center hover:bg-slate-800"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-black text-sm text-cyan-400">
                  {trappedCount} {trappedCount === 1 ? 'Person' : 'People'}
                </div>
                <button
                  type="button"
                  onClick={() => setTrappedCount((c) => c + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-900 text-slate-200 font-black text-sm flex items-center justify-center hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase font-bold mb-1">
                3. Water Depth / Floor:
              </label>
              <select
                value={waterLevelMeters}
                onChange={(e) => setWaterLevelMeters(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs rounded-xl p-2.5 focus:outline-none focus:border-red-500"
              >
                <option value="0.0">Ground Level (No Water)</option>
                <option value="0.5">Ankle to Knee Depth (0.5m)</option>
                <option value="1.2">Waist to Chest Depth (1.2m)</option>
                <option value="2.0">Submerged Ground Floor (&gt;2.0m)</option>
                <option value="3.5">Trapped on 2nd Floor / Roof</option>
              </select>
            </div>
          </div>

          {/* 3. Vulnerability Toggles */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-mono text-slate-400 uppercase font-bold">
              4. High-Priority Vulnerabilities:
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={hasElderlyOrInfants}
                onChange={(e) => setHasElderlyOrInfants(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-red-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
              />
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Baby className="w-4 h-4 text-amber-400" />
                <span>Infants, Children, or Elderly Individuals present</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={hasMedicalEmergency}
                onChange={(e) => setHasMedicalEmergency(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-red-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
              />
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <HeartPulse className="w-4 h-4 text-red-400" />
                <span>Critical Medical Emergency (Bleeding, Oxygen, Cardiac)</span>
              </div>
            </label>
          </div>

          {/* 4. Optional Landmark Notes */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase font-bold mb-1">
              5. Landmark / Roof Color (Optional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Red roof house near water tank, 2nd floor balcony..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-red-glow flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Distress Packet...' : 'BROADCAST SOS BEACON'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
