import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { paymentService } from '../services/payment.service';

export class PaymentController {
  /**
   * GET /api/payments/packages
   */
  async getPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const packages = paymentService.getPackages();
      res.status(200).json({
        success: true,
        data: { packages },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/payments/create-order
   */
  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { packageId } = req.body;
      if (!packageId) {
        res.status(400).json({ success: false, error: 'packageId is required' });
        return;
      }

      const orderData = await paymentService.createOrder(req.user.userId, packageId);
      res.status(201).json({
        success: true,
        message: 'Razorpay order created successfully',
        data: orderData,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/payments/verify-payment
   */
  async verifyPayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        res.status(400).json({
          success: false,
          error: 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are required.',
        });
        return;
      }

      const result = await paymentService.verifyPayment(
        req.user.userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          creditsGranted: result.creditsGranted,
          credits: result.credits,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/payments/webhook
   */
  async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = (req.headers['x-razorpay-signature'] as string) || '';
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const result = await paymentService.handleWebhook(rawBody, signature);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(err.statusCode || 400).json({
        success: false,
        error: err.message || 'Webhook processing failed',
      });
    }
  }
}

export const paymentController = new PaymentController();
