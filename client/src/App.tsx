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

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'3zone' | 'focus'>('3zone');

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
    if (view === 'home') {
      // Keep 3-zone mode for home dashboard
    } else {
      setViewMode('focus');
    }
  };

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

        {activeView === 'safe-evacuation' && <SafeEvacuationPage />}
        {activeView === 'sos-beacon' && <SosBeaconPage />}
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
