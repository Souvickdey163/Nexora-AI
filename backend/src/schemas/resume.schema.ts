import { z } from 'zod';

export const createResumeSchema = z.object({
  title: z.string().max(100, 'Resume title cannot exceed 100 characters').optional().default('My Resume'),
});

export const analyzeResumeSchema = z.object({
  targetRole: z.string().max(100, 'Target role cannot exceed 100 characters').optional(),
  targetCompany: z.string().max(100, 'Target company cannot exceed 100 characters').optional(),
  jobDescription: z.string().max(10000, 'Job description cannot exceed 10,000 characters').optional(),
});

export const paginationSchema = z.object({
  page: z.string().transform((val) => Math.max(1, parseInt(val, 10) || 1)).optional().default('1'),
  limit: z.string().transform((val) => Math.min(50, Math.max(1, parseInt(val, 10) || 10))).optional().default('10'),
});
