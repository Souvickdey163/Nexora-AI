"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiClient = exports.AIClientService = void 0;
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class AIClientService {
    serviceUrl;
    constructor() {
        this.serviceUrl = env_1.env.AI_SERVICE_URL || 'http://localhost:8000';
    }
    async analyzeResume(resumeText, parsedResume, targetRole, targetCompany, jobDescription) {
        try {
            logger_1.logger.info(`🤖 Dispatching AI Analysis request to FastAPI microservice (${this.serviceUrl})...`);
            const response = await fetch(`${this.serviceUrl}/api/ai/resume/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText,
                    parsedResume,
                    targetRole,
                    targetCompany,
                    jobDescription,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI Service returned HTTP ${response.status}: ${errorText}`);
            }
            const data = (await response.json());
            logger_1.logger.info(`✅ AI Analysis completed successfully. Overall Score: ${data.overallScore}`);
            return data;
        }
        catch (err) {
            logger_1.logger.warn(`⚠️ FastAPI AI service request failed (${err.message}). Using local deterministic rule-based AI engine fallback.`);
            return this.getLocalFallbackAnalysis(resumeText, parsedResume, targetRole);
        }
    }
    getLocalFallbackAnalysis(resumeText, parsedResume, targetRole) {
        const text = (resumeText || '').toLowerCase();
        const skills = parsedResume?.skills || [];
        const hasSummary = text.includes('summary') || text.includes('profile');
        const hasExperience = text.includes('experience') || text.includes('work');
        const hasEducation = text.includes('education') || text.includes('degree');
        const hasProjects = text.includes('projects') || text.includes('portfolio');
        const atsScore = Math.min(100, 60 + (skills.length > 5 ? 15 : 5) + (hasExperience ? 10 : 0) + (hasEducation ? 15 : 0));
        const skillsScore = Math.min(100, 50 + skills.length * 5);
        const experienceScore = hasExperience ? 80 : 50;
        const educationScore = hasEducation ? 85 : 60;
        const projectsScore = hasProjects ? 80 : 55;
        const overallScore = Math.round(atsScore * 0.3 + skillsScore * 0.25 + experienceScore * 0.2 + projectsScore * 0.15 + educationScore * 0.1);
        return {
            overallScore: Math.min(100, Math.max(0, overallScore)),
            atsScore: Math.min(100, Math.max(0, atsScore)),
            contentScore: 78,
            skillsScore: Math.min(100, Math.max(0, skillsScore)),
            experienceScore,
            educationScore,
            projectsScore,
            formattingScore: 85,
            keywordScore: 75,
            summaryScore: hasSummary ? 80 : 50,
            strengths: [
                'Document format is text-extractable and ATS-compatible.',
                skills.length > 0 ? `Identified ${skills.length} core technical skills.` : 'Clean section structure.',
            ],
            weaknesses: [
                !hasSummary ? 'Consider adding a targeted professional summary.' : 'Bullet points could feature more quantifiable metric results.',
            ],
            missingKeywords: ['REST API', 'PostgreSQL', 'Docker', 'CI/CD'],
            missingSkills: ['Docker', 'AWS'],
            recommendations: [
                'Quantify achievements in your work experience (e.g., "Reduced page load time by 40%").',
                'Tailor key skills to match specific requirements in the job description.',
            ],
            suggestedChanges: [
                {
                    section: 'Experience',
                    current: 'Responsible for writing database queries.',
                    suggested: 'Optimized complex PostgreSQL queries, improving backend response times by 30%.',
                    reason: 'Adds action verb and measurable metric for high impact.',
                },
            ],
            aiProvider: 'fallback-local',
            aiModel: 'nexora-rule-engine',
        };
    }
}
exports.AIClientService = AIClientService;
exports.aiClient = new AIClientService();
