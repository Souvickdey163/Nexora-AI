"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const mentor_routes_1 = __importDefault(require("./routes/mentor.routes"));
const coding_routes_1 = __importDefault(require("./routes/coding.routes"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const github_routes_1 = __importDefault(require("./routes/github.routes"));
const credit_routes_1 = __importDefault(require("./routes/credit.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const roadmap_routes_1 = __importDefault(require("./routes/roadmap.routes"));
const assessment_routes_1 = __importDefault(require("./routes/assessment.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const placement_routes_1 = __importDefault(require("./routes/placement.routes"));
const learning_routes_1 = __importDefault(require("./routes/learning.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const about_routes_1 = __importDefault(require("./routes/about.routes"));
const support_routes_1 = __importDefault(require("./routes/support.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, cors_1.default)({
    origin: [env_1.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
}));
app.use(express_1.default.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.get('/health', async (req, res) => {
    try {
        await database_1.prisma.$queryRaw `SELECT 1`;
        return res.status(200).json({
            status: 'ok',
            service: 'Nexora Backend Express API',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        return res.status(200).json({
            status: 'ok',
            service: 'Nexora Backend Express API',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
        });
    }
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/resumes', resume_routes_1.default);
app.use('/api/v1/resumes', resume_routes_1.default);
app.use('/api/mentor', mentor_routes_1.default);
app.use('/api/v1/mentor', mentor_routes_1.default);
app.use('/api/coding', coding_routes_1.default);
app.use('/api/v1/coding', coding_routes_1.default);
app.use('/api/interviews', interview_routes_1.default);
app.use('/api/v1/interviews', interview_routes_1.default);
app.use('/api/github', github_routes_1.default);
app.use('/api/v1/github', github_routes_1.default);
app.use('/api/credits', credit_routes_1.default);
app.use('/api/v1/credits', credit_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/v1/payments', payment_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/v1/profile', profile_routes_1.default);
app.use('/api/roadmap', roadmap_routes_1.default);
app.use('/api/v1/roadmap', roadmap_routes_1.default);
app.use('/api/assessment', assessment_routes_1.default);
app.use('/api/v1/assessment', assessment_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/v1/analytics', analytics_routes_1.default);
app.use('/api/placement', placement_routes_1.default);
app.use('/api/v1/placement', placement_routes_1.default);
app.use('/api/learning', learning_routes_1.default);
app.use('/api/v1/learning', learning_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/v1/dashboard', dashboard_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/v1/notifications', notification_routes_1.default);
app.use('/api/activities', activity_routes_1.default);
app.use('/api/v1/activities', activity_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/v1/jobs', job_routes_1.default);
app.use('/api/quiz', quiz_routes_1.default);
app.use('/api/v1/quiz', quiz_routes_1.default);
app.use('/api/about', about_routes_1.default);
app.use('/api/v1/about', about_routes_1.default);
app.use('/api/support', support_routes_1.default);
app.use('/api/v1/support', support_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
