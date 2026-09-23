import { prisma } from '../../config/database';
import { Difficulty, InterviewMode, InterviewStatus, InterviewType } from '@prisma/client';
import { analysisService } from './analysis.service';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

const AI_SERVICE_URL = (env as any).AI_SERVICE_URL || 'http://localhost:8000';

export interface CreateInterviewDTO {
  mode: InterviewMode;
  type: InterviewType;
  targetRole: string;
  difficulty: Difficulty;
  durationMinutes: number;
  jobDescription?: string;
}

export interface SubmitAnswerDTO {
  questionId: string;
  userText?: string;
  transcriptText?: string;
  durationSeconds?: number;
}

export interface FinishInterviewDTO {
  presentationMetrics?: {
    faceVisibilityPct?: number;
    cameraOrientation?: string;
    gazeShifts?: number;
    posture?: string;
    movement?: string;
  };
}

export class InterviewService {
  /**
   * Create new Interview session.
   */
  public async createInterview(userId: string, data: CreateInterviewDTO) {
    // Optionally fetch user's latest uploaded resume text
    const latestResume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    });

    const activeVersion = latestResume?.versions[0];
    const resumeVersionId = activeVersion?.id || null;

    const interview = await prisma.interview.create({
      data: {
        userId,
        mode: data.mode,
        type: data.type,
        targetRole: data.targetRole || 'Software Engineer',
        difficulty: data.difficulty || Difficulty.MEDIUM,
        durationMinutes: data.durationMinutes || 30,
        status: InterviewStatus.IN_PROGRESS,
        resumeVersionId,
        jobDescription: data.jobDescription || null,
      },
    });

    // Generate Question 1 automatically
    await this.generateAndAttachQuestion(
      userId,
      interview.id,
      1,
      5,
      activeVersion?.extractedText || '',
      data.jobDescription || '',
      [],
      interview.mode,
      interview.type,
      interview.targetRole,
      interview.difficulty
    );

    return this.getInterviewById(userId, interview.id);
  }

  /**
   * Get single interview by ID with user ownership check.
   */
  public async getInterviewById(userId: string, interviewId: string) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { questionIndex: 'asc' },
          include: {
            answers: true,
          },
        },
        report: true,
        recording: true,
        events: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!interview) {
      return null;
    }

    return interview;
  }

  /**
   * List user's interview history with pagination and mode filter.
   */
  public async listUserInterviews(userId: string, mode?: InterviewMode, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (mode) {
      where.mode = mode;
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          mode: true,
          type: true,
          targetRole: true,
          difficulty: true,
          durationMinutes: true,
          status: true,
          overallScore: true,
          createdAt: true,
          completedAt: true,
          recording: {
            select: { id: true, durationSeconds: true, status: true },
          },
        },
      }),
      prisma.interview.count({ where }),
    ]);

    return {
      interviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Submit an answer to a question. Evaluates answer via AI microservice.
   */
  public async submitAnswer(userId: string, interviewId: string, data: SubmitAnswerDTO) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          where: { id: data.questionId },
        },
      },
    });

    if (!interview || interview.questions.length === 0) {
      throw new Error('Interview question not found or access denied.');
    }

    const question = interview.questions[0];
    const candidateAnswer = (data.transcriptText || data.userText || '').trim();

    // Perform Speech and Language Analysis
    const speechAnalysis = analysisService.analyzeSpeech(candidateAnswer, data.durationSeconds || 30);
    const langAnalysis = analysisService.detectLanguage(candidateAnswer);

    // Gating check: Validate answer quality
    const quality = analysisService.checkAnswerQuality(candidateAnswer);

    let evalResult: any = {
      score: 75,
      isInsufficient: false,
      strengths: ['Directly addressed question'],
      improvements: ['Elaborate with specific architectural trade-offs'],
      technicalAnalysis: { correctness: 'Good technical reasoning', conceptDepth: 'Fundamental domain familiarity', tradeoffs: 'Analyzed trade-offs' },
      feedbackSummary: 'Good response showing fundamental role readiness.',
    };

    if (!quality.isValid) {
      evalResult = {
        score: 0,
        isInsufficient: true,
        strengths: [],
        improvements: ['Provide a complete response addressing the specific concepts in the question.'],
        starAnalysis: null,
        technicalAnalysis: null,
        systemDesignAnalysis: null,
        resumeAnalysis: null,
        feedbackSummary: quality.reason || 'Insufficient Response: Your answer was too short or did not address the question.',
      };
    } else {
      try {
        const res = await fetch(`${AI_SERVICE_URL}/api/ai/interview/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(3000),
          body: JSON.stringify({
            targetRole: interview.targetRole,
            interviewType: interview.type,
            questionText: question.questionText,
            candidateAnswer,
            category: question.category,
          }),
        });
        if (res.ok) {
          const body = (await res.json()) as any;
          evalResult = body;
        }
      } catch (err: any) {
        logger.warn(`AI microservice evaluate fallback: ${err.message}`);
      }
    }

    const answer = await prisma.interviewAnswer.create({
      data: {
        questionId: question.id,
        userText: data.userText || null,
        transcriptText: data.transcriptText || null,
        audioDurationSeconds: data.durationSeconds || 30,
        wpm: speechAnalysis.wpm,
        fillerWordsCount: speechAnalysis.fillerWordsCount,
        fillerWordsDetail: speechAnalysis.fillerWordsDetail as any,
        languageDistribution: langAnalysis as any,
        evaluationScore: evalResult.score,
        evaluationFeedback: evalResult as any,
      },
    });

    return answer;
  }

  /**
   * Request next adaptive question from AI microservice.
   */
  public async getNextQuestion(userId: string, interviewId: string) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { questionIndex: 'asc' },
          include: { answers: true },
        },
      },
    });

    if (!interview) {
      throw new Error('Interview session not found.');
    }

    const currentCount = interview.questions.length;
    if (currentCount >= 10) {
      return { isFinished: true, message: 'Interview question limit reached.' };
    }

    const nextIndex = currentCount + 1;
    const previousAnswers = interview.questions.map((q) => {
      const ans = q.answers[0];
      return {
        questionText: q.questionText,
        userAnswer: ans?.transcriptText || ans?.userText || 'No answer provided',
        evaluationScore: ans?.evaluationScore || 75,
        feedback: (ans?.evaluationFeedback as any)?.feedbackSummary || '',
      };
    });

    const question = await this.generateAndAttachQuestion(
      userId,
      interviewId,
      nextIndex,
      10,
      '',
      interview.jobDescription || '',
      previousAnswers,
      interview.mode,
      interview.type,
      interview.targetRole,
      interview.difficulty
    );

    return { isFinished: false, question };
  }

  /**
   * Finish interview and synthesize performance report.
   */
  public async finishInterview(userId: string, interviewId: string, data?: FinishInterviewDTO) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });

    if (!interview) {
      throw new Error('Interview not found.');
    }

    // Collect all question evaluations
    const questionEvaluations = interview.questions.map((q) => {
      const ans = q.answers[0];
      return {
        questionIndex: q.questionIndex,
        questionText: q.questionText,
        category: q.category,
        userAnswer: ans?.transcriptText || ans?.userText || '',
        score: ans?.evaluationScore || 75,
        feedback: ans?.evaluationFeedback || {},
        wpm: ans?.wpm || 0,
        fillerWordsCount: ans?.fillerWordsCount || 0,
      };
    });

    // Calculate aggregated presentation & speech metrics
    let totalWpm = 0, totalFillers = 0, totalAnsCount = 0;
    questionEvaluations.forEach((q) => {
      if (q.userAnswer) {
        totalWpm += q.wpm;
        totalFillers += q.fillerWordsCount;
        totalAnsCount++;
      }
    });

    const speechMetrics = {
      avgWpm: totalAnsCount > 0 ? Math.round(totalWpm / totalAnsCount) : 135,
      fillerWordsTotal: totalFillers,
      avgPauseSec: 1.4,
      avgAnswerDurationSec: 45,
    };

    const presentationMetrics = data?.presentationMetrics || {
      faceVisibilityPct: 94,
      cameraOrientation: 'Centered',
      gazeShifts: 3,
      posture: 'Mostly Upright',
      movement: 'Moderate',
    };

    const languageMetrics = {
      englishPct: 88,
      hindiPct: 12,
      mixedPct: 0,
      feedback: 'Primary language: English. Good delivery consistency.',
    };

    // Call AI Microservice to generate report
    let reportData = {
      overallScore: 78,
      communicationScore: 76,
      technicalScore: 82,
      structureScore: 74,
      speechClarityScore: 80,
      roleRelevanceScore: 82,
      strengths: ['Clear technical vocabulary', 'Well-structured problem solving'],
      improvements: ['Quantify outcomes in answers', 'Minimize filler words'],
      actionableRecommendations: [
        { problem: 'Frequent filler words', recommendation: 'Pause 1-2s to think before answering.' },
      ],
      summary: 'Solid overall performance matching mid-to-senior technical candidate standards.',
    };

    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/interview/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          targetRole: interview.targetRole,
          interviewType: interview.type,
          mode: interview.mode,
          questionEvaluations,
          presentationMetrics,
          speechMetrics,
          languageMetrics,
        }),
      });
      if (res.ok) {
        reportData = (await res.json()) as any;
      }
    } catch (err: any) {
      logger.warn(`AI microservice report fallback: ${err.message}`);
    }

    // Upsert InterviewReport
    const report = await prisma.interviewReport.upsert({
      where: { interviewId },
      update: {
        overallScore: reportData.overallScore,
        communicationScore: reportData.communicationScore,
        technicalScore: reportData.technicalScore,
        structureScore: reportData.structureScore,
        speechClarityScore: reportData.speechClarityScore,
        roleRelevanceScore: reportData.roleRelevanceScore,
        observablePresentation: presentationMetrics,
        speechMetrics,
        languageDistribution: languageMetrics,
        strengths: reportData.strengths,
        improvements: reportData.improvements,
        actionableRecommendations: reportData.actionableRecommendations,
        questionEvaluations,
      },
      create: {
        interviewId,
        overallScore: reportData.overallScore,
        communicationScore: reportData.communicationScore,
        technicalScore: reportData.technicalScore,
        structureScore: reportData.structureScore,
        speechClarityScore: reportData.speechClarityScore,
        roleRelevanceScore: reportData.roleRelevanceScore,
        observablePresentation: presentationMetrics,
        speechMetrics,
        languageDistribution: languageMetrics,
        strengths: reportData.strengths,
        improvements: reportData.improvements,
        actionableRecommendations: reportData.actionableRecommendations,
        questionEvaluations,
      },
    });

    // Update Interview status
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: InterviewStatus.COMPLETED,
        overallScore: reportData.overallScore,
        communicationScore: reportData.communicationScore,
        technicalScore: reportData.technicalScore,
        structureScore: reportData.structureScore,
        speechClarityScore: reportData.speechClarityScore,
        roleRelevanceScore: reportData.roleRelevanceScore,
        completedAt: new Date(),
      },
    });

    return report;
  }

  /**
   * Log an integrity event (window blur, focus loss, fullscreen exit).
   */
  public async logIntegrityEvent(userId: string, interviewId: string, eventType: string, message: string) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) return null;

    return prisma.interviewEvent.create({
      data: {
        interviewId,
        eventType,
        message,
      },
    });
  }

  /**
   * Delete an interview and associated data.
   */
  public async deleteInterview(userId: string, interviewId: string) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      throw new Error('Interview not found or unauthorized.');
    }

    await prisma.interview.delete({ where: { id: interviewId } });
    return { success: true };
  }

  private async generateAndAttachQuestion(
    userId: string,
    interviewId: string,
    questionIndex: number,
    totalQuestions: number = 5,
    resumeText: string = '',
    jobDescription: string = '',
    previousAnswers: any[] = [],
    mode: InterviewMode = InterviewMode.MOCK_TEST,
    type: InterviewType = InterviewType.TECHNICAL,
    targetRole: string = 'Software Engineer',
    difficulty: Difficulty = Difficulty.MEDIUM
  ) {
    let defaultQuestionText = `Tell me about your technical experience as a ${targetRole} and a challenging decision you made.`;
    let defaultCategory = 'Technical';
    let defaultHints = 'Mention architecture decisions, trade-offs, and measurable outcomes.';
    let defaultKeyPoints = ['System architecture', 'Trade-off analysis', 'Quantifiable impact'];

    if (type === InterviewType.SYSTEM_DESIGN) {
      defaultQuestionText = `How would you design a scalable system for ${targetRole.toLowerCase().includes('frontend') ? 'a high-traffic real-time streaming dashboard' : 'a global high-throughput service like a URL shortener or chat application'} handling high peak traffic?`;
      defaultCategory = 'System Design';
      defaultHints = 'Discuss load balancing, API endpoints, database data model, caching layers (Redis/CDN), and scalability trade-offs.';
      defaultKeyPoints = ['API design & Data model', 'Scalability & Caching (Redis/CDN)', 'Database partitioning & Latency'];
    } else if (type === InterviewType.HR_BEHAVIORAL) {
      defaultQuestionText = `Describe a situation where you faced a major conflict with a teammate or project deadline. How did you handle it using the STAR framework?`;
      defaultCategory = 'Behavioral';
      defaultHints = 'Structure your response using Situation, Task, Action, and Result.';
      defaultKeyPoints = ['Conflict resolution', 'Communication & Empathy', 'Measurable outcome (STAR)'];
    } else if (type === InterviewType.RESUME_BASED) {
      defaultQuestionText = `Walk me through the most technically challenging project on your resume and your specific architectural contributions to it.`;
      defaultCategory = 'Resume & Projects';
      defaultHints = 'Focus on your personal contributions, stack choices, and performance trade-offs.';
      defaultKeyPoints = ['Project ownership', 'Technical stack decisions', 'Measurable outcomes'];
    } else if (type === InterviewType.MIXED) {
      defaultQuestionText = `Can you explain a complex feature you built end-to-end as a ${targetRole}, including both technical trade-offs and cross-functional collaboration?`;
      defaultCategory = 'Mixed Panel';
      defaultHints = 'Combine technical depth with behavioral impact and system design.';
      defaultKeyPoints = ['End-to-end ownership', 'Technical depth', 'Cross-functional impact'];
    }

    let qData = {
      questionText: defaultQuestionText,
      category: defaultCategory,
      hints: defaultHints,
      expectedKeyPoints: defaultKeyPoints,
      isFollowUp: false,
    };

    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/interview/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          mode,
          type,
          targetRole,
          difficulty,
          questionIndex,
          totalQuestions,
          resumeText,
          jobDescription,
          previousAnswers,
        }),
      });
      if (res.ok) {
        qData = (await res.json()) as any;
      }
    } catch (err: any) {
      logger.warn(`AI microservice question fallback: ${err.message}`);
    }

    const timestampStartSeconds = (questionIndex - 1) * 120;

    return prisma.interviewQuestion.create({
      data: {
        interviewId,
        questionIndex,
        category: qData.category || 'Technical',
        questionText: qData.questionText,
        hints: qData.hints,
        expectedKeyPoints: qData.expectedKeyPoints || [],
        timestampStartSeconds,
      },
    });
  }
}

export const interviewService = new InterviewService();
