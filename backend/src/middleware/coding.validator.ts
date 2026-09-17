import { z } from 'zod';

export const runCodeSchema = z.object({
  language: z.string().min(1, 'Language is required').max(30),
  code: z.string().min(1, 'Code cannot be empty').max(50000, 'Code exceeds 50,000 character limit'),
});

export const submitCodeSchema = z.object({
  language: z.string().min(1, 'Language is required').max(30),
  code: z.string().min(1, 'Code cannot be empty').max(50000, 'Code exceeds 50,000 character limit'),
});

export const mentorQuerySchema = z.object({
  problemId: z.string().uuid('Valid problem UUID is required'),
  queryType: z.enum([
    'EXPLAIN_PROBLEM',
    'HINT',
    'EXPLAIN_ERROR',
    'REVIEW_CODE',
    'ANALYZE_COMPLEXITY',
    'SUGGEST_OPTIMIZATION',
  ]),
  language: z.string().min(1, 'Language is required'),
  userCode: z.string().max(50000).default(''),
  executionResult: z.object({
    status: z.string().optional(),
    stderr: z.string().optional(),
    compileOutput: z.string().optional(),
    testsPassed: z.number().optional(),
    totalTests: z.number().optional(),
  }).optional(),
});

export const listProblemsQuerySchema = z.object({
  search: z.string().optional(),
  difficulty: z.string().optional(),
  topic: z.string().optional(),
  language: z.string().optional(),
  status: z.enum(['ALL', 'SOLVED', 'ATTEMPTED', 'NOT_STARTED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
