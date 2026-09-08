import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Waves,
  HeartPulse,
  Flame,
  Building,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Radio,
  MapPin,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { SOSRequest, SOSStatus, HazardType } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';

export const SosBeaconPage: React.FC = () => {
  const { userLocation, activeSos, setActiveSos } = useEmergency();

  const [emergencyType, setEmergencyType] = useState<string>('Flood');
  const [trappedCount, setTrappedCount] = useState<number>(2);
  const [hasElderlyOrInfants, setHasElderlyOrInfants] = useState<boolean>(true);
  const [hasMedicalEmergency, setHasMedicalEmergency] = useState<boolean>(false);
  const [waterLevelMeters, setWaterLevelMeters] = useState<number>(1.2);
  const [notes, setNotes] = useState<string>('');

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const emergencyCategories = [
    { id: 'Flood', label: 'Flood / Submerged', icon: Waves },
    { id: 'Building Collapse', label: 'Debris / Structural Collapse', icon: Building },
    { id: 'Medical Emergency', label: 'Critical Medical Triage', icon: HeartPulse },
    { id: 'Fire / Explosion', label: 'Fire / Hazardous Gas Leak', icon: Flame },
  ];

  const handleConfirmSOS = async () => {
    setIsSubmitting(true);
    try {
      const payload: Partial<SOSRequest> = {
        userName: 'Sai Teja (Citizen)',
        contactNumber: '+91 98765 43210',
        emergencyType: emergencyType as any,
        coordinates: userLocation,
        trappedCount,
        hasElderlyOrInfants,
        hasMedicalEmergency,
        waterLevelMeters,
        notes,
      };

      const res = await ApiService.triggerSos(payload);
      if (res.success && res.data) {
        setActiveSos(res.data);
      } else {
        // Fallback local state if server is offline
        const localSos: SOSRequest = {
          id: `sos_loc_${Date.now()}`,
          userName: 'Sai Teja (Citizen)',
          contactNumber: '+91 98765 43210',
          emergencyType: emergencyType as any,
          status: 'HELP REQUEST RECEIVED',
          coordinates: userLocation,
          trappedCount,
          hasElderlyOrInfants,
          hasMedicalEmergency,
          waterLevelMeters,
          notes,
          timestamp: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedArrival: '15-25 mins (Local Simulated Dispatch)',
        };
        setActiveSos(localSos);
      }
      setShowConfirmModal(false);
    } catch (err) {
      console.error('SOS Trigger Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSOS = () => {
    setActiveSos(null);
  };

  const statusProgression: SOSStatus[] = [
    'SOS NOT ACTIVE',
    'SOS ACTIVATED',
    'LOCATION SHARED',
    'HELP REQUEST RECEIVED',
    'ASSISTANCE IN PROGRESS',
    'RESOLVED',
  ];

  const currentStatusIndex = activeSos
    ? statusProgression.indexOf(activeSos.status)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>3. SOS EMERGENCY BEACON & DISTRESS DISPATCH</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast distress beacons, trapped person telemetry, and high-priority rescue requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSos ? (
            <span className="badge-red px-3 py-1 rounded-xl text-xs font-black animate-pulse-rapid flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              BEACON BROADCASTING
            </span>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono">
              STATUS: STANDBY
            </span>
          )}
        </div>
      </div>

      {/* Prototype / Demo Safety Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <Radio className="w-5 h-5 text-cyan-400 shrink-0" />
        <div>
          <span className="text-slate-200 font-bold">PROTOTYPE SIMULATION NOTICE:</span> Distress calls are processed through the local emergency backend database. For genuine real-world life-threatening emergencies, call national dispatch at <span className="text-red-400 font-bold">112</span>.
        </div>
      </div>

      {/* Active SOS State View OR SOS Trigger Form */}
      {activeSos ? (
        /* Active SOS Dispatch Screen */
        <div className="p-6 rounded-2xl bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-900 border-2 border-red-500/60 shadow-red-glow space-y-6">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg animate-pulse">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                  EMERGENCY TICKET: #{activeSos.id}
                </div>
                <h2 className="text-lg font-black text-slate-100">
                  {activeSos.emergencyType} Emergency Broadcast Active
                </h2>
              </div>
            </div>

            <button
              onClick={handleCancelSOS}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-red-400" /> Cancel / Resolve SOS
            </button>
          </div>

          {/* Status Progression Stepper */}
          <div>
            <div className="text-xs font-mono text-slate-400 font-bold uppercase mb-3">
              Rescue Dispatch Timeline
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {statusProgression.map((status, index) => {
                const isPassed = index <= (currentStatusIndex === -1 ? 3 : currentStatusIndex);
                const isCurrent = index === (currentStatusIndex === -1 ? 3 : currentStatusIndex);
                return (
                  <div
                    key={status}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-red-500/20 border-red-500 text-red-300 font-bold shadow-sm'
                        : isPassed
                        ? 'bg-slate-800/80 border-slate-700 text-emerald-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="text-[10px] font-mono mb-1">STEP {index + 1}</div>
                    <div className="text-[11px] leading-tight font-semibold">{status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distress Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Broadcast Coordinates
              </div>
              <div className="text-slate-100 font-bold">
                {activeSos.coordinates.lat.toFixed(4)}° N, {activeSos.coordinates.lng.toFixed(4)}° E
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{activeSos.coordinates.address}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Trapped Personnel
              </div>
              <div className="text-slate-100 font-bold">{activeSos.trappedCount} Persons</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {activeSos.hasElderlyOrInfants ? 'Elderly/Infants Present' : 'No Infants'} •{' '}
                {activeSos.hasMedicalEmergency ? 'Medical Alert' : 'Standard'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Rescue Unit ETA
              </div>
              <div className="text-emerald-400 font-bold">{activeSos.estimatedArrival || '15-25 mins'}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">NDRF Boat Unit Dispatched</div>
            </div>
          </div>
        </div>
      ) : (
        /* SOS Trigger Preparation & Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Big Red SOS Action Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-900 border-2 border-red-500/40 flex flex-col items-center justify-center text-center space-y-5">
            <div className="text-xs font-mono text-red-400 uppercase tracking-wider font-bold">
              ONE-TAP CITIZEN DISTRESS TRIGGER
            </div>

            {/* Giant Pulsating SOS Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-44 h-44 rounded-full btn-emergency-sos flex flex-col items-center justify-center gap-1 text-white shadow-2xl transition-all active:scale-95 ring-8 ring-red-500/20"
              aria-label="Trigger SOS Emergency"
            >
              <ShieldAlert className="w-16 h-16 animate-pulse" />
              <span className="text-2xl font-black tracking-widest mt-1">SOS</span>
              <span className="text-[10px] font-mono tracking-normal opacity-90">TAP TO TRIGGER</span>
            </button>

            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Requires confirmation before transmission. Broadcasts exact coordinates and situation triage.
            </p>
          </div>

          {/* Situation Context Selectors */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Emergency Situation Parameters (Triage)
            </h3>

            {/* Emergency Type Options */}
            <div className="grid grid-cols-2 gap-2.5">
              {emergencyCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = emergencyType === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setEmergencyType(cat.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'bg-red-500/15 border-red-500 text-red-300 shadow-sm'
                        : 'bg-slate-850/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Trapped Count & Water Level Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
                  <span>Trapped Persons Count:</span>
                  <span className="text-red-400 font-mono font-bold">{trappedCount} People</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={trappedCount}
                  onChange={(e) => setTrappedCount(parseInt(e.target.value, 10))}
                  className="w-full accent-red-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
                  <span>Flood Water Depth:</span>
                  <span className="text-cyan-400 font-mono font-bold">{waterLevelMeters} Meters</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.2"
                  value={waterLevelMeters}
                  onChange={(e) => setWaterLevelMeters(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Vulnerability Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-850 border border-slate-700/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasElderlyOrInfants}
                  onChange={(e) => setHasElderlyOrInfants(e.target.checked)}
                  className="w-4 h-4 accent-red-500 rounded"
                />
                <span className="text-slate-200">Elderly, Pregnant, or Infants Present</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-850 border border-slate-700/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMedicalEmergency}
                  onChange={(e) => setHasMedicalEmergency(e.target.checked)}
                  className="w-4 h-4 accent-red-500 rounded"
                />
                <span className="text-slate-200">Critical Injury / Oxygen / Medic Needed</span>
              </label>
            </div>

            {/* Optional Distress Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Distress Notes (Landmark, Floor level, special instructions)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Trapped on 2nd floor balcony, green building opposite water tank..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:border-red-500 focus:outline-none placeholder:text-slate-500"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowConfirmModal(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500 rounded-2xl shadow-2xl p-6 space-y-4 z-10 text-slate-100">
            <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black uppercase text-red-400">Confirm SOS Broadcast</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to broadcast an emergency distress signal for{' '}
                <span className="font-bold text-white">{emergencyType}</span>?
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="text-slate-200">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trapped Count:</span>
                <span className="text-red-400 font-bold">{trappedCount} People</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flood Depth:</span>
                <span className="text-cyan-400 font-bold">{waterLevelMeters}m</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSOS}
                disabled={isSubmitting}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-red-glow transition-all"
              >
                {isSubmitting ? 'Transmitting...' : 'CONFIRM & SEND SOS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
