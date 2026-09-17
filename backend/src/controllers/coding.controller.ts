import { Request, Response } from 'express';
import { problemService } from '../services/coding/problem.service';
import { submissionService } from '../services/coding/submission.service';
import { statsService } from '../services/coding/stats.service';
import { codingMentorService } from '../services/coding/mentor.service';
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
}

export const codingController = new CodingController();
