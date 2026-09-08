import React from 'react';
import { X, Bell, ShieldAlert, Navigation, Home, Users, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '@shared';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'DISASTER_ALERT':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'EVACUATION_WARNING':
        return <Navigation className="w-5 h-5 text-amber-400" />;
      case 'SHELTER_UPDATE':
        return <Home className="w-5 h-5 text-emerald-400" />;
      case 'COMMUNITY_UPDATE':
        return <Users className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">INFO</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-100">Emergency Notifications</div>
              <div className="text-xs text-slate-400">
                {notifications.filter((n) => !n.isRead).length} unread alerts
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notifications modal"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <div className="font-semibold text-sm">No notifications</div>
              <div className="text-xs text-slate-500">You are completely up to date.</div>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-slate-850/40 border-slate-800/80 text-slate-300'
                    : 'bg-slate-800/90 border-cyan-500/40 text-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm truncate">{notif.title}</span>
                      {getSeverityBadge(notif.severity)}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed mb-2">{notif.message}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {!notif.isRead && <span className="text-cyan-400 font-semibold">• Unread</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
