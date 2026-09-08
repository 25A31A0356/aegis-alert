import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  HeartPulse,
  Baby,
  Droplets,
  AlertTriangle,
  PhoneCall,
  Play,
  RotateCcw,
  Check,
  XCircle,
} from 'lucide-react';
import { SOSRequest, SOSStatus } from '@shared';
import { ApiService } from '../../services/api';

interface SosActiveTelemetryProps {
  sos: SOSRequest;
  onUpdateStatus: (newStatus: SOSStatus) => void;
  onCancelSos: () => void;
}

const STATUS_STAGES: { status: SOSStatus; label: string; desc: string }[] = [
  {
    status: 'SOS ACTIVATED',
    label: '1. SOS ACTIVATED',
    desc: 'Encrypted distress beacon packet compiled from citizen GPS.',
  },
  {
    status: 'LOCATION SHARED',
    label: '2. LOCATION SHARED',
    desc: 'High-precision coordinates & elevation tagged in regional mesh network.',
  },
  {
    status: 'HELP REQUEST RECEIVED',
    label: '3. HELP REQUEST RECEIVED',
    desc: 'Emergency command center queue acknowledgment & triage classification.',
  },
  {
    status: 'ASSISTANCE IN PROGRESS',
    label: '4. ASSISTANCE IN PROGRESS',
    desc: 'Simulated rescue unit / boat dispatch route assigned to sector.',
  },
  {
    status: 'RESOLVED',
    label: '5. RESOLVED / SAFE',
    desc: 'Citizen confirmed evacuated or rescue completed.',
  },
];

export const SosActiveTelemetry: React.FC<SosActiveTelemetryProps> = ({
  sos,
  onUpdateStatus,
  onCancelSos,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);

  // Live timer since SOS was activated
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automated stage advancement simulator
  useEffect(() => {
    if (!isAutoSimulating) return;

    const interval = setInterval(() => {
      const currentIndex = STATUS_STAGES.findIndex((s) => s.status === sos.status);
      if (currentIndex < STATUS_STAGES.length - 1) {
        onUpdateStatus(STATUS_STAGES[currentIndex + 1].status);
      } else {
        setIsAutoSimulating(false);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoSimulating, sos.status]);

  const currentStageIndex = STATUS_STAGES.findIndex((s) => s.status === sos.status);
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStage = () => {
    if (currentStageIndex < STATUS_STAGES.length - 1) {
      onUpdateStatus(STATUS_STAGES[currentStageIndex + 1].status);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Large Pulsing SOS Active Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-2 border-red-500 shadow-red-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-2xl bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-red-glow shrink-0 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping"></span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                CRITICAL SOS ACTIVE
              </span>
              <span className="text-xs font-mono text-red-300">
                Beacon ID: #{sos.id.slice(-8)}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                PROTOTYPE DISPATCH SIMULATION
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-100">
              {sos.emergencyType.toUpperCase()}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{sos.coordinates.lat.toFixed(4)}° N, {sos.coordinates.lng.toFixed(4)}° E</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Clock className="w-3.5 h-3.5" /> Active for {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => onUpdateStatus('RESOLVED')}
            className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Rescued (Resolved)
          </button>
          <button
            onClick={onCancelSos}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel False Alarm
          </button>
        </div>
      </div>

      {/* 2. Status Progression Lifecycle Stepper */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold">
              LIFECYCLE STATUS PROGRESSION
            </div>
            <h3 className="text-base font-black text-slate-100 mt-0.5">
              Current Status: <span className="text-red-400 font-mono">{sos.status}</span>
            </h3>
          </div>

          {/* Prototype Simulation Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNextStage}
              disabled={currentStageIndex >= STATUS_STAGES.length - 1}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              Advance Stage →
            </button>
            <button
              onClick={() => setIsAutoSimulating(!isAutoSimulating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                isAutoSimulating
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>{isAutoSimulating ? 'Simulating...' : 'Auto Simulation'}</span>
            </button>
          </div>
        </div>

        {/* 5-Step Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {STATUS_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.status}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-red-950/40 border-red-500 shadow-red-glow ring-1 ring-red-500'
                    : isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      STEP 0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <div
                    className={`font-black text-xs ${
                      isCurrent
                        ? 'text-red-300'
                        : isCompleted
                        ? 'text-emerald-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Triage & Distress Metadata Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trapped Persons</span>
          </div>
          <div className="text-lg font-black text-slate-100 font-mono">
            {sos.trappedCount} Citizen{sos.trappedCount > 1 ? 's' : ''}
          </div>
          <div className="text-[11px] text-slate-400">
            {sos.hasElderlyOrInfants ? '⚠️ Infants/Elderly Present' : 'Standard Mobility'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-red-400" />
            <span>Medical Priority</span>
          </div>
          <div
            className={`text-lg font-black font-mono ${
              sos.hasMedicalEmergency ? 'text-red-400' : 'text-slate-100'
            }`}
          >
            {sos.hasMedicalEmergency ? 'CRITICAL MEDICAL' : 'STABLE'}
          </div>
          <div className="text-[11px] text-slate-400">
            {sos.hasMedicalEmergency ? 'Ambulance triage required' : 'No critical trauma reported'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Water Level / Flood Depth</span>
          </div>
          <div className="text-lg font-black text-cyan-400 font-mono">
            {sos.waterLevelMeters ? `${sos.waterLevelMeters.toFixed(1)} meters` : 'Ground Level'}
          </div>
          <div className="text-[11px] text-slate-400">
            {sos.notes ? `Note: "${sos.notes}"` : 'Coordinates verified'}
          </div>
        </div>
      </div>
    </div>
  );
};
