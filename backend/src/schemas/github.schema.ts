import { z } from 'zod';

export const connectGitHubSchema = z.object({
  username: z
    .string()
    .min(1, 'GitHub username is required.')
    .max(39, 'GitHub username cannot exceed 39 characters.')
    .regex(/^[a-zA-Z0-9-_\.]+$/, 'Invalid GitHub username format.'),
});

export const analyzeRepoSchema = z.object({
  owner: z.string().min(1, 'Repository owner is required.'),
  repo: z.string().min(1, 'Repository name is required.'),
});

export const generateResumeBulletsSchema = z.object({
  repositoryId: z.string().uuid('Invalid repository ID.'),
});

export const generateInterviewQuestionsSchema = z.object({
  repositoryId: z.string().uuid('Invalid repository ID.'),
});
