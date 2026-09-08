import React, { useState } from 'react';
import { ThemeProvider } from './stores/ThemeContext';
import { EmergencyProvider, useEmergency } from './stores/EmergencyContext';
import { SettingsProvider } from './stores/SettingsContext';
import { Header } from './components/common/Header';
import { SidebarMenu } from './components/common/SidebarMenu';
import { NotificationsModal } from './components/common/NotificationsModal';
import { SettingsModal } from './components/common/SettingsModal';
import { AppLayout } from './layouts/AppLayout';
import { ActiveView } from './types';
import {
  ShieldAlert,
  Radio,
  Navigation,
  BookOpen,
  Users,
  MapPin,
  Clock,
  History,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Waves,
} from 'lucide-react';

import { NotificationItem } from '@shared';

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { alerts, userLocation, isOnline } = useEmergency();

  // Mark notification read
  const handleMarkRead = (id: string) => {
    // In-memory toggle for initial shell
    console.log('[Notification Read]', id);
  };

  const notifications: NotificationItem[] = [
    {
      id: 'notif_01',
      type: 'DISASTER_ALERT',
      title: 'RED ALERT: Flood Risk High in Your Sector',
      message: 'Severe rainfall warning active for next 24 hours. Check nearby shelter availability.',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 'notif_02',
      type: 'SHELTER_UPDATE',
      title: 'APSDMA Central Shelter has 610 beds open',
      message: 'Drinking water, medical triage, and power backup fully operational.',
      severity: 'LOW',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
    },
  ];

  return (
    <>
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
      />

      <AppLayout activeView={activeView} setActiveView={setActiveView}>
        {/* Phase 0 Architecture Shell Canvas */}
        <div className="space-y-6">
          {/* Emergency Alert Banner */}
          {alerts.length > 0 && (
            <div className="p-4 rounded-xl bg-red-950/40 border-l-4 border-red-500 border-y border-r border-red-500/20 text-red-100 flex items-start justify-between gap-4 shadow-red-glow">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-sm uppercase tracking-wide text-red-400">
                      {alerts[0].severity} ALERT • {alerts[0].hazardType}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">
                      IMD / SDMA
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">{alerts[0].headline}</div>
                  <div className="text-xs text-slate-300 mt-1">{alerts[0].instruction}</div>
                </div>
              </div>

              <button
                onClick={() => setActiveView('safe-evacuation')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" /> Evacuate Now
              </button>
            </div>
          )}

          {/* Current Active View Module Container */}
          <div className="aegis-card p-6 border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  ACTIVE MODULE
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-100 mt-0.5 capitalize">
                  {activeView.replace('-', ' ')}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  Sector: {userLocation.address || 'Visakhapatnam'}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            {/* View-Specific Placeholder & Architecture Ready Status */}
            {activeView === 'home' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column Quick Card */}
                  <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                      <Navigation className="w-4 h-4" /> 1. Safe Evacuation
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Real-time verified high-ground cyclone shelters, bed/food capacity, and elevation-aware evacuation routes.
                    </p>
                    <button
                      onClick={() => setActiveView('safe-evacuation')}
                      className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Open Evacuation Map →
                    </button>
                  </div>

                  {/* Center Column Quick Card */}
                  <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                      <Radio className="w-4 h-4" /> 4. Ask Aegis Assistant
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Dual-mode offline/online emergency triage assistant trained on NDMA safety guidelines and checklists.
                    </p>
                    <button
                      onClick={() => setActiveView('ask-aegis')}
                      className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Start AI Chat →
                    </button>
                  </div>

                  {/* Right Column Quick Card */}
                  <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                      <ShieldAlert className="w-4 h-4" /> 3. Red SOS Beacon
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instant emergency broadcast sharing precise GPS coordinates, situation triage, and trapped counts.
                    </p>
                    <button
                      onClick={() => setActiveView('sos-beacon')}
                      className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      View SOS Console →
                    </button>
                  </div>
                </div>

                {/* Readiness Banner */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">Phase 0 Architecture Initialized</div>
                      <div className="text-slate-400">
                        Frontend React+TS, Backend Express+SQLite, Design Tokens, and Shared Contracts are operational.
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold text-xs">Ready for Phase 1</span>
                </div>
              </div>
            )}

            {/* Other view placeholder state */}
            {activeView !== 'home' && (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
                  {activeView === 'safe-evacuation' && <Navigation className="w-6 h-6" />}
                  {activeView === 'sos-beacon' && <ShieldAlert className="w-6 h-6 text-red-500" />}
                  {activeView === 'ask-aegis' && <Radio className="w-6 h-6" />}
                  {activeView === 'survival-guide' && <BookOpen className="w-6 h-6" />}
                  {activeView === 'community-report' && <Users className="w-6 h-6" />}
                  {activeView === 'safe-beacon' && <Radio className="w-6 h-6" />}
                  {activeView === 'offline-maps' && <MapPin className="w-6 h-6" />}
                  {activeView === 'recent-events' && <Clock className="w-6 h-6" />}
                  {activeView === 'history' && <History className="w-6 h-6" />}
                  {activeView === 'downloads' && <Download className="w-6 h-6" />}
                  {activeView === 'future-updates' && <Sparkles className="w-6 h-6" />}
                </div>
                <div className="font-bold text-base text-slate-200 capitalize">
                  {activeView.replace('-', ' ')} Module Framework Ready
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The architecture, database schemas, and shared types for this feature are set up. We will build the complete detailed UI and interactions in the upcoming phases.
                </p>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Return to Home Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </AppLayout>

      {/* Hamburger Menu Drawer */}
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <EmergencyProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </EmergencyProvider>
    </ThemeProvider>
  );
}

export default App;
