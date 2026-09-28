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
    return fetchAssessmentApi<{
      success: boolean;
      categories: Array<{ id: string; name: string; displayName: string; questionCount: number; difficulty: string }>;
    }>('/categories', {
      method: 'GET',
    });
  },

  async getActiveSession() {
    return fetchAssessmentApi<{
      success: boolean;
      activeSession?: {
        assessmentId: string;
        category: string;
        difficulty: string;
        status: string;
        startedAt: string;
        expiresAt: string;
        totalQuestions: number;
        answersData: Array<{ questionId: string; selectedOptionIndex: number; timeSpentSeconds: number }>;
        questions: Array<{ id: string; category: string; topic: string; difficulty: string; questionText: string; options: string[] }>;
        integrityEvents: any[];
      };
    }>('/active', {
      method: 'GET',
    });
  },

  async startAssessment(params: { category: string; difficulty?: string; questionCount?: number } | string, difficultyArg?: string) {
    const category = typeof params === 'string' ? params : params.category;
    const difficulty = typeof params === 'string' ? (difficultyArg || 'INTERMEDIATE') : (params.difficulty || 'INTERMEDIATE');
    const questionCount = typeof params === 'object' && params.questionCount ? params.questionCount : 10;

    return fetchAssessmentApi<{
      success: boolean;
      error?: string;
      code?: string;
      requiredCredits?: number;
      currentCredits?: number;
      assessmentId?: string;
      attemptId?: string;
      category?: string;
      difficulty?: string;
      totalQuestions?: number;
      startedAt?: string;
      expiresAt?: string;
      answersData?: any[];
      questions?: Array<{ id: string; category: string; topic: string; difficulty: string; questionText: string; options: string[] }>;
    }>('/start', {
      method: 'POST',
      body: JSON.stringify({ category, difficulty, questionCount }),
    });
  },

  async saveAnswer(assessmentId: string, questionId: string, selectedOptionIndex: number, timeSpentSeconds: number = 0) {
    return fetchAssessmentApi<{ success: boolean; answeredCount?: number; error?: string }>(`/${assessmentId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedOptionIndex, timeSpentSeconds }),
    });
  },

  async logIntegrityEvent(assessmentId: string, eventType: string, details?: string) {
    return fetchAssessmentApi<{ success: boolean; eventCount?: number }>(`/${assessmentId}/integrity-event`, {
      method: 'POST',
      body: JSON.stringify({ eventType, details }),
    });
  },

  async submitAssessment(assessmentIdOrData: string | { attemptId?: string; answers?: any[] }, finalAnswers?: any[]) {
    let assessmentId: string;
    let payload: any = {};

    if (typeof assessmentIdOrData === 'string') {
      assessmentId = assessmentIdOrData;
      if (finalAnswers) payload.answers = finalAnswers;
    } else {
      assessmentId = assessmentIdOrData.attemptId || '';
      if (assessmentIdOrData.answers) payload.answers = assessmentIdOrData.answers;
    }

    const endpoint = assessmentId ? `/${assessmentId}/submit` : '/submit';

    return fetchAssessmentApi<{
      success: boolean;
      error?: string;
      score?: number;
      passed?: boolean;
      result?: any;
    }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getResult(assessmentId: string) {
    return fetchAssessmentApi<{
      success: boolean;
      error?: string;
      result?: any;
    }>(`/${assessmentId}/result`, {
      method: 'GET',
    });
  },

  async getHistory() {
    return fetchAssessmentApi<{
      success: boolean;
      attempts: any[];
    }>('/history', {
      method: 'GET',
    });
  },

  async getAnalytics() {
    return fetchAssessmentApi<{
      success: boolean;
      analytics?: {
        totalAssessments: number;
        averageScore: number;
        bestCategory: string;
        domainProficiency: Record<string, number>;
        categoryTrends: Record<string, Array<{ attemptNumber: number; score: number; date: string }>>;
      };
    }>('/analytics', {
      method: 'GET',
    });
  },
};
