import { Request, Response, NextFunction } from 'express';
import { githubService } from '../services/github.service';
import { logger } from '../utils/logger';

export class GitHubController {
  private getUserId(req: Request): string | null {
    const user = (req as any).user;
    return user?.userId || user?.id || null;
  }

  // GET /api/github/profile
  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      }
      const profile = await githubService.getConnectedProfile(userId);
      return res.json({
        success: true,
        connected: Boolean(profile),
        profile,
      });
    } catch (err: any) {
      logger.error(`Error in getProfile: ${err.message}`);
      return res.status(400).json({ success: false, error: err.message || 'Failed to fetch GitHub profile.' });
    }
  }

  // POST /api/github/connect
  public async connect(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      }

      const { username } = req.body || {};
      if (!username || typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({
          success: false,
          error: 'GitHub username is required.',
        });
      }

      const cleanUsername = username.trim();
      const account = await githubService.connectAccount(userId, cleanUsername);
      const profile = await githubService.getConnectedProfile(userId);

      return res.json({
        success: true,
        message: `GitHub account @${account.username} connected successfully.`,
        account,
        profile,
      });
    } catch (err: any) {
      logger.error(`Error in connect GitHub: ${err.message}`);
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to connect GitHub account.',
      });
    }
  }

  // POST /api/github/disconnect
  public async disconnect(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      }
      await githubService.disconnectAccount(userId);
      return res.json({
        success: true,
        message: 'GitHub account disconnected.',
      });
    } catch (err: any) {
      logger.error(`Error in disconnect GitHub: ${err.message}`);
      return res.status(400).json({ success: false, error: err.message || 'Failed to disconnect GitHub account.' });
    }
  }

  // GET /api/github/repositories
  public async getRepositories(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      }
      const { search, filter, language } = req.query;
      const repos = await githubService.getRepositories(
        userId,
        search as string,
        filter as string,
        language as string
      );
      return res.json({
        success: true,
        count: repos.length,
        repositories: repos,
      });
    } catch (err: any) {
      logger.error(`Error in getRepositories: ${err.message}`);
      return res.status(400).json({ success: false, error: err.message || 'Failed to fetch repositories.' });
    }
  }

  // POST /api/github/repositories/:owner/:repo/analyze
  public async analyzeRepository(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      }

      // Atomic Credit Deduction (2 credits)
      const { creditService } = await import('../services/credit.service');
      const { CREDIT_COSTS } = await import('../config/creditCosts');
      await creditService.deductCredits(
        userId,
        CREDIT_COSTS.GITHUB_ANALYSIS,
        'GITHUB_AI',
        `GitHub AI Repo Analysis (${req.params.owner}/${req.params.repo})`
      );

      const { owner, repo } = req.params;
      const analysis = await githubService.analyzeRepository(userId, owner, repo);

      return res.json({
        success: true,
        message: `Repository ${owner}/${repo} analyzed successfully.`,
        analysis,
      });
    } catch (err: any) {
      logger.error(`Error analyzing repository ${req.params.owner}/${req.params.repo}: ${err.message}`);

      if (err.code === 'INSUFFICIENT_CREDITS') {
        return res.status(402).json({
          success: false,
          error: err.message,
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: err.requiredCredits,
          currentCredits: err.currentCredits,
        });
      }

      return res.status(400).json({ success: false, error: err.message || 'Failed to analyze repository.' });
    }
  }

  // GET /api/github/resume-alignment
  public async getResumeAlignment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      }
      const alignment = await githubService.getResumeAlignment(userId);
      return res.json({
        success: true,
        alignment,
      });
    } catch (err: any) {
      logger.error(`Error in getResumeAlignment: ${err.message}`);
      return res.status(400).json({ success: false, error: err.message || 'Failed to calculate resume alignment.' });
    }
  }
}

export const githubController = new GitHubController();
