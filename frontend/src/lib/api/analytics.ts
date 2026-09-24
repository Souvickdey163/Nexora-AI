import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/analytics')
  : 'http://localhost:5001/api/analytics';

async function fetchAnalyticsApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to analytics service.' };
  }
}

export const analyticsApi = {
  async getDashboardAnalytics() {
    return fetchAnalyticsApi<{
      success: boolean;
      analytics: {
        hasData: boolean;
        interviewScoreTrend: Array<{ date: string; score: number }>;
        codingProblemCounts: Array<{ difficulty: string; count: number }>;
        resumeScores: Array<{ date: string; score: number }>;
        assessmentScores: Array<{ category: string; score: number }>;
        totalInterviews: number;
        totalCodingSolved: number;
        totalResumesScored: number;
        avgInterviewScore: number;
        avgResumeScore: number;
      };
    }>('/dashboard');
  },
};
