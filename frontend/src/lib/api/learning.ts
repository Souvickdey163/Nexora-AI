import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/learning')
  : 'http://localhost:5001/api/learning';

async function fetchLearningApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to learning service.' };
  }
}

export interface LearningTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  resourceType: string;
  url: string;
  estimatedMinutes: number;
  difficulty: string;
  isCompleted: boolean;
}

export const learningApi = {
  async getTopics() {
    return fetchLearningApi<{ success: boolean; topics: LearningTopic[] }>('/topics');
  },

  async toggleProgress(topicId: string, completed?: boolean) {
    return fetchLearningApi<{ success: boolean; progress: any }>(`/progress/${topicId}`, {
      method: 'POST',
      body: JSON.stringify({ completed }),
    });
  },
};
