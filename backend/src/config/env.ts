import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env file reliably from process.cwd() or relative backend paths
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5001'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  BCRYPT_SALT_ROUNDS: z.string().transform((val) => parseInt(val, 10)).default('10'),

  // Email Config
  SMTP_HOST: z.string().optional().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)).default('587'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default('Nexora AI <no-reply@nexora.ai>'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_CALLBACK_URL: z.string().optional().default('http://localhost:5001/api/auth/google/callback'),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().optional().default(''),
  GITHUB_CLIENT_SECRET: z.string().optional().default(''),
  GITHUB_CALLBACK_URL: z.string().optional().default('http://localhost:5001/api/auth/github/callback'),

  // LinkedIn OAuth
  LINKEDIN_CLIENT_ID: z.string().optional().default(''),
  LINKEDIN_CLIENT_SECRET: z.string().optional().default(''),
  LINKEDIN_CALLBACK_URL: z.string().optional().default('http://localhost:5001/api/auth/linkedin/callback'),

  // AI Resume Intelligence Config
  RESUME_UPLOAD_DIR: z.string().default('./uploads/resumes'),
  RESUME_MAX_FILE_SIZE_MB: z.string().transform((val) => parseInt(val, 10)).default('10'),
  AI_SERVICE_URL: z.string().default('http://localhost:8000'),
  RESUME_ANALYSIS_RATE_LIMIT: z.string().transform((val) => parseInt(val, 10)).default('10'),

  // AI Career Mentor Free-Tier Protection Limits
  MENTOR_MAX_MESSAGE_LENGTH: z.string().transform((val) => parseInt(val, 10)).default('4000'),
  MENTOR_MAX_CONTEXT_MESSAGES: z.string().transform((val) => parseInt(val, 10)).default('20'),
  MENTOR_DAILY_MESSAGE_LIMIT: z.string().transform((val) => parseInt(val, 10)).default('20'),
  MENTOR_RATE_LIMIT_PER_MINUTE: z.string().transform((val) => parseInt(val, 10)).default('10'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    throw new Error('Environment configuration error');
  }
  return result.data;
};

export const env = parseEnv();
