import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  PhoneCall,
  MapPin,
  AlertTriangle,
  Send,
  MessageSquare,
  Copy,
  Check,
  Radio,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { ActiveView } from '../types';
import { SOSRequest, SOSStatus } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';
import { SosConfirmationModal } from '../components/sos/SosConfirmationModal';
import { SosActiveTelemetry } from '../components/sos/SosActiveTelemetry';

interface SosBeaconPageProps {
  setActiveView?: (view: ActiveView) => void;
}

export const SosBeaconPage: React.FC<SosBeaconPageProps> = ({ setActiveView = () => {} }) => {
  const { userLocation, activeSos, setActiveSos, isOnline } = useEmergency();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedSms, setCopiedSms] = useState<boolean>(false);

  // Check for active SOS on initial mount
  useEffect(() => {
    loadActiveSos();
  }, []);

  const loadActiveSos = async () => {
    try {
      const res = await ApiService.getLatestSos();
      if (res.success && res.data) {
        setActiveSos(res.data);
      }
    } catch {
      // Local fallback
    }
  };

  const handleConfirmSos = async (data: {
    emergencyType: string;
    trappedCount: number;
    hasElderlyOrInfants: boolean;
    hasMedicalEmergency: boolean;
    waterLevelMeters: number;
    notes: string;
  }) => {
    setIsSubmitting(true);
    try {
      const payload: Partial<SOSRequest> = {
        userName: 'Citizen Rahul',
        contactNumber: '+91-98765-43210',
        emergencyType: data.emergencyType as any,
        coordinates: userLocation,
        trappedCount: data.trappedCount,
        hasElderlyOrInfants: data.hasElderlyOrInfants,
        hasMedicalEmergency: data.hasMedicalEmergency,
        waterLevelMeters: data.waterLevelMeters,
        notes: data.notes,
      };

      const res = await ApiService.triggerSos(payload);
      if (res.success && res.data) {
        setActiveSos(res.data);
      } else {
        // Fallback local memory state
        const fallbackSos: SOSRequest = {
          id: `sos_offline_${Date.now()}`,
          userName: 'Citizen Rahul',
          contactNumber: '+91-98765-43210',
          emergencyType: data.emergencyType as any,
          status: 'SOS ACTIVATED',
          coordinates: userLocation,
          trappedCount: data.trappedCount,
          hasElderlyOrInfants: data.hasElderlyOrInfants,
          hasMedicalEmergency: data.hasMedicalEmergency,
          waterLevelMeters: data.waterLevelMeters,
          notes: data.notes,
          timestamp: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedArrival: '15-25 mins (Local Mode)',
        };
        setActiveSos(fallbackSos);
      }
    } catch {
      // Offline fallback
      const fallbackSos: SOSRequest = {
        id: `sos_offline_${Date.now()}`,
        userName: 'Citizen Rahul',
        contactNumber: '+91-98765-43210',
        emergencyType: data.emergencyType as any,
        status: 'SOS ACTIVATED',
        coordinates: userLocation,
        trappedCount: data.trappedCount,
        hasElderlyOrInfants: data.hasElderlyOrInfants,
        hasMedicalEmergency: data.hasMedicalEmergency,
        waterLevelMeters: data.waterLevelMeters,
        notes: data.notes,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedArrival: '15-25 mins (Local Mode)',
      };
      setActiveSos(fallbackSos);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const handleUpdateStatus = async (newStatus: SOSStatus) => {
    if (!activeSos) return;
    try {
      const res = await ApiService.updateSosStatus(activeSos.id, newStatus);
      if (res.success && res.data) {
        setActiveSos(res.data);
      } else {
        setActiveSos({ ...activeSos, status: newStatus, updatedAt: new Date().toISOString() });
      }
    } catch {
      setActiveSos({ ...activeSos, status: newStatus, updatedAt: new Date().toISOString() });
    }
  };

  const handleCancelSos = async () => {
    if (!activeSos) return;
    if (window.confirm('Are you sure you want to cancel this SOS Beacon?')) {
      await handleUpdateStatus('RESOLVED');
      setActiveSos(null);
    }
  };

  // Offline Cellular Emergency SMS format
  const offlineSmsText = `SOS! RESCUE NEEDED at LAT: ${userLocation.lat.toFixed(4)}, LNG: ${userLocation.lng.toFixed(4)} (${userLocation.address || 'Coastal Sector'}). FLOOD WATER: 1.2m. PEOPLE TRAPPED: 2. MED EMERGENCY: YES. Send NDRF boat.`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(offlineSmsText);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Top Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
            title="Return to Home Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>3. SOS EMERGENCY DISTRESS BEACON</span>
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>GPS: {userLocation.address} ({userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            PROTOTYPE DISPATCH ACTIVE
          </div>
        </div>
      </div>

      {/* 2. Main SOS Workspace */}
      {activeSos ? (
        /* A. ACTIVE SOS TELEMETRY & PROGRESSION BOARD */
        <SosActiveTelemetry
          sos={activeSos}
          onUpdateStatus={handleUpdateStatus}
          onCancelSos={handleCancelSos}
        />
      ) : (
        /* B. PRE-ACTIVATION DISTRESS CONSOLE */
        <div className="space-y-6">
          {/* Giant Obvious SOS Trigger Card */}
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-red-950/70 via-slate-900 to-slate-950 border-2 border-red-500/60 shadow-red-glow text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <div className="max-w-xl space-y-2">
              <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest bg-red-500/15 px-3 py-1 rounded-full border border-red-500/30 inline-block">
                HIGH PRIORITY LIFE-SAVING ACTION
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-100">
                Are you trapped or in immediate danger?
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Tap the button below to trigger the emergency distress beacon. A confirmation screen will allow you to specify flood water depth, trapped persons, and medical priorities.
              </p>
            </div>

            {/* Giant Pulsing SOS Button */}
            <div className="relative py-4">
              <div className="absolute inset-0 rounded-full bg-red-600/30 blur-2xl animate-pulse pointer-events-none" />
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 text-white font-black text-3xl sm:text-4xl tracking-widest uppercase border-4 border-white/80 shadow-red-glow flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <ShieldAlert className="w-12 h-12 mb-1 group-hover:scale-110 transition-transform" />
                <span>SOS</span>
                <span className="text-[10px] font-sans font-bold tracking-normal opacity-90 mt-1">
                  TAP TO ACTIVATE
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              GPS lock active: ±8m accuracy • Zero-Data cellular fallback ready
            </div>
          </div>

          {/* Offline SMS Generator Section */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                  Offline Cellular SMS Distress Fallback
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                2G SMS READY
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              If cellular mobile data (4G/5G) or Wi-Fi fails during severe flooding or cyclones, standard 2G SMS messages still transmit with high reliability. Use this pre-formatted text:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed break-all select-all">
              {offlineSmsText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                onClick={handleCopySms}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
              >
                {copiedSms ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Copied to Clipboard!' : 'Copy SMS Text'}</span>
              </button>

              <a
                href={`sms:112?body=${encodeURIComponent(offlineSmsText)}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow"
              >
                <Send className="w-4 h-4" />
                <span>Send SMS to 112</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <SosConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSos}
        userLocation={userLocation}
        isSubmitting={isSubmitting}
      />

      {/* Emergency Authorities Notice Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            National Emergency: <strong className="text-white font-mono">112</strong> | NDRF Disaster Control: <strong className="text-white font-mono">1078</strong> | Ambulance: <strong className="text-white font-mono">108</strong>
          </span>
        </div>
        <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Prototype simulation. In actual life-threatening emergencies, call official services immediately.</span>
        </div>
      </div>
    </div>
  );
};
