"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env'), override: true });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env'), override: true });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)).default('5001'),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:3000'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: zod_1.z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default('30d'),
    BCRYPT_SALT_ROUNDS: zod_1.z.string().transform((val) => parseInt(val, 10)).default('10'),
    SMTP_HOST: zod_1.z.string().optional().default('smtp.gmail.com'),
    SMTP_PORT: zod_1.z.string().transform((val) => parseInt(val, 10)).default('587'),
    SMTP_USER: zod_1.z.string().optional().default(''),
    SMTP_PASSWORD: zod_1.z.string().optional().default(''),
    SMTP_FROM: zod_1.z.string().optional().default('Nexora AI <no-reply@nexora.ai>'),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional().default(''),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional().default(''),
    GOOGLE_CALLBACK_URL: zod_1.z.string().optional().default('http://localhost:5001/api/auth/google/callback'),
    GITHUB_CLIENT_ID: zod_1.z.string().optional().default(''),
    GITHUB_CLIENT_SECRET: zod_1.z.string().optional().default(''),
    GITHUB_CALLBACK_URL: zod_1.z.string().optional().default('http://localhost:5001/api/auth/github/callback'),
    LINKEDIN_CLIENT_ID: zod_1.z.string().optional().default(''),
    LINKEDIN_CLIENT_SECRET: zod_1.z.string().optional().default(''),
    LINKEDIN_CALLBACK_URL: zod_1.z.string().optional().default('http://localhost:5001/api/auth/linkedin/callback'),
    RESUME_UPLOAD_DIR: zod_1.z.string().default('./uploads/resumes'),
    RESUME_MAX_FILE_SIZE_MB: zod_1.z.string().transform((val) => parseInt(val, 10)).default('10'),
    AI_SERVICE_URL: zod_1.z.string().default('http://localhost:8000'),
    RESUME_ANALYSIS_RATE_LIMIT: zod_1.z.string().transform((val) => parseInt(val, 10)).default('10'),
    MENTOR_MAX_MESSAGE_LENGTH: zod_1.z.string().transform((val) => parseInt(val, 10)).default('4000'),
    MENTOR_MAX_CONTEXT_MESSAGES: zod_1.z.string().transform((val) => parseInt(val, 10)).default('20'),
    MENTOR_DAILY_MESSAGE_LIMIT: zod_1.z.string().transform((val) => parseInt(val, 10)).default('20'),
    MENTOR_RATE_LIMIT_PER_MINUTE: zod_1.z.string().transform((val) => parseInt(val, 10)).default('10'),
    RAZORPAY_KEY_ID: zod_1.z.string().optional().default('rzp_test_mockkeyid123'),
    RAZORPAY_KEY_SECRET: zod_1.z.string().optional().default('rzp_test_mocksecret123'),
    RAZORPAY_WEBHOOK_SECRET: zod_1.z.string().optional().default('whsec_test_mocksecret123'),
    GEMINI_API_KEY: zod_1.z.string().optional().default(''),
    GEMINI_MODEL: zod_1.z.string().optional().default('gemini-2.5-flash'),
    CODEFORCES_API_KEY: zod_1.z.string().optional().default(''),
    CODEFORCES_API_SECRET: zod_1.z.string().optional().default(''),
    FREECODECAMP_GRAPHQL_URL: zod_1.z.string().optional().default('https://api.freecodecamp.org/graphql'),
    JOBVETTA_API_KEY: zod_1.z.string().optional().default('jobvetta_secret_key_2026'),
    ADZUNA_APP_ID: zod_1.z.string().optional().default('7648c839'),
    ADZUNA_APP_KEY: zod_1.z.string().optional().default('9b6f83468b35f2844ded09aaa14ddf5d'),
    QUIZAPI_BASE_URL: zod_1.z.string().optional().default('https://quizapi.io/api/v1'),
    QUIZAPI_KEY: zod_1.z.string().optional().default('qa_sk_a712db1bf9fd3bcdf4b58daa1257d11874d6124c'),
});
const parseEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
        throw new Error('Environment configuration error');
    }
    return result.data;
};
exports.env = parseEnv();
