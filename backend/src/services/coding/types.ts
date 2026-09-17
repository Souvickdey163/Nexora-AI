import { Difficulty, SubmissionStatus } from '@prisma/client';

export interface TestCaseDTO {
  id: string;
  input: string;
  expectedOutput?: string; // Stripped if isHidden
  isHidden: boolean;
  explanation?: string | null;
}

export interface CodingProblemDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  source: string;
  license: string;
  difficulty: Difficulty;
  topic: string;
  tags: string[];
  examples: any;
  constraints: string[];
  supportedLanguages: string[];
  starterCode: any;
  timeLimitMs: number;
  memoryLimitMb: number;
  testCases?: TestCaseDTO[];
  userStatus?: 'SOLVED' | 'ATTEMPTED' | 'NOT_STARTED';
  acceptanceRate?: number;
}

export interface RunCodeInput {
  language: string;
  code: string;
}

export interface SubmitCodeInput {
  language: string;
  code: string;
}

export interface ExecutionResultDTO {
  status: SubmissionStatus;
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
    expectedOutput?: string; // Stripped for hidden tests
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
    difficulty: Difficulty;
    topic: string;
    tags: string[];
  }>;
}

export interface CodingMentorQueryInput {
  problemId: string;
  queryType: 'EXPLAIN_PROBLEM' | 'HINT' | 'EXPLAIN_ERROR' | 'REVIEW_CODE' | 'ANALYZE_COMPLEXITY' | 'SUGGEST_OPTIMIZATION';
  language: string;
  userCode: string;
  executionResult?: {
    status?: string;
    stderr?: string;
    compileOutput?: string;
    testsPassed?: number;
    totalTests?: number;
  };
}

