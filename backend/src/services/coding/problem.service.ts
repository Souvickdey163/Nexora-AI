import { prisma } from '../../config/database';
import { Difficulty, Prisma } from '@prisma/client';
import { CodingProblemDTO, TestCaseDTO } from './types';

export class ProblemService {
  /**
   * List coding problems with search, filtering, status, and pagination.
   */
  public async listProblems(
    userId?: string,
    query?: {
      search?: string;
      difficulty?: string;
      topic?: string;
      language?: string;
      status?: string; // SOLVED | ATTEMPTED | NOT_STARTED
      page?: number;
      limit?: number;
    }
  ): Promise<{
    problems: CodingProblemDTO[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, query?.page || 1);
    const limit = Math.min(100, Math.max(1, query?.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.CodingProblemWhereInput = {};

    // Search filter
    if (query?.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
        { topic: { contains: s, mode: 'insensitive' } },
        { tags: { hasSome: [s.toLowerCase()] } },
      ];
    }

    // Difficulty filter
    if (query?.difficulty && query.difficulty !== 'ALL') {
      const diffUpper = query.difficulty.toUpperCase();
      if (Object.values(Difficulty).includes(diffUpper as Difficulty)) {
        where.difficulty = diffUpper as Difficulty;
      }
    }

    // Topic filter
    if (query?.topic && query.topic !== 'ALL') {
      where.topic = { equals: query.topic, mode: 'insensitive' };
    }

    // Language filter
    if (query?.language && query.language !== 'ALL') {
      where.supportedLanguages = { has: query.language.toLowerCase() };
    }

    // Fetch user progress map if authenticated
    let userProgressMap = new Map<string, { isSolved: boolean; isAttempted: boolean }>();
    if (userId) {
      const progressRecords = await prisma.codingProgress.findMany({
        where: { userId },
        select: { problemId: true, isSolved: true, isAttempted: true },
      });
      progressRecords.forEach((p) => {
        userProgressMap.set(p.problemId, { isSolved: p.isSolved, isAttempted: p.isAttempted });
      });
    }

    // Filter by status if requested
    if (query?.status && query.status !== 'ALL' && userId) {
      const targetStatus = query.status.toUpperCase();
      if (targetStatus === 'SOLVED') {
        where.progress = { some: { userId, isSolved: true } };
      } else if (targetStatus === 'ATTEMPTED') {
        where.progress = { some: { userId, isSolved: false, isAttempted: true } };
      } else if (targetStatus === 'NOT_STARTED') {
        where.progress = { none: { userId } };
      }
    }

    const [rawProblems, totalCount] = await Promise.all([
      prisma.codingProblem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          testCases: {
            where: { isHidden: false },
            select: { id: true, input: true, expectedOutput: true, isHidden: true, explanation: true },
          },
          _count: {
            select: { submissions: true },
          },
        },
      }),
      prisma.codingProblem.count({ where }),
    ]);

    // Format DTOs
    const problems: CodingProblemDTO[] = rawProblems.map((p) => {
      const userProg = userProgressMap.get(p.id);
      let userStatus: 'SOLVED' | 'ATTEMPTED' | 'NOT_STARTED' = 'NOT_STARTED';
      if (userProg?.isSolved) userStatus = 'SOLVED';
      else if (userProg?.isAttempted) userStatus = 'ATTEMPTED';

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        source: p.source,
        license: p.license,
        difficulty: p.difficulty,
        topic: p.topic,
        tags: p.tags,
        examples: p.examples,
        constraints: p.constraints,
        supportedLanguages: p.supportedLanguages,
        starterCode: p.starterCode,
        timeLimitMs: p.timeLimitMs,
        memoryLimitMb: p.memoryLimitMb,
        userStatus,
        testCases: p.testCases,
      };
    });

    return {
      problems,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  /**
   * Get single problem by ID or slug.
   * Strips hidden test cases and hidden expected outputs from response.
   */
  public async getProblemByIdOrSlug(idOrSlug: string, userId?: string): Promise<CodingProblemDTO | null> {
    const problem = await prisma.codingProblem.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        testCases: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!problem) return null;

    let userStatus: 'SOLVED' | 'ATTEMPTED' | 'NOT_STARTED' = 'NOT_STARTED';
    if (userId) {
      const prog = await prisma.codingProgress.findUnique({
        where: { userId_problemId: { userId, problemId: problem.id } },
      });
      if (prog?.isSolved) userStatus = 'SOLVED';
      else if (prog?.isAttempted) userStatus = 'ATTEMPTED';
    }

    // Strip hidden test cases & expected outputs
    const safeTestCases: TestCaseDTO[] = problem.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
      isHidden: tc.isHidden,
      explanation: tc.explanation,
    }));

    return {
      id: problem.id,
      slug: problem.slug,
      title: problem.title,
      description: problem.description,
      source: problem.source,
      license: problem.license,
      difficulty: problem.difficulty,
      topic: problem.topic,
      tags: problem.tags,
      examples: problem.examples,
      constraints: problem.constraints,
      supportedLanguages: problem.supportedLanguages,
      starterCode: problem.starterCode,
      timeLimitMs: problem.timeLimitMs,
      memoryLimitMb: problem.memoryLimitMb,
      userStatus,
      testCases: safeTestCases,
    };
  }
}

export const problemService = new ProblemService();
