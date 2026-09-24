import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/notifications')
  : 'http://localhost:5001/api/notifications';

async function fetchNotificationApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to connect to notification service.' };
  }
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export const notificationApi = {
  async getNotifications() {
    return fetchNotificationApi<{ success: boolean; notifications: InAppNotification[]; unreadCount: number }>('/');
  },

  async markAsRead(id: string) {
    return fetchNotificationApi<{ success: boolean }>(`/${id}/read`, { method: 'PATCH' });
  },

  async markAllAsRead() {
    return fetchNotificationApi<{ success: boolean }>('/read-all', { method: 'PATCH' });
  },
};
