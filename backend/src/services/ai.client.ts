import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AIAnalysisResult } from '../types/resume.types';
import { ParsedResumeData } from '../utils/resumeParser';
import crypto from 'crypto';

export class AIClientService {
  private serviceUrl: string;

  constructor() {
    this.serviceUrl = env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  public async analyzeResume(
    resumeText: string,
    parsedResume?: ParsedResumeData,
    targetRole?: string,
    targetCompany?: string,
    jobDescription?: string
  ): Promise<AIAnalysisResult> {
    const textLength = (resumeText || '').length;
    const textHash = crypto.createHash('sha256').update(resumeText || '').digest('hex').substring(0, 12);
    const skillCount = parsedResume?.skills?.length || 0;
    const jdLength = (jobDescription || '').length;

    logger.info(
      `🤖 Dispatching AI Analysis Request | Service: ${this.serviceUrl} | Text Length: ${textLength} | Hash: ${textHash} | Skills: ${skillCount} | Target Role: "${targetRole || 'Software Engineer'}" | JD Length: ${jdLength}`
    );

    try {
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

      const data = (await response.json()) as AIAnalysisResult;
      logger.info(`✅ AI Analysis completed. Overall Score: ${data.overallScore} | Provider: ${data.aiProvider}`);
      return data;
    } catch (err: any) {
      logger.warn(`⚠️ FastAPI AI service request failed (${err.message}). Using local dynamic ATS scoring engine.`);
      return this.getLocalFallbackAnalysis(resumeText, parsedResume, targetRole, jobDescription);
    }
  }

  public async sendMentorChat(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    careerContext: Record<string, any> = {}
  ): Promise<{ message: string; model: string; provider: string }> {
    logger.info(`🤖 Dispatching AI Mentor Chat Request to FastAPI microservice (${this.serviceUrl})`);

    try {
      const response = await fetch(`${this.serviceUrl}/api/ai/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          conversationHistory,
          careerContext,
        }),
      });

      if (response.status === 429) {
        throw new Error('AI Mentor is temporarily unavailable because the free AI quota has been reached. Please try again later.');
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI Microservice returned HTTP ${response.status}: ${errText}`);
      }

      const data = (await response.json()) as { message: string; model: string; provider: string };
      return data;
    } catch (err: any) {
      logger.error(`❌ Mentor Chat API Call Error: ${err.message}`);
      throw err;
    }
  }

  public getLocalFallbackAnalysis(
    resumeText: string,
    parsedResume?: ParsedResumeData,
    targetRole?: string,
    jobDescription?: string
  ): AIAnalysisResult {
    const text = (resumeText || '').toLowerCase();
    const skills = parsedResume?.skills || [];
    const role = (targetRole || 'software engineer').toLowerCase();

    // Target role expectations
    const roleSkillRequirements: Record<string, string[]> = {
      java: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API', 'Microservices', 'Docker', 'AWS'],
      python: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker', 'REST API', 'Git'],
      machine: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL'],
      data: ['Python', 'Pandas', 'NumPy', 'SQL', 'Machine Learning', 'Scikit-Learn', 'Tableau'],
      frontend: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Redux'],
      react: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Jest'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Redis', 'TypeScript'],
      fullstack: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Git', 'Nginx'],
    };

    let targetSkills = roleSkillRequirements['fullstack'];
    for (const key of Object.keys(roleSkillRequirements)) {
      if (role.includes(key)) {
        targetSkills = roleSkillRequirements[key];
        break;
      }
    }

    if (jobDescription) {
      const jdLower = jobDescription.toLowerCase();
      const extras = ['docker', 'aws', 'kubernetes', 'graphql', 'redis', 'ci/cd', 'system design'].filter((k) =>
        jdLower.includes(k)
      );
      if (extras.length > 0) {
        targetSkills = Array.from(new Set([...targetSkills, ...extras.map((e) => e.toUpperCase())]));
      }
    }

    const detectedLower = new Set(skills.map((s) => s.toLowerCase()));
    if (detectedLower.size === 0) {
      ['java', 'python', 'javascript', 'typescript', 'react', 'next.js', 'node.js', 'postgresql', 'docker', 'aws', 'tensorflow'].forEach((k) => {
        if (text.includes(k)) detectedLower.add(k);
      });
    }

    const matchedSkills = targetSkills.filter((ts) => detectedLower.has(ts.toLowerCase()) || text.includes(ts.toLowerCase()));
    const missingSkills = targetSkills.filter((ts) => !matchedSkills.includes(ts));

    const hasSummary = text.includes('summary') || text.includes('profile');
    const hasExperience = text.includes('experience') || text.includes('work');
    const hasEducation = text.includes('education') || text.includes('degree');
    const hasProjects = text.includes('projects') || text.includes('portfolio');

    const metricsCount = (text.match(/\b(?:\d+%|\$\d+|\d+\+|\d+x)\b/g) || []).length;
    const actionVerbs = ['developed', 'engineered', 'designed', 'implemented', 'scaled', 'optimized', 'built', 'architected'];
    const actionVerbCount = actionVerbs.filter((v) => text.includes(v)).length;

