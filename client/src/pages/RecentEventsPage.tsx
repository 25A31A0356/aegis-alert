import React, { useState, useEffect } from 'react';
import { Clock, MapPin, RefreshCw, Inbox, AlertTriangle } from 'lucide-react';
import { DisasterEvent } from '@shared';
import { ApiService } from '../services/api';

export const RecentEventsPage: React.FC = () => {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.getDisasters();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch {
      // Local fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
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
          <button
            type="button"
            onClick={loadEvents}
            disabled={isLoading}
            aria-label="Refresh disaster events list"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh events"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <span className="badge-cyan px-3 py-1 rounded-xl text-xs font-mono font-bold">
            {events.length} ACTIVE INCIDENTS
          </span>
        </div>
      </div>

      {/* Events Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div className="font-mono text-xs text-slate-300">Querying live hazard registry...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-16 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <Inbox className="w-7 h-7 text-slate-500" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-200">No Active Disaster Incidents</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                There are currently no reported major disaster incidents or alerts in this regional sector.
              </p>
            </div>
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-3 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
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

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    STATUS: {evt.status}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
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
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{evt.details}</p>

              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{evt.location}</span>
                </div>

                {evt.affectedCount ? (
                  <div>
                    Estimated Affected: <span className="text-amber-400 font-bold">{evt.affectedCount.toLocaleString()} Citizens</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
