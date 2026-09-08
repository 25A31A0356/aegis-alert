import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  ShieldAlert,
  HeartHandshake,
  Users,
  Radio,
  Navigation,
  Bell,
  CheckCircle2,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { HistoryEvent, HistoryActionType } from '@shared';
import { ApiService } from '../services/api';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.getHistory();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch {
      // Local fallback
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="space-y-6 animate-fadeIn pb-12">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadHistory}
            disabled={isLoading}
            aria-label="Refresh history records"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold">
            {history.length} LOGGED ACTIONS
          </span>
        </div>
      </div>

      {/* History Content */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div className="font-mono text-xs text-slate-300">Loading audit history from database...</div>
          </div>
        ) : history.length === 0 ? (
          /* True Empty State */
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <Inbox className="w-7 h-7 text-slate-500" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-200">No Emergency Actions Logged</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Your actions (SOS beacons, safe check-in pings, and incident reports) will appear here in chronological order.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
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
                    <span className="text-[11px] font-mono text-slate-400">
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
        )}
      </div>
    </div>
  );
};
