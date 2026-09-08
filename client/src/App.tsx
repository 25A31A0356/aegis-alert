import React, { useState } from 'react';
import { ThemeProvider } from './stores/ThemeContext';
import { EmergencyProvider } from './stores/EmergencyContext';
import { SettingsProvider } from './stores/SettingsContext';
import { Header } from './components/common/Header';
import { SidebarMenu } from './components/common/SidebarMenu';
import { NotificationsModal } from './components/common/NotificationsModal';
import { SettingsModal } from './components/common/SettingsModal';
import { AppLayout } from './layouts/AppLayout';
import { ActiveView } from './types';
import { NotificationItem } from '@shared';
import { ApiService } from './services/api';
import { Home, Compass, ShieldAlert, AlertTriangle, User } from 'lucide-react';

// Page Imports
import { ThreeZoneDashboard } from './pages/ThreeZoneDashboard';
import { HomePage } from './pages/HomePage';
import { SafeEvacuationPage } from './pages/SafeEvacuationPage';
import { SosBeaconPage } from './pages/SosBeaconPage';
import { AskAegisPage } from './pages/AskAegisPage';
import { SurvivalGuidePage } from './pages/SurvivalGuidePage';
import { CommunityReportPage } from './pages/CommunityReportPage';
import { SafeBeaconPage } from './pages/SafeBeaconPage';
import { OfflineMapsPage } from './pages/OfflineMapsPage';
import { RecentEventsPage } from './pages/RecentEventsPage';
import { HistoryPage } from './pages/HistoryPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { FutureUpdatesPage } from './pages/FutureUpdatesPage';
import { PresentationPage } from './pages/PresentationPage';

const VALID_VIEWS: ActiveView[] = [
  'home',
  'safe-evacuation',
  'sos-beacon',
  'ask-aegis',
  'survival-guide',
  'community-report',
  'safe-beacon',
  'offline-maps',
  'recent-events',
  'history',
  'downloads',
  'future-updates',
  'presentation',
];

