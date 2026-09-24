import { Request, Response } from 'express';
import { interviewService } from '../services/interview/interview.service';
import { recordingService } from '../services/interview/recording.service';
import {
  createInterviewSchema,
  finishInterviewSchema,
  logEventSchema,
  submitAnswerSchema,
} from '../middleware/interview.validator';
import { InterviewMode } from '@prisma/client';
import { logger } from '../utils/logger';

import { ZodError } from 'zod';

function getUserId(req: Request): string | undefined {
  const user = (req as any).user;
  return user?.userId || user?.id;
}

function formatErrorMessage(err: any): string {
  if (err instanceof ZodError) {
    return err.errors.map((e) => e.message || `${e.path.join('.')}: invalid value`).join(', ');
  }
  return err.message || 'An error occurred during request processing.';
}

export class InterviewController {
  /**
   * POST /api/interviews/create
   */
  public async createInterview(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const body = createInterviewSchema.parse(req.body);

      // Atomic Credit Deduction
      const { creditService } = await import('../services/credit.service');
      const { CREDIT_COSTS } = await import('../config/creditCosts');
      const cost =
        body.mode === InterviewMode.LIVE_INTERVIEW
          ? CREDIT_COSTS.LIVE_INTERVIEW
          : CREDIT_COSTS.MOCK_INTERVIEW;

      const desc =
        body.mode === InterviewMode.LIVE_INTERVIEW
          ? 'Live AI Voice & Video Interview'
          : 'AI Mock Interview Practice Session';

      await creditService.deductCredits(userId, cost, 'INTERVIEW_AI', desc);

      const interview = await interviewService.createInterview(userId, body);
      res.status(201).json(interview);
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_CREDITS') {
        res.status(402).json({
          error: err.message,
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: err.requiredCredits,
          currentCredits: err.currentCredits,
        });
        return;
      }
      const errMsg = formatErrorMessage(err);
      logger.error(`Error creating interview: ${errMsg}`);
      res.status(400).json({ error: errMsg });
    }
  }

  /**
   * GET /api/interviews/:id
   */
  public async getInterview(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const interview = await interviewService.getInterviewById(userId, id);
      if (!interview) {
        res.status(404).json({ error: 'Interview session not found or unauthorized.' });
        return;
      }

      res.status(200).json(interview);
    } catch (err: any) {
      logger.error(`Error fetching interview: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to fetch interview.' });
    }
  }

  /**
   * GET /api/interviews
   */
  public async listInterviews(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const mode = req.query.mode as InterviewMode | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await interviewService.listUserInterviews(userId, mode, page, limit);
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Error listing interviews: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to list interviews.' });
    }
  }

  /**
   * POST /api/interviews/:id/answers
   */
  public async submitAnswer(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const body = submitAnswerSchema.parse(req.body);

      const answer = await interviewService.submitAnswer(userId, id, body);
      res.status(200).json(answer);
    } catch (err: any) {
      logger.error(`Error submitting answer: ${err.message}`);
      res.status(400).json({ error: err.message || 'Failed to evaluate answer.' });
    }
  }

  /**
   * POST /api/interviews/:id/next-question
   */
  public async getNextQuestion(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const result = await interviewService.getNextQuestion(userId, id);
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Error generating next question: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to generate question.' });
    }
  }

  /**
   * POST /api/interviews/:id/finish
   */
  public async finishInterview(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const body = finishInterviewSchema.parse(req.body);

      const report = await interviewService.finishInterview(userId, id, body);
      res.status(200).json(report);
    } catch (err: any) {
      logger.error(`Error finishing interview: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to synthesize interview report.' });
    }
  }

  /**
   * POST /api/interviews/:id/events
   */
  public async logEvent(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const body = logEventSchema.parse(req.body);

      const event = await interviewService.logIntegrityEvent(userId, id, body.eventType, body.message);
      res.status(201).json(event);
    } catch (err: any) {
      logger.error(`Error logging integrity event: ${err.message}`);
      res.status(400).json({ error: err.message || 'Failed to log integrity event.' });
    }
  }

  /**
   * DELETE /api/interviews/:id
   */
  public async deleteInterview(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      await interviewService.deleteInterview(userId, id);
      res.status(200).json({ message: 'Interview deleted successfully.' });
    } catch (err: any) {
      logger.error(`Error deleting interview: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to delete interview.' });
    }
  }

  /**
   * POST /api/interviews/:id/recording
   */
  public async uploadRecording(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      if (!req.file) {
        res.status(400).json({ error: 'No recording video blob uploaded.' });
        return;
      }

      const durationSeconds = req.body.durationSeconds ? parseInt(req.body.durationSeconds, 10) : 0;
      const recording = await recordingService.uploadRecording(
        userId,
        id,
        req.file.buffer,
        req.file.mimetype || 'video/webm',
        durationSeconds
      );

      res.status(200).json(recording);
    } catch (err: any) {
      logger.error(`Error uploading recording: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to save recording.' });
    }
  }

  /**
   * GET /api/interviews/:id/recording
   */
  public async streamRecording(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const { buffer, mimeType } = await recordingService.getRecordingBuffer(userId, id);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Accept-Ranges', 'bytes');
      res.status(200).send(buffer);
    } catch (err: any) {
      logger.error(`Error streaming recording: ${err.message}`);
      res.status(404).json({ error: err.message || 'Recording not found or access denied.' });
    }
  }
}

export const interviewController = new InterviewController();
