import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/dashboard')
  : 'http://localhost:5001/api/dashboard';

async function fetchDashboardApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to dashboard service.' };
  }
}

export interface DashboardOverviewResponse {
  success: boolean;
  overview: {
    user: {
      name: string;
      email: string;
      avatarUrl?: string;
      credits: number;
      targetRole?: string;
    };
    stats: {
      credits: number;
      interviewsCompleted: number;
      codingSolved: number;
      resumesAnalyzed: number;
      activeRoadmapProgress: number;
      placementScore: number;
      profileCompletion: number;
    };
    recentActivities: Array<{
      id: string;
      actionType: string;
      description: string;
      createdAt: string;
    }>;
    unreadNotificationsCount: number;
  };
}

export const dashboardApi = {
  async getOverview() {
    return fetchDashboardApi<DashboardOverviewResponse>('/overview');
  },
};
