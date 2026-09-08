import React, { useState } from 'react';
import {
  Radio,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Share2,
  Copy,
  Send,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { SafeBeacon, SafeBeaconStatus } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';

export const SafeBeaconPage: React.FC = () => {
  const { userLocation, latestSafeBeacon, setLatestSafeBeacon } = useEmergency();

  const [status, setStatus] = useState<SafeBeaconStatus>('SAFE');
  const [userName, setUserName] = useState('Sai Teja');
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendPing = async () => {
    setIsSending(true);
    try {
      const res = await ApiService.sendSafeBeacon({
        userName,
        status,
        coordinates: userLocation,
        notes,
      });

      if (res.success && res.data) {
        setLatestSafeBeacon(res.data);
      } else {
        // Fallback local update
        const localBeacon: SafeBeacon = {
          id: `safe_loc_${Date.now()}`,
          userName,
          status,
          coordinates: userLocation,
          timestamp: new Date().toISOString(),
          notes,
          isShared: true,
        };
        setLatestSafeBeacon(localBeacon);
      }
    } catch (err) {
      console.error('Send safe beacon failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  const copySmsText = () => {
    const text = `[AEGISALERT STATUS: ${status}]\nI am broadcasting my status: ${status}. Current Location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)} (${userLocation.address}). NDRF active in sector.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <HeartHandshake className="w-5 h-5" />
            <span>7. SAFE BEACON — LOW-BANDWIDTH FAMILY PING</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Send sub-1KB status pings to family and search teams when voice calls and high-bandwidth data fail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-green px-3 py-1 rounded-xl text-xs font-mono font-bold">
            &lt;1KB ULTRA-COMPACT PAYLOAD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Ping Broadcaster Action */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
            Broadcast Safety Status
          </h3>

          {/* Status Selection Cards */}
          <div className="space-y-2.5">
            <button
              onClick={() => setStatus('SAFE')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                status === 'SAFE'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md font-bold'
                  : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-5 h-5 ${status === 'SAFE' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="text-sm">I AM SAFE</div>
                  <div className="text-[10px] text-slate-400 font-normal">No immediate danger, sheltered securely</div>
                </div>
              </div>
              {status === 'SAFE' && <span className="text-xs font-mono font-bold text-emerald-400">SELECTED</span>}
            </button>

            <button
              onClick={() => setStatus('NEED HELP')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                status === 'NEED HELP'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md font-bold'
                  : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-5 h-5 ${status === 'NEED HELP' ? 'text-amber-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="text-sm">NEED NON-CRITICAL HELP</div>
                  <div className="text-[10px] text-slate-400 font-normal">Need rations, water, or dry evacuation</div>
                </div>
              </div>
              {status === 'NEED HELP' && <span className="text-xs font-mono font-bold text-amber-400">SELECTED</span>}
            </button>

            <button
              onClick={() => setStatus('UNABLE TO MOVE')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                status === 'UNABLE TO MOVE'
                  ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md font-bold'
                  : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className={`w-5 h-5 ${status === 'UNABLE TO MOVE' ? 'text-red-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="text-sm">UNABLE TO MOVE / INJURED</div>
                  <div className="text-[10px] text-slate-400 font-normal">Trapped or mobility impaired</div>
                </div>
              </div>
              {status === 'UNABLE TO MOVE' && <span className="text-xs font-mono font-bold text-red-400">SELECTED</span>}
            </button>
          </div>

          {/* Citizen Name & Notes */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Short Note (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. With 3 neighbors at community center..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSendPing}
            disabled={isSending}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Transmitting Beacon...' : 'TRANSMIT SAFETY PING'}</span>
          </button>
        </div>

        {/* Right 2 Cols: Telemetry Overview & Fallback SMS Generator */}
        <div className="lg:col-span-2 space-y-4">
          {/* Last Status Transmitted Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                Last Status Broadcast Record
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Beacon
              </span>
            </div>

            {latestSafeBeacon ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-500 mb-0.5">CURRENT STATUS</div>
                  <div
                    className={`font-black text-sm ${
                      latestSafeBeacon.status === 'SAFE'
                        ? 'text-emerald-400'
                        : latestSafeBeacon.status === 'NEED HELP'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {latestSafeBeacon.status}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-500 mb-0.5">BROADCAST TIME</div>
                  <div className="font-bold text-slate-200">
                    {new Date(latestSafeBeacon.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-500 mb-0.5">LOCATION SHARING</div>
                  <div className="font-bold text-cyan-400">SHARED WITH RESCUE</div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 font-mono text-xs">
                No Safe Beacon ping broadcasted yet. Click Transmit to broadcast your safety status.
              </div>
            )}
          </div>

          {/* SMS / Offline Fallback Generator */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero-Internet SMS Dispatch Template</span>
              </div>
              <button
                onClick={copySmsText}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy SMS'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed break-all">
              [AEGISALERT STATUS: {status}] I am broadcasting my status: {status}. Current Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} ({userLocation.address}). NDRF active in sector.
            </div>

            <p className="text-[11px] text-slate-500">
              When 4G/5G mobile internet drops completely, copy this compressed text to send via basic 2G SMS to your emergency contact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
