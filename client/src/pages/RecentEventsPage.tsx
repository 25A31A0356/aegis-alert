import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert, Waves, Wind, Activity, MapPin, Eye } from 'lucide-react';
import { DisasterEvent } from '@shared';
import { ApiService } from '../services/api';

export const RecentEventsPage: React.FC = () => {
  const [events, setEvents] = useState<DisasterEvent[]>([]);

  useEffect(() => {
    ApiService.getDisasters().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setEvents(res.data);
      } else {
        // Fallback realistic recent events
        setEvents([
          {
            id: 'evt_01',
            hazardType: 'Flood',
            title: 'Gajuwaka Basin Flash Inundation & Highway Overflow',
            location: 'Visakhapatnam, Andhra Pradesh',
            coordinates: { lat: 17.6868, lng: 83.2185 },
            severity: 'CRITICAL',
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),
            details: 'Rapid discharge of stormwater causing waterlogging up to 1.4m on arterial roads. NDRF Battalion 10 conducting boat evacuations.',
            affectedCount: 3400,
            dataSource: 'DEMO DATA',
          },
          {
            id: 'evt_02',
            hazardType: 'Cyclone',
            title: 'Deep Depression Landfall Alert in Kakinada Belt',
            location: 'East Coast, Bay of Bengal',
            coordinates: { lat: 16.989, lng: 82.2475 },
            severity: 'HIGH',
            status: 'MONITORING',
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            details: 'Sustained gale winds reaching 80-95 km/h. Coastal fishermen advisory in effect. Harbor signals raised to Local Cautionary 3.',
            affectedCount: 8200,
            dataSource: 'DEMO DATA',
          },
          {
            id: 'evt_03',
            hazardType: 'Earthquake',
            title: 'Magnitude 4.2 Seismic Event Recorded Off Bay Coast',
            location: 'Bay of Bengal Epicenter (Depth 12km)',
            coordinates: { lat: 17.2, lng: 84.1 },
            severity: 'LOW',
            status: 'CONTAINED',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            details: 'Mild tremors felt along high-rise buildings in coastal districts. No structural compromise or tsunami warning triggered.',
            affectedCount: 0,
            dataSource: 'DEMO DATA',
          },
        ]);
      }
    });
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Clock className="w-5 h-5" />
            <span>RECENT DISASTER EVENTS & HAZARD REGISTRY</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified historical and active disaster incident telemetry across regional emergency zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-cyan px-3 py-1 rounded-xl text-xs font-mono font-bold">
            DEMO INCIDENT FEED
          </span>
        </div>
      </div>

      {/* Events Feed List */}
      <div className="space-y-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-3 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                    evt.severity === 'CRITICAL'
                      ? 'badge-red'
                      : evt.severity === 'HIGH'
                      ? 'badge-orange'
                      : 'badge-cyan'
                  }`}
                >
                  {evt.severity} • {evt.hazardType}
                </span>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  STATUS: {evt.status}
                </span>

                <span className="text-[10px] font-mono text-slate-500">
                  Source: {evt.dataSource}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {new Date(evt.timestamp).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-100">{evt.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{evt.details}</p>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{evt.location}</span>
              </div>

              {evt.affectedCount ? (
                <div>
                  Estimated Affected: <span className="text-amber-400 font-bold">{evt.affectedCount.toLocaleString()} Citizens</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
