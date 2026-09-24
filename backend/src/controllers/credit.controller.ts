import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { creditService } from '../services/credit.service';

export class CreditController {
  /**
   * GET /api/credits/balance
   */
  async getBalance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const credits = await creditService.getUserBalance(req.user.userId);
      res.status(200).json({
        success: true,
        credits,
        data: { credits },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/credits/history
   */
  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const history = await creditService.getTransactionHistory(req.user.userId);
      res.status(200).json({
        success: true,
        transactions: history,
        data: { transactions: history },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const creditController = new CreditController();
