import { Request, Response } from 'express';
import { problemService } from '../services/coding/problem.service';
import { submissionService } from '../services/coding/submission.service';
import { statsService } from '../services/coding/stats.service';
import { codingMentorService } from '../services/coding/mentor.service';
import { codeforcesService } from '../services/codeforces/codeforces.service';
import { listProblemsQuerySchema, mentorQuerySchema, runCodeSchema, submitCodeSchema } from '../middleware/coding.validator';
import { logger } from '../utils/logger';

function getUserId(req: Request): string | undefined {
  const user = (req as any).user;
  return user?.userId || user?.id;
}

export class CodingController {
  /**
   * GET /api/coding/problems
   */
  public async listProblems(req: Request, res: Response): Promise<void> {
    try {
      const source = (req.query.source as string || '').toUpperCase();
      if (source === 'CODEFORCES') {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
        const search = req.query.search as string | undefined;
        const tag = req.query.topic as string || req.query.tag as string | undefined;

        const cfResult = await codeforcesService.getProblems({
          search,
          tag,
          page,
          limit,
        });

        res.status(200).json({
          problems: cfResult.problems.map((p) => ({
            id: p.id,
            slug: `${p.contestId}-${p.index}`,
            title: p.name,
            description: `Codeforces Problem ${p.contestId}${p.index}. Click official link to solve on Codeforces.`,
            source: 'CODEFORCES',
            license: 'Codeforces License',
            difficulty: (p.rating || 800) < 1200 ? 'EASY' : (p.rating || 800) < 1700 ? 'MEDIUM' : 'HARD',
            topic: p.tags[0] || 'General',
            tags: p.tags,
            examples: [],
            constraints: [],
            supportedLanguages: ['cpp', 'java', 'python'],
            starterCode: {},
            timeLimitMs: 2000,
            memoryLimitMb: 256,
            rating: p.rating,
            solvedCount: p.solvedCount,
            officialUrl: p.officialUrl,
            contestId: p.contestId,
            index: p.index,
          })),
          total: cfResult.total,
          page: cfResult.page,
          totalPages: cfResult.totalPages,
        });
        return;
      }

      const parsedQuery = listProblemsQuerySchema.parse(req.query);
      const userId = getUserId(req);

      const result = await problemService.listProblems(userId, parsedQuery);
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Error in listProblems: ${err.message}`);
      res.status(400).json({ error: err.message || 'Failed to retrieve problems.' });
    }
  }

  /**
   * GET /api/coding/problems/:id
   */
  public async getProblem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = getUserId(req);

      const problem = await problemService.getProblemByIdOrSlug(id, userId);
      if (!problem) {
        res.status(404).json({ error: 'Coding problem not found.' });
        return;
      }

      res.status(200).json(problem);
    } catch (err: any) {
      logger.error(`Error in getProblem: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to retrieve problem details.' });
    }
  }

  /**
   * POST /api/coding/problems/:id/run
   */
  public async runCode(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const body = runCodeSchema.parse(req.body);

      const result = await submissionService.runCode(userId, id, body);
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Error in runCode: ${err.message}`);
      res.status(400).json({ error: err.message || 'Failed to run code execution.' });
    }
  }

  /**
   * POST /api/coding/problems/:id/submit
   */
  public async submitCode(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const body = submitCodeSchema.parse(req.body);

      const result = await submissionService.submitCode(userId, id, body);
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Error in submitCode: ${err.message}`);
      res.status(400).json({ error: err.message || 'Failed to submit code.' });
    }
  }

  /**
   * GET /api/coding/submissions
   */
  public async listSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const problemId = req.query.problemId as string | undefined;
      const submissions = await submissionService.getUserSubmissions(userId, problemId);
      res.status(200).json(submissions);
    } catch (err: any) {
      logger.error(`Error in listSubmissions: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to list submissions.' });
    }
  }

  /**
   * GET /api/coding/submissions/:id
   */
  public async getSubmission(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const sub = await submissionService.getSubmissionById(userId, id);
      if (!sub) {
        res.status(404).json({ error: 'Submission not found or access denied.' });
        return;
      }

      res.status(200).json(sub);
    } catch (err: any) {
      logger.error(`Error in getSubmission: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to retrieve submission.' });
    }
  }

  /**
   * GET /api/coding/stats
   */
  public async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const stats = await statsService.getUserStats(userId);
      res.status(200).json(stats);
    } catch (err: any) {
      logger.error(`Error in getStats: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to compute coding stats.' });
    }
  }

  /**
   * POST /api/coding/mentor
   */
  public async queryMentor(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const body = mentorQuerySchema.parse(req.body);
      const advice = await codingMentorService.getCodingAdvice(userId, body);
      res.status(200).json(advice);
    } catch (err: any) {
      logger.error(`Error in queryMentor: ${err.message}`);
      res.status(400).json({ error: err.message || 'Failed to fetch AI Coding Mentor advice.' });
    }
  }

  /**
   * GET /api/coding/codeforces/problems
   */
  public async getCodeforcesProblems(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string | undefined;
      const rating = req.query.rating ? parseInt(req.query.rating as string, 10) : undefined;
      const minRating = req.query.minRating ? parseInt(req.query.minRating as string, 10) : undefined;
      const maxRating = req.query.maxRating ? parseInt(req.query.maxRating as string, 10) : undefined;
      const tag = req.query.tag as string | undefined;

      const result = await codeforcesService.getProblems({
        search,
        rating,
        minRating,
        maxRating,
        tag,
        page,
        limit,
      });

      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Error in getCodeforcesProblems: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to retrieve Codeforces problems.' });
    }
  }

  /**
   * GET /api/coding/codeforces/daily
   */
  public async getCodeforcesDaily(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      const date = req.query.date as string | undefined;

      const daily = await codeforcesService.getDailyChallenge(userId, date);
      res.status(200).json(daily);
    } catch (err: any) {
      logger.error(`Error in getCodeforcesDaily: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to retrieve Codeforces daily challenge.' });
    }
  }

  /**
   * GET /api/coding/codeforces/contests
   */
  public async getCodeforcesContests(req: Request, res: Response): Promise<void> {
    try {
      const contests = await codeforcesService.getUpcomingContests();
      res.status(200).json(contests);
    } catch (err: any) {
      logger.error(`Error in getCodeforcesContests: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to retrieve Codeforces contests.' });
    }
  }
}

export const codingController = new CodingController();
