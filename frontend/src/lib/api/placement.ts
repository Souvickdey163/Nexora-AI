import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/placement')
  : 'http://localhost:5001/api/placement';

async function fetchPlacementApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to placement service.' };
  }
}

export interface PlacementReadinessResponse {
  success: boolean;
  readiness: {
    overallScore: number;
    readinessTier: 'Needs Attention' | 'Developing' | 'Job Ready' | 'Highly Competitive';
    hasEnoughData: boolean;
    dimensions: Array<{
      key: string;
      name: string;
      score: number;
      weight: string;
      status: string;
      recommendation: string;
    }>;
    strengths: string[];
    skillGaps: string[];
    nextActionableSteps: string[];
    targetRole: string;
  };
}

export const placementApi = {
  async getReadiness() {
    return fetchPlacementApi<PlacementReadinessResponse>('/readiness');
  },
};
