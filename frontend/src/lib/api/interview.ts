import { getStoredAccessToken } from './auth';

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api')
    .replace(/\/auth\/?$/, '')
    .replace(/\/+$/, '') + '/interviews';

async function fetchInterviewApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      let rawErr = data.error || data.detail || `Server error (${res.status})`;
      if (Array.isArray(rawErr)) {
        rawErr = rawErr.map((e: any) => e.message || JSON.stringify(e)).join(', ');
      } else if (typeof rawErr === 'object') {
        rawErr = rawErr.message || JSON.stringify(rawErr);
      }
      return {
        success: false,
        error: rawErr,
        status: res.status,
      };
    }

    return {
      success: true,
      data,
      status: res.status,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error. Failed to connect to Nexora backend server.',
    };
  }
}

export type InterviewTypeOption = 'TECHNICAL' | 'HR_BEHAVIORAL' | 'SYSTEM_DESIGN' | 'MIXED' | 'RESUME_BASED';

export interface InterviewQuestionDTO {
  id: string;
  interviewId: string;
  questionIndex: number;
  category: string;
  questionText: string;
  hints?: string;
  expectedKeyPoints: string[];
  timestampStartSeconds?: number;
  answers?: Array<{
    id: string;
    userText?: string;
    transcriptText?: string;
    audioDurationSeconds?: number;
    wpm?: number;
    fillerWordsCount?: number;
    evaluationScore?: number;
    evaluationFeedback?: any;
  }>;
}

export interface InterviewReportDTO {
  id: string;
  interviewId: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  structureScore: number;
  speechClarityScore: number;
  roleRelevanceScore: number;
  observablePresentation: any;
  speechMetrics: any;
  languageDistribution: any;
  strengths: string[];
  improvements: string[];
  actionableRecommendations: Array<{ problem: string; recommendation: string }>;
  questionEvaluations: any[];
  createdAt: string;
}

export interface InterviewDTO {
  id: string;
  mode: 'MOCK_TEST' | 'LIVE_INTERVIEW';
  type: InterviewTypeOption;
  targetRole: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  durationMinutes: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  overallScore?: number;
  communicationScore?: number;
  technicalScore?: number;
  structureScore?: number;
  speechClarityScore?: number;
  roleRelevanceScore?: number;
  jobDescription?: string;
  createdAt: string;
  completedAt?: string;
  questions?: InterviewQuestionDTO[];
  report?: InterviewReportDTO;
  recording?: {
    id: string;
    durationSeconds: number;
    status: string;
  };
}

export const interviewApi = {
  async createInterview(payload: {
    mode: 'MOCK_TEST' | 'LIVE_INTERVIEW';
    type: InterviewTypeOption;
    targetRole: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    durationMinutes: number;
    jobDescription?: string;
  }) {
    return fetchInterviewApi<InterviewDTO>('/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getInterview(id: string) {
    return fetchInterviewApi<InterviewDTO>(`/${id}`);
  },

  async listInterviews(params?: { mode?: 'MOCK_TEST' | 'LIVE_INTERVIEW'; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.mode) query.append('mode', params.mode);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchInterviewApi<{ interviews: InterviewDTO[]; total: number; page: number; totalPages: number }>(
      `/${queryString}`
    );
  },

  async submitAnswer(
    id: string,
    payload: { questionId: string; userText?: string; transcriptText?: string; durationSeconds?: number }
  ) {
    return fetchInterviewApi(`/${id}/answers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getNextQuestion(id: string) {
    return fetchInterviewApi<{ isFinished: boolean; message?: string; question?: InterviewQuestionDTO }>(
      `/${id}/next-question`,
      { method: 'POST' }
    );
  },

  async finishInterview(id: string, payload?: { presentationMetrics?: any }) {
    return fetchInterviewApi<InterviewReportDTO>(`/${id}/finish`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  async logEvent(id: string, eventType: string, message: string) {
    return fetchInterviewApi(`/${id}/events`, {
      method: 'POST',
      body: JSON.stringify({ eventType, message }),
    });
  },

  async deleteInterview(id: string) {
    return fetchInterviewApi(`/${id}`, {
      method: 'DELETE',
    });
  },

  async uploadRecording(id: string, videoBlob: Blob, durationSeconds: number) {
    const formData = new FormData();
    formData.append('video', videoBlob, `interview_${id}.webm`);
    formData.append('durationSeconds', durationSeconds.toString());

    return fetchInterviewApi(`/${id}/recording`, {
      method: 'POST',
      body: formData,
    });
  },

  getRecordingStreamUrl(id: string) {
    const token = getStoredAccessToken();
    return `${BASE_URL}/${id}/recording?token=${token || ''}`;
  },
};
