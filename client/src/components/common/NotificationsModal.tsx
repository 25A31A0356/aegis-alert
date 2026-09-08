import React, { useState } from 'react';
import {
  X,
  Bell,
  ShieldAlert,
  Navigation,
  Home,
  Users,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Filter,
  Info,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem, SeverityLevel } from '@shared';
import { ActiveView } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearNotification?: (id: string) => void;
  onClearAll?: () => void;
  onNavigate?: (view: ActiveView) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead = () => {},
  onClearNotification = () => {},
  onClearAll = () => {},
  onNavigate = () => {},
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

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
      case 'SYSTEM':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded font-black font-mono bg-red-500/20 text-red-300 border border-red-500/40">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded font-black font-mono bg-orange-500/20 text-orange-300 border border-orange-500/40">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded font-black font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            INFO
          </span>
        );
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'UNREAD') return !notif.isRead;
    return notif.type === selectedFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleActionClick = (linkAction?: string) => {
    if (linkAction) {
      if (linkAction === 'safe_evacuation') onNavigate('safe-evacuation');
      else if (linkAction === 'sos_beacon') onNavigate('sos-beacon');
      else if (linkAction === 'survival_guide') onNavigate('survival-guide');
      else if (linkAction === 'community_report') onNavigate('community-report');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh] animate-fadeIn">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Emergency Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-black">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Official alerts, evacuation bulletins & regional status feeds
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications modal"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills & Actions Strip */}
        <div className="p-3 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'UNREAD', label: `Unread (${unreadCount})` },
              { id: 'DISASTER_ALERT', label: 'Alerts' },
              { id: 'EVACUATION_WARNING', label: 'Evacuation' },
              { id: 'SHELTER_UPDATE', label: 'Shelters' },
              { id: 'COMMUNITY_UPDATE', label: 'Community' },
              { id: 'SYSTEM', label: 'System' },
            ].map((tab) => {
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 text-[11px]">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono transition-colors flex items-center gap-1"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 font-mono transition-colors flex items-center gap-1"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="font-bold text-sm text-slate-300">No Notifications in this Category</div>
              <div className="text-xs text-slate-500 font-mono">
                You are completely up to date with emergency advisories.
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all relative group ${
                  notif.isRead
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-900 border-cyan-500/40 text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        )}
                      </div>
                      {getSeverityBadge(notif.severity)}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                      <span>
                        {new Date(notif.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {notif.linkAction && (
                          <button
                            type="button"
                            onClick={() => handleActionClick(notif.linkAction)}
                            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                          >
                            <span>Open Route</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onMarkRead(notif.id)}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          {notif.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onClearNotification(notif.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Dismiss notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 text-center flex items-center justify-between px-4 text-xs font-mono">
          <span className="text-slate-500">AegisAlert CAP-Compliant Notification Engine</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
