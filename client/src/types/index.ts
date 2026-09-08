export type ActiveView =
  | 'home'
  | 'safe-evacuation'
  | 'sos-beacon'
  | 'ask-aegis'
  | 'survival-guide'
  | 'community-report'
  | 'safe-beacon'
  | 'offline-maps'
  | 'recent-events'
  | 'history'
  | 'downloads'
  | 'future-updates'
  | 'presentation';

export type AppTheme = 'dark' | 'light';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  isRead: boolean;
}
