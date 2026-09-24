import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/activities')
  : 'http://localhost:5001/api/activities';

async function fetchActivityApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to activity service.' };
  }
}

export interface ActivityItem {
  id: string;
  actionType: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export const activityApi = {
  async getActivities(limit = 20) {
    return fetchActivityApi<{ success: boolean; activities: ActivityItem[] }>(`?limit=${limit}`);
  },
};