    const keywordScore = Math.min(98, Math.max(35, Math.round((matchedSkills.length / Math.max(1, targetSkills.length)) * 100)));
    const skillsScore = Math.min(98, Math.max(30, Math.round(matchedSkills.length * 15 + detectedLower.size * 3 + 25)));
    const atsScore = Math.min(96, Math.max(40, 50 + (detectedLower.size > 0 ? 10 : 0) + (hasExperience ? 10 : 0) + (hasEducation ? 10 : 0) + Math.min(15, metricsCount * 3)));
    const experienceScore = Math.min(95, Math.max(35, 45 + (hasExperience ? 20 : 0) + Math.min(20, actionVerbCount * 4) + Math.min(10, metricsCount * 2)));
    const educationScore = Math.min(95, Math.max(40, hasEducation ? 85 : 45));
    const projectsScore = Math.min(95, Math.max(35, hasProjects ? 80 : 40));
    const formattingScore = Math.min(95, Math.max(50, text.length > 300 ? 85 : 60));
    const summaryScore = hasSummary ? 85 : 45;
    const contentScore = Math.round((experienceScore + projectsScore + Math.min(95, 50 + metricsCount * 5)) / 3);

    const overallScore = Math.min(
      98,
      Math.max(
        35,
        Math.round(atsScore * 0.30 + skillsScore * 0.25 + keywordScore * 0.20 + experienceScore * 0.15 + educationScore * 0.10)
      )
    );

    const strengths: string[] = [];
    if (matchedSkills.length > 0) {
      strengths.push(`Matched core technical skills for target role: ${matchedSkills.slice(0, 4).join(', ')}.`);
    }
    if (metricsCount > 0) {
      strengths.push(`Included ${metricsCount} quantifiable performance indicators.`);
    }
    if (hasEducation) {
      strengths.push('Educational background clearly formatted.');
    }
    if (strengths.length === 0) {
      strengths.push('Document text is clear and readable for ATS parsers.');
    }

    const weaknesses: string[] = [];
    if (missingSkills.length > 0) {
      const cloudGaps = missingSkills.filter((s) => ['AWS', 'DOCKER', 'KUBERNETES', 'CI/CD'].includes(s.toUpperCase()));
      const feGaps = missingSkills.filter((s) => ['REACT', 'NEXT.JS', 'TYPESCRIPT', 'JAVASCRIPT', 'TAILWIND CSS'].includes(s.toUpperCase()));
      const beGaps = missingSkills.filter((s) => ['NODE.JS', 'PYTHON', 'JAVA', 'POSTGRESQL', 'GRAPHQL', 'REDIS'].includes(s.toUpperCase()));

      const categorizedGaps: string[] = [];
      const matchedUpper = matchedSkills.map((s) => s.toUpperCase());
      if (cloudGaps.length > 0 && !matchedUpper.some((s) => ['AWS', 'DOCKER', 'KUBERNETES'].includes(s))) {
        categorizedGaps.push(...cloudGaps);
      }
      if (feGaps.length > 0 && !matchedUpper.some((s) => ['REACT', 'NEXT.JS', 'TYPESCRIPT'].includes(s))) {
        categorizedGaps.push(...feGaps);
      }
      if (beGaps.length > 0 && !matchedUpper.some((s) => ['NODE.JS', 'PYTHON', 'JAVA', 'POSTGRESQL'].includes(s))) {
        categorizedGaps.push(...beGaps);
      }

      const displayGaps = categorizedGaps.length > 0 ? categorizedGaps.slice(0, 4) : missingSkills.slice(0, 4);
      weaknesses.push(`Missing key keywords for ${targetRole || 'target role'}: ${displayGaps.join(', ')}.`);
    }
    if (metricsCount === 0) {
      weaknesses.push('Work experience bullet points lack measurable outcome metrics (%, $, numbers).');
    }
    if (!hasSummary) {
      weaknesses.push('Missing professional summary at the top of the resume.');
    }

    const recommendations = [
      `Add missing target role skills (${missingSkills.slice(0, 3).join(', ')}) to your skills section if applicable.`,
      'Use standard ATS section headings (Skills, Experience, Education, Projects).',
      'Quantify job achievements with clear metric outcomes.',
    ];

    const suggestedChanges = missingSkills.length > 0 ? [
      {
        section: 'Skills',
        current: 'Current Skills block',
        suggested: `Add ${missingSkills.slice(0, 3).join(', ')} to technical skills list.`,
        reason: `Increases ATS keyword density match for ${targetRole || 'target role'}.`,
      },
    ] : [];

    return {
      overallScore,
      atsScore,
      contentScore,
      skillsScore,
      experienceScore,
      educationScore,
      projectsScore,
      formattingScore,
      keywordScore,
      summaryScore,
      strengths,
      weaknesses,
      missingKeywords: missingSkills,
      missingSkills,
      recommendations,
      suggestedChanges,
      aiProvider: 'fallback-local',
      aiModel: 'nexora-dynamic-ats-engine',
    };
  }
}

export const aiClient = new AIClientService();
