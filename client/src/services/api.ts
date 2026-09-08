import {
  ApiResponse,
  DisasterAlert,
  DisasterEvent,
  Shelter,
  EvacuationRoute,
  SOSRequest,
  SafeBeacon,
  CommunityReport,
  ChatMessage,
  HistoryEvent,
  NotificationItem,
  UserProfile,
  DownloadResource,
} from '@shared';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.warn(`[API Client] Network request to ${url} failed, using fallback:`, error.message);
    return {
      success: false,
      error: error.message || 'Network unavailable',
      meta: { source: 'LOCAL_DB' },
    };
  }
}

export const ApiService = {
  // Health
  checkHealth: () => fetchJson<{ status: string }>('/health'),

  // Alerts & Disasters
  getAlerts: () => fetchJson<DisasterAlert[]>('/alerts'),
  getDisasters: () => fetchJson<DisasterEvent[]>('/disasters'),

  // Shelters & Evacuation
  getShelters: () => fetchJson<Shelter[]>('/shelters'),
  getRoutes: () => fetchJson<EvacuationRoute[]>('/routes'),

  // SOS Emergency
  triggerSos: (data: Partial<SOSRequest>) =>
    fetchJson<SOSRequest>('/sos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSosStatus: (id: string) => fetchJson<SOSRequest>(`/sos/${id}`),

  // Safe Beacon
  sendSafeBeacon: (data: Partial<SafeBeacon>) =>
    fetchJson<SafeBeacon>('/safe-beacon', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getLatestSafeBeacon: () => fetchJson<SafeBeacon | null>('/safe-beacon/latest'),

  // Community Reports
  getCommunityReports: () => fetchJson<CommunityReport[]>('/community-reports'),
  submitCommunityReport: (data: Partial<CommunityReport>) =>
    fetchJson<CommunityReport>('/community-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Ask Aegis Chat
  sendChatMessage: (message: string, forceOffline = false) =>
    fetchJson<ChatMessage>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, forceOffline }),
    }),
  getChatHistory: () => fetchJson<ChatMessage[]>('/chat/history'),
  clearChatHistory: () =>
    fetchJson<{ message: string }>('/chat/history', {
      method: 'DELETE',
    }),

  // History & Notifications
  getHistory: () => fetchJson<HistoryEvent[]>('/history'),
  getNotifications: () => fetchJson<NotificationItem[]>('/notifications'),
  markNotificationRead: (id: string) =>
    fetchJson<{ id: string; isRead: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  // User Profile
  getProfile: () => fetchJson<UserProfile>('/profile'),
  updateProfile: (profile: Partial<UserProfile>) =>
    fetchJson<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Downloads
  getDownloads: () => fetchJson<DownloadResource[]>('/downloads'),
  toggleDownload: (id: string) =>
    fetchJson<{ id: string; status: string }>(`/downloads/${id}/toggle`, {
      method: 'POST',
    }),
};
