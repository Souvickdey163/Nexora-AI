import { z } from 'zod';
import { Difficulty, InterviewMode, InterviewType } from '@prisma/client';

export const createInterviewSchema = z.object({
  mode: z.nativeEnum(InterviewMode).default(InterviewMode.MOCK_TEST),
  type: z.nativeEnum(InterviewType).default(InterviewType.TECHNICAL),
  targetRole: z.string().min(2, 'Target role must be at least 2 characters').max(100).default('Software Engineer'),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  durationMinutes: z.number().min(5).max(120).default(30),
  jobDescription: z.string().max(5000).optional(),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid('Valid question UUID required'),
  userText: z.string().max(10000).optional(),
  transcriptText: z.string().max(10000).optional(),
  durationSeconds: z.number().min(0).max(1800).optional().default(30),
});

export const finishInterviewSchema = z.object({
  presentationMetrics: z.object({
    faceVisibilityPct: z.number().min(0).max(100).optional(),
    cameraOrientation: z.string().optional(),
    gazeShifts: z.number().min(0).optional(),
    posture: z.string().optional(),
    movement: z.string().optional(),
  }).optional(),
});

export const logEventSchema = z.object({
  eventType: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
});
