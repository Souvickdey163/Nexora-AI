"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeController = exports.ResumeController = void 0;
const resume_service_1 = require("../services/resume.service");
class ResumeController {
    async createResume(req, res, next) {
        try {
            const userId = req.user.userId;
            const file = req.file;
            if (!file) {
                res.status(400).json({
                    success: false,
                    error: 'No PDF file uploaded. Please select a resume PDF file.',
                });
                return;
            }
            const title = req.body.title;
            const resume = await resume_service_1.resumeService.createResumeWithInitialVersion(userId, file.buffer, file.originalname, file.mimetype, title);
            res.status(201).json({
                success: true,
                message: 'Resume uploaded and processed successfully!',
                data: resume,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async uploadVersion(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumeId = req.params.resumeId;
            const file = req.file;
            if (!file) {
                res.status(400).json({
                    success: false,
                    error: 'No PDF file uploaded. Please select a resume PDF file.',
                });
                return;
            }
            const version = await resume_service_1.resumeService.uploadResumeVersion(userId, resumeId, file.buffer, file.originalname, file.mimetype);
            res.status(201).json({
                success: true,
                message: `Resume updated to Version ${version.versionNumber} successfully!`,
                data: version,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async listResumes(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumes = await resume_service_1.resumeService.listUserResumes(userId);
            res.status(200).json({
                success: true,
                data: resumes,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getAnalyticsSummary(req, res, next) {
        try {
            const userId = req.user.userId;
            const summary = await resume_service_1.resumeService.getAnalyticsSummary(userId);
            res.status(200).json({
                success: true,
                data: summary,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getResumeDetails(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumeId = req.params.resumeId;
            const resume = await resume_service_1.resumeService.getResumeDetails(userId, resumeId);
            res.status(200).json({
                success: true,
                data: resume,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async listVersions(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumeId = req.params.resumeId;
            const resume = await resume_service_1.resumeService.getResumeDetails(userId, resumeId);
            res.status(200).json({
                success: true,
                data: resume.versions,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getVersionDetails(req, res, next) {
        try {
            const userId = req.user.userId;
            const { resumeId, versionId } = req.params;
            const version = await resume_service_1.resumeService.getVersionDetails(userId, resumeId, versionId);
            res.status(200).json({
                success: true,
                data: version,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async downloadVersionFile(req, res, next) {
        try {
            const userId = req.user.userId;
            const { resumeId, versionId } = req.params;
            const filePath = await resume_service_1.resumeService.getVersionFilePath(userId, resumeId, versionId);
            res.sendFile(filePath);
        }
        catch (err) {
            next(err);
        }
    }
    async analyzeVersion(req, res, next) {
        try {
            const userId = req.user.userId;
            const { resumeId, versionId } = req.params;
            const dto = req.body;
            const analysis = await resume_service_1.resumeService.analyzeVersion(userId, resumeId, versionId, dto);
            res.status(200).json({
                success: true,
                message: 'Resume analysis completed successfully!',
                data: analysis,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getAnalysisHistory(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumeId = req.params.resumeId;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const history = await resume_service_1.resumeService.getAnalysisHistory(userId, resumeId, page, limit);
            res.status(200).json({
                success: true,
                data: history,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getSingleAnalysis(req, res, next) {
        try {
            const userId = req.user.userId;
            const { resumeId, analysisId } = req.params;
            const analysis = await resume_service_1.resumeService.getSingleAnalysis(userId, resumeId, analysisId);
            res.status(200).json({
                success: true,
                data: analysis,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getScoreProgress(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumeId = req.params.resumeId;
            const progress = await resume_service_1.resumeService.getScoreProgress(userId, resumeId);
            res.status(200).json({
                success: true,
                data: progress,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteResume(req, res, next) {
        try {
            const userId = req.user.userId;
            const resumeId = req.params.resumeId;
            await resume_service_1.resumeService.deleteResume(userId, resumeId);
            res.status(200).json({
                success: true,
                message: 'Resume and associated resources deleted successfully.',
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ResumeController = ResumeController;
exports.resumeController = new ResumeController();
