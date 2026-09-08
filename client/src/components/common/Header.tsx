import React from 'react';
import { Menu, Bell, Settings, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { useEmergency } from '../../stores/EmergencyContext';
import { ActiveView } from '../../types';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotifications,
  onOpenSettings,
  activeView: _activeView,
  setActiveView,
  unreadNotificationsCount,
}) => {
  const { isOnline, activeSos, alerts } = useEmergency();
  const criticalAlert = alerts.find((a) => a.severity === 'RED');

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 border-b border-slate-800 px-4 py-3 shadow-md backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Hamburger Drawer Trigger & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors focus:ring-2 focus:ring-cyan-500"
            title="Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveView('home')}
            aria-label="AegisAlert Home Dashboard"
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-cyan-600 flex items-center justify-center shadow-md shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
                  AEGISALERT
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  SIH 2026
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono -mt-0.5">
                Disaster Response & Safe Evacuation
              </div>
            </div>
          </button>
        </div>

        {/* Center / Status Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {activeSos && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>SOS ACTIVE: {activeSos.emergencyType}</span>
            </div>
          )}

          {criticalAlert && !activeSos && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>ALERT: {criticalAlert.hazardType}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold">OFFLINE MODE</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Notifications & Settings */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={`Emergency notifications (${unreadNotificationsCount} unread)`}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors focus:ring-2 focus:ring-cyan-500"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings and citizen profile"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors focus:ring-2 focus:ring-cyan-500"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
