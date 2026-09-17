"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const resume_controller_1 = require("../controllers/resume.controller");
const resume_schema_1 = require("../schemas/resume.schema");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: (env_1.env.RESUME_MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
    },
});
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
const uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: isTestEnv ? 1000 : 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many resume upload requests. Please try again later.',
    },
});
const analysisLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: isTestEnv ? 1000 : (env_1.env.RESUME_ANALYSIS_RATE_LIMIT || 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: `Analysis limit reached (${env_1.env.RESUME_ANALYSIS_RATE_LIMIT || 10} per hour). Please try again later.`,
    },
});
router.use(auth_middleware_1.authenticateToken);
router.get('/analytics/summary', resume_controller_1.resumeController.getAnalyticsSummary);
router.post('/', uploadLimiter, upload.single('file'), (0, validate_middleware_1.validateRequest)(resume_schema_1.createResumeSchema), resume_controller_1.resumeController.createResume);
router.get('/', resume_controller_1.resumeController.listResumes);
router.get('/:resumeId', resume_controller_1.resumeController.getResumeDetails);
router.delete('/:resumeId', resume_controller_1.resumeController.deleteResume);
router.post('/:resumeId/versions', uploadLimiter, upload.single('file'), resume_controller_1.resumeController.uploadVersion);
router.get('/:resumeId/versions', resume_controller_1.resumeController.listVersions);
router.get('/:resumeId/versions/:versionId', resume_controller_1.resumeController.getVersionDetails);
router.get('/:resumeId/versions/:versionId/file', resume_controller_1.resumeController.downloadVersionFile);
router.post('/:resumeId/versions/:versionId/analyze', analysisLimiter, (0, validate_middleware_1.validateRequest)(resume_schema_1.analyzeResumeSchema), resume_controller_1.resumeController.analyzeVersion);
router.get('/:resumeId/analyses', resume_controller_1.resumeController.getAnalysisHistory);
router.get('/:resumeId/analyses/:analysisId', resume_controller_1.resumeController.getSingleAnalysis);
router.get('/:resumeId/progress', resume_controller_1.resumeController.getScoreProgress);
exports.default = router;
