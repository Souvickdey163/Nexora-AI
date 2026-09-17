import { getStoredAccessToken } from './auth';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/auth\/?$/, '').replace(/\/+$/, '') + '/coding';

async function fetchCodingApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };

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
      return {
        success: false,
        error: data.error || data.detail || `Server error (${res.status})`,
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

export interface CodingProblemDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  source: string;
  license: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  tags: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  supportedLanguages: string[];
  starterCode: Record<string, string>;
  timeLimitMs: number;
  memoryLimitMb: number;
  userStatus?: 'SOLVED' | 'ATTEMPTED' | 'NOT_STARTED';
  testCases?: Array<{
    id: string;
    input: string;
    expectedOutput?: string;
    isHidden: boolean;
    explanation?: string;
  }>;
}

export interface ListProblemsResponse {
  problems: CodingProblemDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ExecutionResultDTO {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED';
  testsPassed: number;
  totalTests: number;
  runtimeMs: number;
  memoryKb: number;
  isMock?: boolean;
  providerName?: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  testSummary: Array<{
    testIndex: number;
    passed: boolean;
    input: string;
    actualOutput: string;
    expectedOutput?: string;
    error?: string;
    isHidden: boolean;
  }>;
}

export interface CodingStatsDTO {
  totalSolved: number;
  totalAttempted: number;
  totalProblems: number;
  accuracy: number;
  currentStreak: number;
  difficultyBreakdown: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  topicPerformance: Array<{
    topic: string;
    solved: number;
    total: number;
    accuracy: number;
  }>;
  recommendedTopic?: string;
  recommendedReason?: string;
  recommendedProblems?: Array<{
    id: string;
    slug: string;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    topic: string;
    tags: string[];
  }>;
}

export interface CodingSubmissionHistoryItem {
  id: string;
  problemId: string;
  language: string;
  status: string;
  testsPassed: number;
  totalTests: number;
  runtimeMs?: number;
  memoryKb?: number;
  createdAt: string;
  problem: {
    title: string;
    slug: string;
    difficulty: string;
    topic: string;
  };
}

export const codingApi = {
  // List problems with search, filtering, and pagination
  async listProblems(params?: {
    search?: string;
    difficulty?: string;
    topic?: string;
    language?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.difficulty && params.difficulty !== 'ALL') query.append('difficulty', params.difficulty);
    if (params?.topic && params.topic !== 'ALL') query.append('topic', params.topic);
    if (params?.language && params.language !== 'ALL') query.append('language', params.language);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchCodingApi<ListProblemsResponse>(`/problems${queryString}`);
  },

  // Get problem by ID or slug
  async getProblem(idOrSlug: string) {
    return fetchCodingApi<CodingProblemDTO>(`/problems/${idOrSlug}`);
  },

  // Run code against visible test cases only
  async runCode(problemId: string, language: string, code: string) {
    return fetchCodingApi<ExecutionResultDTO>(`/problems/${problemId}/run`, {
      method: 'POST',
      body: JSON.stringify({ language, code }),
    });
  },

  // Submit code against hidden test cases
  async submitCode(problemId: string, language: string, code: string) {
    return fetchCodingApi<{ submissionId: string; result: ExecutionResultDTO }>(`/problems/${problemId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ language, code }),
    });
  },

  // Get user coding statistics & streak
  async getStats() {
    return fetchCodingApi<CodingStatsDTO>('/stats');
  },

  // Get user submissions for a problem or global history
  async getSubmissions(problemId?: string) {
    const query = problemId ? `?problemId=${problemId}` : '';
    return fetchCodingApi<CodingSubmissionHistoryItem[]>(`/submissions${query}`);
  },

  // Query AI Coding Mentor ("Ask Nexus AI")
  async queryMentor(payload: {
    problemId: string;
    queryType: 'EXPLAIN_PROBLEM' | 'HINT' | 'EXPLAIN_ERROR' | 'REVIEW_CODE' | 'ANALYZE_COMPLEXITY' | 'SUGGEST_OPTIMIZATION';
    language: string;
    userCode: string;
    executionResult?: any;
  }) {
    return fetchCodingApi<{ message: string; model: string; provider: string }>('/mentor', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
