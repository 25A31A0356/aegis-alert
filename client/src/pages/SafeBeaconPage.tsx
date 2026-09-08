import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  RefreshCw,
  History,
  Info,
  Smartphone,
  Check,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { SafeBeacon, SafeBeaconStatus, GeoCoordinate } from '@shared';
import { ApiService } from '../services/api';
import { useEmergency } from '../stores/EmergencyContext';
import { ActiveView } from '../types';

interface SafeBeaconPageProps {
  setActiveView?: (view: ActiveView) => void;
}

export const SafeBeaconPage: React.FC<SafeBeaconPageProps> = ({
  setActiveView = () => {},
}) => {
  const { userLocation, latestSafeBeacon, setLatestSafeBeacon } = useEmergency();

  // Selected Status for New Broadcast
  const [selectedStatus, setSelectedStatus] = useState<SafeBeaconStatus>('SAFE');
  const [userName, setUserName] = useState<string>('Sai Teja (Citizen)');
  const [notes, setNotes] = useState<string>('');
  const [coordinates, setCoordinates] = useState<GeoCoordinate>({
    lat: userLocation.lat || 17.6868,
    lng: userLocation.lng || 83.2185,
    address: userLocation.address || 'Beach Road, Coastal Ward 12, Visakhapatnam',
  });

  // State
  const [isSending, setIsSending] = useState<boolean>(false);
  const [beaconHistory, setBeaconHistory] = useState<SafeBeacon[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [broadcastSuccessToast, setBroadcastSuccessToast] = useState<SafeBeacon | null>(null);

  // Sync coordinates with user location
  useEffect(() => {
    if (userLocation) {
      setCoordinates({
        lat: userLocation.lat,
        lng: userLocation.lng,
        address: userLocation.address,
      });
    }
  }, [userLocation]);

  // Load Beacon History
  useEffect(() => {
    loadBeaconHistory();
  }, []);

  const loadBeaconHistory = async () => {
    try {
      const res = await ApiService.getSafeBeaconHistory();
      if (res.success && res.data) {
        setBeaconHistory(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch beacon history:', err);
    }
  };

  // Sync Live GPS
  const handleSyncGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            address: userLocation.address || 'Live GPS Pinned Sector',
          });
        },
        (err) => {
          console.warn('Geolocation failed:', err.message);
        }
      );
    }
  };

  // Broadcast Ping Handler
  const handleSendPing = async () => {
    setIsSending(true);
    setBroadcastSuccessToast(null);

    try {
      const payload: Partial<SafeBeacon> = {
        userName: userName.trim() || 'Citizen',
        status: selectedStatus,
        coordinates,
        notes: notes.trim(),
      };

      const res = await ApiService.sendSafeBeacon(payload);

      if (res.success && res.data) {
        setLatestSafeBeacon(res.data);
        setBeaconHistory((prev) => [res.data!, ...prev]);
        setBroadcastSuccessToast(res.data);
        setNotes('');

        setTimeout(() => {
          setBroadcastSuccessToast(null);
        }, 5000);
      } else {
        // Fallback local update if network unavailable
        const localBeacon: SafeBeacon = {
          id: `safe_loc_${Date.now()}`,
          userName: userName.trim() || 'Citizen',
          status: selectedStatus,
          coordinates,
          timestamp: new Date().toISOString(),
          notes: notes.trim(),
          isShared: true,
        };
        setLatestSafeBeacon(localBeacon);
        setBeaconHistory((prev) => [localBeacon, ...prev]);
        setBroadcastSuccessToast(localBeacon);
      }
    } catch (err) {
      console.error('Send safe beacon failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Copy Compressed SMS
  const getSmsPayload = () => {
    return `[AEGISALERT STATUS: ${selectedStatus}]\nCITIZEN: ${userName.trim() || 'Citizen'}\nSTATUS: ${selectedStatus}\nGPS: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}\nLOC: ${coordinates.address || 'Current Sector'}\nTIME: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${notes ? `\nNOTE: ${notes}` : ''}`;
  };

  const handleCopySms = () => {
    navigator.clipboard.writeText(getSmsPayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Helper for Status Visuals
  const getStatusVisuals = (st: SafeBeaconStatus) => {
    switch (st) {
      case 'SAFE':
        return {
          title: 'I AM SAFE',
          subtitle: 'No physical injury, sheltered securely, no rescue needed.',
          icon: CheckCircle2,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-emerald-glow',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'NEED HELP':
        return {
          title: 'NEED NON-CRITICAL HELP',
          subtitle: 'Require drinking water, rations, medicines, or evacuation transport.',
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-amber-glow',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400 animate-pulse',
        };
      case 'UNABLE TO MOVE':
        return {
          title: 'UNABLE TO MOVE / INJURED',
          subtitle: 'Trapped under debris, mobility impaired, or severe injury.',
          icon: Activity,
          color: 'text-red-400',
          bg: 'bg-red-500/20 border-red-500 text-red-300 shadow-red-glow',
          badge: 'bg-red-500/15 text-red-300 border-red-500/40',
          dot: 'bg-red-400 animate-ping',
        };
    }
  };

  const activeVisuals = latestSafeBeacon ? getStatusVisuals(latestSafeBeacon.status) : null;
  const ActiveIcon = activeVisuals ? activeVisuals.icon : CheckCircle2;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                  <HeartHandshake className="w-5 h-5 text-emerald-400" />
                  <span>7. SAFE BEACON — LOW-BANDWIDTH STATUS PING</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Communicate your live safety status to family and response databases when high-bandwidth networks fail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>&lt;1KB ULTRA-COMPACT DISPATCH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Success Toast Banner */}
      {broadcastSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-1 shadow-emerald-glow animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Safety Status Successfully Broadcasted & Pinned</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              ID: {broadcastSuccessToast.id}
            </span>
          </div>
          <p className="text-xs text-emerald-300/90 font-mono">
            Status: <strong className="text-white uppercase">{broadcastSuccessToast.status}</strong> • Timestamp:{' '}
            {new Date(broadcastSuccessToast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • GPS: [
            {broadcastSuccessToast.coordinates?.lat?.toFixed(4)}°, {broadcastSuccessToast.coordinates?.lng?.toFixed(4)}°]
          </p>
        </div>
      )}

      {/* 3. Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN (Cols 1-6): Status Selection & Ping Broadcaster
            ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>SELECT & BROADCAST YOUR STATUS</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                DB Live Sync
              </span>
            </div>

            {/* 3 Prominent Status Action Cards */}
            <div className="space-y-3">
              {(['SAFE', 'NEED HELP', 'UNABLE TO MOVE'] as SafeBeaconStatus[]).map((st) => {
                const visuals = getStatusVisuals(st);
                const Icon = visuals.icon;
                const isSelected = selectedStatus === st;

                return (
                  <div
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 select-none ${
                      isSelected
                        ? visuals.bg
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                          isSelected ? 'bg-slate-950/80' : 'bg-slate-900 border border-slate-800'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${visuals.color}`} />
                      </div>

                      <div className="space-y-1">
                        <h4
                          className={`text-sm font-black uppercase tracking-wider ${
                            isSelected ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {visuals.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          {visuals.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-white bg-white text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Citizen Details & Location Form */}
            <div className="space-y-3 text-xs pt-1">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Citizen Name / Caller ID</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Approximate / Current Location</label>
                  <button
                    type="button"
                    onClick={handleSyncGps}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Live GPS</span>
                  </button>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={coordinates.address || ''}
                    onChange={(e) =>
                      setCoordinates((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="Street, Landmark, Ward Number"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 focus:outline-none text-xs"
                  />
                </div>

                <div className="mt-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                  <span>GPS Coordinates:</span>
                  <span className="text-cyan-400 font-bold">
                    {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Optional Safety Notes / Status Details
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sheltered on 2nd floor with 2 family members; have battery & drinking water"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Broadcast Action Button */}
            <button
              onClick={handleSendPing}
              disabled={isSending}
              className={`w-full py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
                selectedStatus === 'SAFE'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-glow'
                  : selectedStatus === 'NEED HELP'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-glow'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-glow'
              }`}
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transmitting Safe Beacon...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT STATUS BEACON: {selectedStatus}</span>
                </>
              )}
            </button>

            {/* Disclaimer Strip */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>PROTOTYPE SYSTEM:</strong> Status updates are pinned to local AegisAlert SQLite database and logged to history. Does not dispatch official 112 emergency services without operator verification.
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (Cols 7-12): Active Status Board, SMS Relay & History Log
            ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. Active Status Telemetry Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>CURRENT ACTIVE STATUS BOARD</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                ✓ Beacon Active
              </span>
            </div>

            {latestSafeBeacon ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                      <ActiveIcon className={`w-7 h-7 ${activeVisuals?.color}`} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                        ACTIVE BROADCAST STATUS
                      </div>
                      <div className={`text-xl font-black ${activeVisuals?.color}`}>
                        {latestSafeBeacon.status}
                      </div>
                      <div className="text-xs text-slate-300 font-semibold mt-0.5">
                        {latestSafeBeacon.userName}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs font-mono">
                    <div className="text-slate-500 text-[10px]">LAST UPDATE</div>
                    <div className="font-bold text-slate-200">
                      {new Date(latestSafeBeacon.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(latestSafeBeacon.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {/* Location Details Strip */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{latestSafeBeacon.coordinates?.address || 'Disaster Sector'}</span>
                  </div>
                  <div className="text-[11px] text-cyan-400">
                    GPS Coordinates: {latestSafeBeacon.coordinates?.lat?.toFixed(4)}° N,{' '}
                    {latestSafeBeacon.coordinates?.lng?.toFixed(4)}° E
                  </div>
                  {latestSafeBeacon.notes && (
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 italic">
                      "{latestSafeBeacon.notes}"
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <HeartHandshake className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-300">No Safe Beacon broadcasted yet.</p>
                <p className="text-[11px] font-mono text-slate-500">
                  Select a status on the left and click Transmit to broadcast your safety status.
                </p>
              </div>
            )}
          </div>

          {/* 2. Zero-Internet 2G SMS Dispatch Generator */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-300 font-bold uppercase flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>ZERO-INTERNET SMS DISTRESS TEMPLATE</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySms}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <a
                  href={`sms:?body=${encodeURIComponent(getSmsPayload())}`}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open SMS</span>
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {getSmsPayload()}
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              When 4G/5G mobile internet drops during storms, copy this compressed text to send via basic 2G SMS to your designated emergency contact or NDRF helpline (1078).
            </p>
          </div>

          {/* 3. Safe Beacon History Log */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
                <History className="w-4 h-4 text-cyan-400" />
                <span>BEACON BROADCAST HISTORY AUDIT</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {beaconHistory.length} Logged Broadcasts
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none pr-1">
              {beaconHistory.length === 0 ? (
                <div className="p-4 text-center text-slate-500 font-mono text-xs">
                  No historical pings recorded yet.
                </div>
              ) : (
                beaconHistory.map((item, idx) => {
                  const vis = getStatusVisuals(item.status);
                  const Icon = vis.icon;

                  return (
                    <div
                      key={item.id || idx}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${vis.color} shrink-0`} />
                        <div>
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${vis.badge}`}>
                              {item.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal truncate max-w-[160px]">
                              {item.coordinates?.address || 'Disaster Sector'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
