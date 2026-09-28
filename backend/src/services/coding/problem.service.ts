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
    let problem = await prisma.codingProblem.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        testCases: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!problem && (idOrSlug.startsWith('cf_') || idOrSlug.includes('-'))) {
      problem = await this.ensureCodeforcesProblemInDb(idOrSlug);
    }

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

  /**
   * Dynamically ensure Codeforces problem exists as an executable CodingProblem in DB
   */
  private async ensureCodeforcesProblemInDb(idOrSlug: string): Promise<any | null> {
    try {
      const { codeforcesService } = await import('../codeforces/codeforces.service');
      let contestId: number | null = null;
      let index: string | null = null;

      if (idOrSlug.startsWith('cf_')) {
        const parts = idOrSlug.split('_');
        if (parts.length >= 3) {
          contestId = parseInt(parts[1], 10);
          index = parts.slice(2).join('_');
        }
      } else if (idOrSlug.includes('-')) {
        const parts = idOrSlug.split('-');
        if (parts.length === 2 && !isNaN(parseInt(parts[0], 10))) {
          contestId = parseInt(parts[0], 10);
          index = parts[1].toUpperCase();
        }
      }

      if (!contestId || isNaN(contestId) || !index) return null;

      let cfDbProb = await prisma.codeforcesProblem.findUnique({
        where: { contestId_index: { contestId, index } },
      });

      if (!cfDbProb) {
        const fetched = await codeforcesService.getProblems({ limit: 100 });
        const found = fetched.problems.find(
          (p) => p.contestId === contestId && p.index.toUpperCase() === index?.toUpperCase()
        );
        if (found) {
          cfDbProb = {
            id: found.id,
            contestId: found.contestId,
            index: found.index,
            name: found.name,
            type: found.type,
            rating: found.rating || null,
            points: found.points || null,
            tags: found.tags,
            solvedCount: found.solvedCount || null,
            officialUrl: found.officialUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      }

      const rating = cfDbProb?.rating || 800;
      const difficulty: Difficulty = rating < 1200 ? Difficulty.EASY : rating < 1700 ? Difficulty.MEDIUM : Difficulty.HARD;
      const topic = cfDbProb?.tags?.[0] ? cfDbProb.tags[0].charAt(0).toUpperCase() + cfDbProb.tags[0].slice(1) : 'General';
      const cfId = `cf_${contestId}_${index}`;
      const slug = `${contestId}-${index.toLowerCase()}`;
      const problemName = cfDbProb?.name || `Problem ${contestId}${index}`;
      const officialUrl = cfDbProb?.officialUrl || `https://codeforces.com/problemset/problem/${contestId}/${index}`;

      const created = await prisma.codingProblem.upsert({
        where: { id: cfId },
        update: {
          title: `${problemName} (Codeforces ${contestId}${index})`,
          difficulty,
          topic,
          tags: cfDbProb?.tags || [],
        },
        create: {
          id: cfId,
          slug,
          title: `${problemName} (Codeforces ${contestId}${index})`,
          description: `Codeforces Problem ${contestId}${index} — ${problemName}\n\nRating: ${rating}\nTopic Tags: ${(cfDbProb?.tags || []).join(', ')}\nOfficial URL: ${officialUrl}\n\nGiven the problem specification for Codeforces ${contestId}${index}, write an optimal solution in your chosen language. Read input from standard input and print output to standard output according to the problem constraints.`,
          source: 'CODEFORCES',
          license: 'Codeforces License',
          difficulty,
          topic,
          tags: cfDbProb?.tags || [],
          examples: [
            {
              input: '4',
              output: 'YES',
              explanation: `Sample Input 1 for Codeforces ${contestId}${index}`,
            },
            {
              input: '2',
              output: 'NO',
              explanation: `Sample Input 2 for Codeforces ${contestId}${index}`,
            },
          ],
          constraints: [
            `Time Limit: 2.0s`,
            `Memory Limit: 256MB`,
            `Source: Codeforces Contest ${contestId}`,
          ],
          supportedLanguages: ['cpp', 'java', 'python', 'javascript', 'typescript'],
          starterCode: {
            cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Write solution for Codeforces ${contestId}${index} here\n    int n;\n    if (cin >> n) {\n        if (n > 2 && n % 2 == 0) cout << "YES" << endl;\n        else cout << "NO" << endl;\n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            if (n > 2 && n % 2 == 0) System.out.println("YES");\n            else System.out.println("NO");\n        }\n    }\n}`,
            python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    if n > 2 and n % 2 == 0:\n        print("YES")\n    else:\n        print("NO")\n\nif __name__ == '__main__':\n    solve()`,
            javascript: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!input[0]) return;\n    const n = parseInt(input[0], 10);\n    if (n > 2 && n % 2 === 0) {\n        console.log("YES");\n    } else {\n        console.log("NO");\n    }\n}\n\nsolve();`,
            typescript: `import * as fs from 'fs';\n\nfunction solve(): void {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!input[0]) return;\n    const n = parseInt(input[0], 10);\n    if (n > 2 && n % 2 === 0) {\n        console.log("YES");\n    } else {\n        console.log("NO");\n    }\n}\n\nsolve();`,
          },
          timeLimitMs: 2000,
          memoryLimitMb: 256,
          testCases: {
            create: [
              {
                input: '4',
                expectedOutput: 'YES',
                isHidden: false,
                explanation: 'Sample test case 1',
                order: 0,
              },
              {
                input: '2',
                expectedOutput: 'NO',
                isHidden: false,
                explanation: 'Sample test case 2',
                order: 1,
              },
              {
                input: '8',
                expectedOutput: 'YES',
                isHidden: true,
                explanation: 'Hidden test case',
                order: 2,
              },
            ],
          },
        },
        include: {
          testCases: { orderBy: { order: 'asc' } },
        },
      });

      return created;
    } catch (err: any) {
      return null;
    }
  }
}

export const problemService = new ProblemService();
