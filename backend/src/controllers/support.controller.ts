import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { supportService } from '../services/support.service';

const createTicketSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address format.').optional(),
  category: z.string().min(1, 'Please select a support category.'),
  priority: z.string().optional().default('MEDIUM'),
  subject: z.string().min(3, 'Subject must be at least 3 characters long.').max(250, 'Subject is too long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.').max(5000, 'Description is too long.'),
  attachmentUrl: z.string().optional(),
});

export class SupportController {
  /**
   * POST /api/support/tickets
   * Authenticated user creates a new support ticket
   */
  async createTicket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required to submit a support request.',
        });
      }

      const parsed = createTicketSchema.parse(req.body);
      const ticket = await supportService.createTicket(req.user.userId, parsed);

      return res.status(201).json({
        success: true,
        message: 'Support request created successfully.',
        data: {
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
          },
        },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: err.flatten().fieldErrors,
        });
      }
      return next(err);
    }
  }

  /**
   * GET /api/support/tickets
   * Authenticated user fetches their support ticket history
   */
  async getUserTickets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required to view your support tickets.',
        });
      }

      const tickets = await supportService.getUserTickets(req.user.userId);

      return res.status(200).json({
        success: true,
        data: {
          tickets,
          count: tickets.length,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/support/tickets/:id
   * Authenticated user views a specific ticket (with ownership check)
   */
  async getTicketById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required.',
        });
      }

      const { id } = req.params;
      const ticket = await supportService.getTicketById(req.user.userId, id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: 'Support ticket not found or access denied.',
        });
      }

      return res.status(200).json({
        success: true,
        data: { ticket },
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/support/admin/tickets (Admin/Support role)
   */
  async getAllTicketsAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
      }

      const filters = {
        status: req.query.status as string,
        category: req.query.category as string,
        priority: req.query.priority as string,
      };

      const tickets = await supportService.getAllTicketsAdmin(req.user.userId, filters);
      return res.status(200).json({ success: true, data: { tickets } });
    } catch (err: any) {
      return res.status(403).json({ success: false, error: err.message || 'Forbidden' });
    }
  }

  /**
   * PATCH /api/support/admin/tickets/:id (Admin/Support role update)
   */
  async updateTicketStatusAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
      }

      const { id } = req.params;
      const { status, adminResponse } = req.body;

      const ticket = await supportService.updateTicketStatusAdmin(req.user.userId, id, status, adminResponse);
      return res.status(200).json({ success: true, data: { ticket } });
    } catch (err: any) {
      return res.status(403).json({ success: false, error: err.message || 'Forbidden' });
    }
  }
}

export const supportController = new SupportController();
