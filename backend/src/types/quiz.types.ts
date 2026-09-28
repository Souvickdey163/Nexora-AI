export interface QuizAnswerOption {
  id: string;
  text: string;
}

export interface NormalizedQuizQuestion {
  id: string;
  question: string;
  description?: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
  answers: QuizAnswerOption[];
  correctAnswer?: string; // ID of correct answer option
  explanation?: string;
}

export interface QuizGenerateRequest {
  category?: string;
  difficulty?: string;
  limit?: number;
  type?: string;
  tags?: string[];
}

export interface QuizSubmitRequest {
  testId: string;
  userAnswers: Record<string, string>; // questionId -> selected answer text or option id
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
  completedAt: Date;
}
