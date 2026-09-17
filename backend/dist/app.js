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
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [env_1.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
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
app.use(error_middleware_1.errorHandler);
exports.default = app;
