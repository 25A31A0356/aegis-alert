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
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-800/80 px-4 py-3 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Hamburger Drawer Trigger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            aria-label="Open emergency menu"
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-700/60 transition-all focus:ring-2 focus:ring-cyan-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center shadow-cyan-glow">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400 bg-clip-text text-transparent group-hover:to-cyan-300">
                  AEGISALERT
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  v1.0
                </span>
              </div>
              <div className="text-[11px] text-slate-400 -mt-0.5 font-mono">
                Disaster Management & Emergency Response
              </div>
            </div>
          </button>
        </div>

        {/* Center / Status Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {activeSos && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold animate-pulse-rapid">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              SOS ACTIVE: {activeSos.emergencyType}
            </div>
          )}

          {criticalAlert && !activeSos && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              CRITICAL ALERT: {criticalAlert.hazardType}
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
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
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-700/60 transition-all focus:ring-2 focus:ring-cyan-500"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-700/60 transition-all focus:ring-2 focus:ring-cyan-500"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