function getInitialView(): ActiveView {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace('#', '') as ActiveView;
    if (VALID_VIEWS.includes(hash)) {
      return hash;
    }
  }
  return 'home';
}

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>(getInitialView);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'3zone' | 'focus'>('3zone');

  // Sync state with URL hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ActiveView;
      if (VALID_VIEWS.includes(hash)) {
        setActiveView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_01',
      type: 'DISASTER_ALERT',
      title: 'RED ALERT: Flash Flood Inundation in Coastal Ward 12',
      message: 'Severe rainfall warning active for next 24 hours. Check nearby shelter availability and move to high ground.',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
      isRead: false,
      linkAction: 'safe_evacuation',
    },
    {
      id: 'notif_02',
      type: 'EVACUATION_WARNING',
      title: 'MANDATORY EVACUATION: Move to High-Ground Shelters',
      message: 'Cyclone landfall expected within 6 hours. High-ridge routes are open; low-lying underpasses closed.',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
      linkAction: 'safe_evacuation',
    },
    {
      id: 'notif_03',
      type: 'SHELTER_UPDATE',
      title: 'APSDMA Kailasagiri Shelter: 610 Beds & Water Open',
      message: 'Drinking water, emergency medical triage, and power backup fully operational at central shelter.',
      severity: 'LOW',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      linkAction: 'safe_evacuation',
    },
    {
      id: 'notif_04',
      type: 'COMMUNITY_UPDATE',
      title: 'Road Cleared: Harbor Bridge Underpass cleared by SDRF',
      message: 'Debris and waterlogging pumped out. Light vehicles can resume cautious transit.',
      severity: 'MEDIUM',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
      linkAction: 'community_report',
    },
    {
      id: 'notif_05',
      type: 'SYSTEM',
      title: 'Offline Knowledge Base Updated (NDMA 2026 Protocol)',
      message: 'All 7 disaster survival protocols and topographic shelter packs cached for 100% offline access.',
      severity: 'LOW',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      isRead: true,
      linkAction: 'survival_guide',
    },
  ]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
    ApiService.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    ApiService.markAllNotificationsRead();
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    ApiService.clearNotification(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all emergency notifications?')) {
      setNotifications([]);
      ApiService.clearAllNotifications();
    }
  };

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
    if (view === 'home') {
      // Keep 3-zone mode for home dashboard
    } else {
      setViewMode('focus');
    }
  };

  if (activeView === 'presentation') {
    return <PresentationPage setActiveView={handleViewChange} />;
  }

  return (
    <>
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeView={activeView}
        setActiveView={handleViewChange}
        unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
      />

      <AppLayout activeView={activeView} setActiveView={handleViewChange}>
        {/* Router View Switcher */}
        {activeView === 'home' && (
          <div className="space-y-4">
            {/* View Mode Toggle (3-Zone Command Overview vs Focus View) */}
            <div className="hidden lg:flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-mono text-slate-400 font-bold">
                DASHBOARD VIEW MODE:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('3zone')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewMode === '3zone'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3-Zone Command Layout
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('focus')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewMode === 'focus'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Focused Dashboard
                </button>
              </div>
            </div>

            {viewMode === '3zone' ? (
              <ThreeZoneDashboard setActiveView={handleViewChange} />
            ) : (
              <HomePage setActiveView={handleViewChange} />
            )}
          </div>
        )}

        {activeView === 'safe-evacuation' && <SafeEvacuationPage setActiveView={handleViewChange} />}
        {activeView === 'sos-beacon' && <SosBeaconPage setActiveView={handleViewChange} />}
        {activeView === 'ask-aegis' && <AskAegisPage setActiveView={handleViewChange} />}
        {activeView === 'survival-guide' && <SurvivalGuidePage setActiveView={handleViewChange} />}
        {activeView === 'community-report' && <CommunityReportPage setActiveView={handleViewChange} />}
        {activeView === 'safe-beacon' && <SafeBeaconPage setActiveView={handleViewChange} />}
        {activeView === 'offline-maps' && <OfflineMapsPage />}
        {activeView === 'recent-events' && <RecentEventsPage />}
        {activeView === 'history' && <HistoryPage />}
        {activeView === 'downloads' && <DownloadsPage />}
        {activeView === 'future-updates' && <FutureUpdatesPage />}
      </AppLayout>

      {/* Floating Bottom Navigation Bar (Direct Screen 1 Reference Match) */}
      <nav className="floating-bottom-nav flex items-center justify-around">
        <button
          type="button"
          onClick={() => handleViewChange('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            activeView === 'home'
              ? 'text-slate-900 dark:text-slate-100 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeView === 'home' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-900 dark:bg-slate-100" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleViewChange('safe-evacuation')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            activeView === 'safe-evacuation'
              ? 'text-slate-900 dark:text-slate-100 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Compass className="w-5 h-5" />
            {activeView === 'safe-evacuation' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-900 dark:bg-slate-100" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Explore</span>
        </button>

        {/* Center SOS Beacon Action */}
        <button
          type="button"
          onClick={() => handleViewChange('sos-beacon')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
            activeView === 'sos-beacon'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-400 hover:text-red-500'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#b85b5b] dark:bg-[#a64848] flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
            <ShieldAlert className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-[10px] font-bold mt-0.5">SOS</span>
        </button>

        <button
          type="button"
          onClick={() => handleViewChange('community-report')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            activeView === 'community-report'
              ? 'text-slate-900 dark:text-slate-100 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="w-5 h-5" />
            {activeView === 'community-report' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-900 dark:bg-slate-100" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Reports</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center justify-center p-2 rounded-2xl transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <div className="relative">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </button>
      </nav>

      {/* Hamburger Drawer Menu */}
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeView={activeView}
        setActiveView={handleViewChange}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAll}
        onNavigate={handleViewChange}
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
