import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, ShieldAlert, HeartHandshake, Users, Radio, Navigation, Bell, Clock } from 'lucide-react';
import { HistoryEvent, HistoryActionType } from '@shared';
import { ApiService } from '../services/api';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    ApiService.getHistory().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setHistory(res.data);
      } else {
        // Initial mock audit history
        setHistory([
          {
            id: 'hist_01',
            actionType: 'SOS_ACTIVATED',
            title: 'SOS Emergency Beacon Broadcasted',
            details: 'Flood emergency distress signal broadcasted with GPS coordinates and 2 trapped persons indicated.',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'hist_02',
            actionType: 'SAFE_BEACON_SENT',
            title: 'Safe Beacon Ping Transmitted',
            details: 'Status "SAFE" broadcasted with location coordinates for family notification.',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'hist_03',
            actionType: 'EVACUATION_ROUTE_VIEWED',
            title: 'Evacuation Route to Kailasagiri Shelter Accessed',
            details: 'Calculated 4.2 km high-elevation path avoiding flooded lowlands.',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
        ]);
      }
    });
  }, []);

  const getIcon = (type: HistoryActionType) => {
    switch (type) {
      case 'SOS_ACTIVATED':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'SAFE_BEACON_SENT':
        return <HeartHandshake className="w-5 h-5 text-emerald-400" />;
      case 'COMMUNITY_REPORT_SUBMITTED':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'ASK_AEGIS_CONVERSATION':
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'EVACUATION_ROUTE_VIEWED':
        return <Navigation className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <HistoryIcon className="w-5 h-5" />
            <span>YOUR EMERGENCY ACTION HISTORY</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of distress beacons, safe pings, community hazard filings, and navigation requests.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold">
          {history.length} LOGGED ACTIONS
        </span>
      </div>

      {/* History Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 hover:border-slate-700 flex items-start gap-3.5 transition-all"
          >
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
              {getIcon(item.actionType)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                <span className="text-[11px] font-mono text-slate-500">
                  {new Date(item.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
