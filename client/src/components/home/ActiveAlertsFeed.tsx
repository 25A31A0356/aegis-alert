import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Navigation,
  Sparkles,
  Radio,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { DisasterAlert, AlertTier } from '@shared';
import { ActiveView } from '../../types';
import { useEmergency } from '../../stores/EmergencyContext';

interface ActiveAlertsFeedProps {
  setActiveView: (view: ActiveView) => void;
}

export const ActiveAlertsFeed: React.FC<ActiveAlertsFeedProps> = ({ setActiveView }) => {
  const { alerts, scenario } = useEmergency();
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Fallback demo alerts matching the current scenario
  const scenarioAlerts: DisasterAlert[] = [
    {
      id: 'alert-1',
      title: 'FLASH FLOOD & STORM SURGE EMERGENCY',
      hazardType: 'Flood',
      severity: 'RED',
      urgency: 'Immediate',
      headline: 'Severe Inundation & Rising Basin Water in Sector 12 Coastal Reach',
      description:
        'CWC hydrological station has recorded water levels at 205.85m, breaching the severe danger threshold by +1.4m. Severe waterlogging is occurring along primary evacuation arteries.',
      instruction:
        'Cease low-road transit immediately. De-energize electrical mains. Move elderly and patients to upper floors or designated high-ground shelters.',
      affectedRegions: ['Ward 12 Beach Belt', 'Low-Lying Creek Sector', 'East Canal Reach'],
      effectiveFrom: new Date(Date.now() - 3600000).toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      issuedBy: 'Central Water Commission (CWC) & State Disaster Management',
      isLive: false,
    },
    {
      id: 'alert-2',
      title: 'VERY SEVERE CYCLONIC STORM ADVISORY',
      hazardType: 'Cyclone',
      severity: 'ORANGE',
      urgency: 'Expected',
      headline: 'Gale Winds 120-140 km/h with Heavy to Very Heavy Rainfall',
      description:
        'Cyclonic storm moving north-northwestwards with central pressure 964 hPa. Expected landfall in coastal district within next 6 to 8 hours.',
      instruction:
        'Secure loose outdoor items. Avoid sheltering under trees or temporary tin sheds. Keep emergency battery radio tuned to 102.8 MHz.',
      affectedRegions: ['Coastal Coastal Corridor', 'Fisheries Harbour', 'Outer Ring Road'],
      effectiveFrom: new Date(Date.now() - 7200000).toISOString(),
      expiresAt: new Date(Date.now() + 43200000).toISOString(),
      issuedBy: 'India Meteorological Department (IMD Cyclone Warning Centre)',
      isLive: false,
    },
    {
      id: 'alert-3',
      title: 'SEISMIC AFTERSHOCK SAFETY WATCH',
      hazardType: 'Earthquake',
      severity: 'YELLOW',
      urgency: 'Expected',
      headline: 'M 4.2 Aftershock Possibility Post-Initial M 5.8 Tremor',
      description:
        'Geological survey units report residual crustal stress. Minor tremors likely over next 24 hours. No structural collapse reported.',
      instruction:
        'Inspect household gas lines for leaks. Keep primary exit pathways clear of debris.',
      affectedRegions: ['Hill Slope Sector', 'Plateau North', 'Sub-division 4'],
      effectiveFrom: new Date(Date.now() - 10800000).toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      issuedBy: 'National Center for Seismology (NCS)',
      isLive: false,
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : scenarioAlerts;

  const filteredAlerts = displayAlerts.filter((alert) => {
    if (selectedTier === 'ALL') return true;
    return alert.severity === selectedTier;
  });

  const toggleExpand = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            ACTIVE DISASTER ADVISORIES & BULLETINS
          </div>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>Regional Threat Intelligence Feed</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {filteredAlerts.length} Active
            </span>
          </h3>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
          {['ALL', 'RED', 'ORANGE', 'YELLOW'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTier === tier
                  ? tier === 'RED'
                    ? 'bg-red-600 text-white shadow-md'
                    : tier === 'ORANGE'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : tier === 'YELLOW'
                    ? 'bg-yellow-400 text-slate-950 shadow-md'
                    : 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tier === 'ALL'
                ? 'All Alerts'
                : tier === 'RED'
                ? 'Critical (Red)'
                : tier === 'ORANGE'
                ? 'Warning (Orange)'
                : 'Advisory (Yellow)'}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isExpanded = expandedAlertId === alert.id;
          const isRed = alert.severity === 'RED';
          const isOrange = alert.severity === 'ORANGE';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                isRed
                  ? 'bg-red-950/30 border-red-500/40 hover:border-red-500/60'
                  : isOrange
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Alert Header Row */}
              <div
                onClick={() => toggleExpand(alert.id)}
                className="flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                      isRed
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : isOrange
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          isRed
                            ? 'bg-red-500 text-white'
                            : isOrange
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-yellow-400 text-slate-950'
                        }`}
                      >
                        {alert.severity} ALERT • {alert.hazardType}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {alert.issuedBy}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        DEMO SIMULATION
                      </span>
                    </div>

                    <h4 className="text-sm md:text-base font-black text-slate-100 leading-snug">
                      {alert.headline}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <button className="p-1 text-slate-400 hover:text-slate-200 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-fadeIn">
                  {/* Action Directives */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                      CITIZEN MANDATORY ACTION:
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed">
                      {alert.instruction}
                    </div>
                  </div>

                  {/* Affected Regions */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <span className="font-mono text-[11px]">Affected Sectors:</span>
                    {alert.affectedRegions.map((region, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {region}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('safe-evacuation')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                      >
                        <Navigation className="w-3.5 h-3.5" /> View Evacuation Corridors
                      </button>
                      <button
                        onClick={() => setActiveView('survival-guide')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Survival Protocols
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveView('ask-aegis')}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Radio className="w-3.5 h-3.5" /> Ask Aegis for Triage Help →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
