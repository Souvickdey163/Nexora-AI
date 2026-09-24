import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/roadmap')
  : 'http://localhost:5001/api/roadmap';

async function fetchRoadmapApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to roadmap service.' };
  }
}

export const roadmapApi = {
  async getActiveRoadmap() {
    return fetchRoadmapApi<{ roadmap: any }>('/active', { method: 'GET' });
  },

  async generateRoadmap(data?: { targetRole?: string; experienceLevel?: string }) {
    return fetchRoadmapApi<{ roadmap: any }>('/generate', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  async toggleMilestone(milestoneId: string) {
    return fetchRoadmapApi<{ roadmap: any }>(`/milestones/${milestoneId}/toggle`, {
      method: 'PATCH',
    });
  },
};
