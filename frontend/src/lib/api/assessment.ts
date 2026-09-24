import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/assessment')
  : 'http://localhost:5001/api/assessment';

async function fetchAssessmentApi<T = any>(endpoint: string, options: RequestInit = {}) {
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
    return { success: false, error: err?.message || 'Failed to connect to assessment service.' };
  }
}

export const assessmentApi = {
  async getCategories() {
    return fetchAssessmentApi<{ success: boolean; categories: Array<{ name: string; questionCount: number; difficulty: string }> }>('/categories', {
      method: 'GET',
    });
  },

  async startAssessment(params: { category: string; difficulty?: string } | string, difficultyArg?: string) {
    const category = typeof params === 'string' ? params : params.category;
    const difficulty = typeof params === 'string' ? (difficultyArg || 'MEDIUM') : (params.difficulty || 'MEDIUM');

    return fetchAssessmentApi<{
      success: boolean;
      error?: string;
      attemptId?: string;
      category?: string;
      difficulty?: string;
      totalQuestions?: number;
      questions?: Array<{ id: string; category: string; difficulty: string; questionText: string; options: string[] }>;
    }>('/start', {
      method: 'POST',
      body: JSON.stringify({ category, difficulty }),
    });
  },

  async submitAssessment(data: {
    attemptId?: string;
    category?: string;
    difficulty?: string;
    answers: Array<{ questionId: string; selectedOptionIndex?: number; selectedOption?: number }>;
    timeTakenSeconds?: number;
  }) {
    return fetchAssessmentApi<{ success: boolean; error?: string; score?: number; passed?: boolean; result?: any }>('/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getHistory() {
    return fetchAssessmentApi<{ success: boolean; attempts: any[] }>('/history', { method: 'GET' });
  },
};
