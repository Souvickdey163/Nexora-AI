import { prisma } from '../../config/database';
import { SubmissionStatus } from '@prisma/client';
import { codingExecutionService, TestCaseInput } from './execution.provider';
import { ExecutionResultDTO, RunCodeInput, SubmitCodeInput } from './types';
import { logger } from '../../utils/logger';

export class SubmissionService {
  /**
   * Run user code against visible test cases ONLY.
   */
  public async runCode(userId: string, problemId: string, input: RunCodeInput): Promise<ExecutionResultDTO> {
    const problem = await prisma.codingProblem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!problem) {
      throw new Error('Coding problem not found.');
    }

    const langLower = input.language.toLowerCase();
    if (!problem.supportedLanguages.includes(langLower)) {
      throw new Error(`Language "${input.language}" is not supported for this problem.`);
    }

    const visibleCases: TestCaseInput[] = problem.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: false,
    }));

    const provider = codingExecutionService.getProvider();
    logger.info(`🏃 Executing /run for user ${userId} on problem ${problem.slug} using ${provider.name}`);

    return provider.run(input.language, input.code, visibleCases, problem.timeLimitMs, problem.memoryLimitMb);
  }

  /**
   * Submit user code against ALL test cases (hidden + visible).
   * Persists submission record and updates CodingProgress in DB.
   */
  public async submitCode(userId: string, problemId: string, input: SubmitCodeInput): Promise<{
    submissionId: string;
    result: ExecutionResultDTO;
  }> {
    const problem = await prisma.codingProblem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!problem) {
      throw new Error('Coding problem not found.');
    }

    const langLower = input.language.toLowerCase();
    if (!problem.supportedLanguages.includes(langLower)) {
      throw new Error(`Language "${input.language}" is not supported for this problem.`);
    }

    const allCases: TestCaseInput[] = problem.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
    }));

    const provider = codingExecutionService.getProvider();
    logger.info(`🚀 Executing /submit for user ${userId} on problem ${problem.slug} using ${provider.name}`);

    const result = await provider.submit(
      input.language,
      input.code,
      allCases,
      problem.timeLimitMs,
      problem.memoryLimitMb
    );

    // Persist CodingSubmission
    const submission = await prisma.codingSubmission.create({
      data: {
        userId,
        problemId,
        language: input.language,
        code: input.code,
        status: result.status,
        testsPassed: result.testsPassed,
        totalTests: result.totalTests,
        runtimeMs: result.runtimeMs,
        memoryKb: result.memoryKb,
        stdout: result.stdout || null,
        stderr: result.stderr || null,
        compileOutput: result.compileOutput || null,
      },
    });

    // Upsert CodingProgress
    const isSolved = result.status === SubmissionStatus.ACCEPTED;
    const existingProgress = await prisma.codingProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    if (existingProgress) {
      await prisma.codingProgress.update({
        where: { id: existingProgress.id },
        data: {
          isSolved: existingProgress.isSolved || isSolved,
          isAttempted: true,
          attemptsCount: { increment: 1 },
          lastSubmittedAt: new Date(),
          solvedAt: !existingProgress.isSolved && isSolved ? new Date() : existingProgress.solvedAt,
        },
      });
    } else {
      await prisma.codingProgress.create({
        data: {
          userId,
          problemId,
          isSolved,
          isAttempted: true,
          attemptsCount: 1,
          lastSubmittedAt: new Date(),
          solvedAt: isSolved ? new Date() : null,
        },
      });
    }

    return {
      submissionId: submission.id,
      result,
    };
  }

  /**
   * Get user submission history for a problem or list all user submissions.
   */
  public async getUserSubmissions(userId: string, problemId?: string, limit: number = 20) {
    const where: any = { userId };
    if (problemId) {
      where.problemId = problemId;
    }

    return prisma.codingSubmission.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        problemId: true,
        language: true,
        status: true,
        testsPassed: true,
        totalTests: true,
        runtimeMs: true,
        memoryKb: true,
        createdAt: true,
        problem: {
          select: { title: true, slug: true, difficulty: true, topic: true },
        },
      },
    });
  }

  /**
   * Get single submission details for a user.
   */
  public async getSubmissionById(userId: string, submissionId: string) {
    const sub = await prisma.codingSubmission.findUnique({
      where: { id: submissionId },
      include: {
        problem: {
          select: { id: true, title: true, slug: true, difficulty: true },
        },
      },
    });

    if (!sub || sub.userId !== userId) {
      return null;
    }

    return sub;
  }
}

export const submissionService = new SubmissionService();
