import { getStoredAccessToken } from './auth';

const getQuizApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const cleanBase = envUrl.replace(/\/auth\/?$/, '').replace(/\/+$/, '');
  return `${cleanBase}/quiz`;
};

async function fetchQuizApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const API_BASE_URL = getQuizApiBaseUrl();
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
    return { success: false, error: err?.message || 'Failed to connect to quiz service.' };
  }
}

export interface QuizAnswerOption {
  id: string;
  text: string;
}

export interface ClientQuizQuestion {
  id: string;
  question: string;
  description?: string;
  difficulty?: string;
  category?: string;
  answers: QuizAnswerOption[];
}

export interface QuizSession {
  testId: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  createdAt: string;
  questions: ClientQuizQuestion[];
}

export interface QuestionEvaluation {
  id: string;
  question: string;
  answers: QuizAnswerOption[];
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizReport {
  success: boolean;
  testId: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  score: number;
  accuracyPct: number;
  topicScores: Record<string, number>;
  questions: QuestionEvaluation[];
  completedAt: string;
  error?: string;
}

export interface QuizMockTestSummary {
  id: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  score: number;
  accuracyPct: number;
  completedAt: string;
}

export const quizApi = {
  /**
   * POST /api/quiz/generate
   * Generates a new MCQ mock test with questions from QuizAPI
   */
  async generateMockTest(params: {
    category?: string;
    difficulty?: string;
    limit?: number;
    type?: string;
    tags?: string[];
  }): Promise<{ success: boolean; testSession?: QuizSession; error?: string }> {
    return fetchQuizApi('/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  /**
   * POST /api/quiz/submit
   * Submits user selected answers and returns evaluated scorecard & explanations
   */
  async submitMockTest(testId: string, userAnswers: Record<string, string>): Promise<QuizReport> {
    return fetchQuizApi('/submit', {
      method: 'POST',
      body: JSON.stringify({ testId, userAnswers }),
    });
  },

  /**
   * GET /api/quiz/history
   * Retrieves user's past completed mock test attempts
   */
  async getMockTestHistory(): Promise<{
    success: boolean;
    count?: number;
    history?: QuizMockTestSummary[];
  }> {
    return fetchQuizApi('/history');
  },

  /**
   * GET /api/quiz/categories
   * Retrieves available technical subjects & resume-recommended topics
   */
  async getCategories(): Promise<{
    success: boolean;
    allCategories?: string[];
    recommendedTopics?: string[];
    userSkills?: string[];
  }> {
    return fetchQuizApi('/categories');
  },
};
