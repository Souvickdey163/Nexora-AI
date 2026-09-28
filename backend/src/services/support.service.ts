import { prisma } from '../config/database';
import { SupportTicketCategory, SupportTicketPriority, SupportTicketStatus } from '@prisma/client';
import { emailService } from './email.service';
import { logger } from '../utils/logger';

export interface CreateSupportTicketInput {
  name?: string;
  email?: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  attachmentUrl?: string;
}

export class SupportService {
  /**
   * Helper to map frontend string category to database enum
   */
  private parseCategory(categoryStr: string): SupportTicketCategory {
    const norm = categoryStr.toUpperCase().replace(/\s+&?\s+/g, '_');
    if (norm.includes('ACCOUNT') || norm.includes('AUTH')) return SupportTicketCategory.ACCOUNT_AUTH;
    if (norm.includes('RESUME')) return SupportTicketCategory.RESUME_INTELLIGENCE;
    if (norm.includes('MOCK') || norm.includes('INTERVIEW')) return SupportTicketCategory.MOCK_INTERVIEW;
    if (norm.includes('CODING')) return SupportTicketCategory.CODING_ARENA;
    if (norm.includes('PAYMENT') || norm.includes('CREDIT')) return SupportTicketCategory.PAYMENTS_CREDITS;
    if (norm.includes('CAREER')) return SupportTicketCategory.CAREER_INTELLIGENCE;
    if (norm.includes('TECHNICAL')) return SupportTicketCategory.TECHNICAL_ISSUE;
    if (norm.includes('FEEDBACK')) return SupportTicketCategory.GENERAL_FEEDBACK;
    return SupportTicketCategory.OTHER;
  }

  /**
   * Helper to map frontend string priority to database enum
   */
  private parsePriority(priorityStr: string): SupportTicketPriority {
    const norm = priorityStr.toUpperCase();
    if (norm === 'LOW') return SupportTicketPriority.LOW;
    if (norm === 'HIGH') return SupportTicketPriority.HIGH;
    if (norm === 'CRITICAL') return SupportTicketPriority.CRITICAL;
    return SupportTicketPriority.MEDIUM;
  }

  /**
   * Generates a unique ticket number e.g. NEX-2026-X8F92
   */
  private async generateUniqueTicketNumber(): Promise<string> {
    const year = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      const randomSegment = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ticketNumber = `NEX-${year}-${randomSegment}`;
      const existing = await prisma.supportTicket.findUnique({
        where: { ticketNumber },
      });
      if (!existing) return ticketNumber;
    }
    return `NEX-${year}-${Date.now().toString(36).toUpperCase().slice(-5)}`;
  }

  /**
   * Creates a new support ticket for the authenticated user
   */
  async createTicket(userId: string, input: CreateSupportTicketInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!user) {
      throw new Error('User account not found.');
    }

    const name = input.name || `${user.firstName} ${user.lastName}`.trim() || 'Nexora User';
    const email = input.email || user.email;
    const ticketNumber = await this.generateUniqueTicketNumber();
    const categoryEnum = this.parseCategory(input.category);
    const priorityEnum = this.parsePriority(input.priority);

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        name,
        email,
        category: categoryEnum,
        priority: priorityEnum,
        subject: input.subject,
        description: input.description,
        attachmentUrl: input.attachmentUrl || null,
        status: SupportTicketStatus.OPEN,
      },
    });

    // Create in-app notification
    await prisma.userNotification.create({
      data: {
        userId,
        title: `Support Ticket #${ticketNumber} Created`,
        message: `Your ticket regarding "${input.subject}" has been received.`,
        type: 'SYSTEM',
        link: '/contact',
      },
    }).catch((err) => logger.warn(`Failed to log support notification: ${err.message}`));

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId,
        actionType: 'SUPPORT_TICKET_CREATED',
        title: `Created Support Ticket #${ticketNumber}`,
        metadata: { ticketNumber, category: categoryEnum, priority: priorityEnum },
      },
    }).catch((err) => logger.warn(`Failed to log support activity: ${err.message}`));

    // Async email notification
    emailService.sendSupportTicketConfirmationEmail({
      email,
      name,
      ticketNumber,
      subject: input.subject,
      category: categoryEnum,
      priority: priorityEnum,
      status: 'OPEN',
      description: input.description,
    }).catch((err) => logger.warn(`Email notification dispatch warning: ${err.message}`));

    return ticket;
  }

  /**
   * Returns all support tickets belonging to the authenticated user
   */
  async getUserTickets(userId: string) {
    return prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns a specific ticket if it belongs to the authenticated user (prevents IDOR)
   */
  async getTicketById(userId: string, ticketIdOrNumber: string) {
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        userId,
        OR: [
          { id: ticketIdOrNumber },
          { ticketNumber: ticketIdOrNumber },
        ],
      },
    });

    return ticket;
  }

  /**
   * Admin: Get all tickets with optional filtering
   */
  async getAllTicketsAdmin(adminUserId: string, filters?: { status?: string; category?: string; priority?: string }) {
    // Verify admin role
    const admin = await prisma.user.findUnique({ where: { id: adminUserId }, select: { role: true } });
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPPORT')) {
      throw new Error('Unauthorized. Admin/Support credentials required.');
    }

    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.priority) where.priority = filters.priority;

    return prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  /**
   * Admin: Update ticket status & append response
   */
  async updateTicketStatusAdmin(adminUserId: string, ticketId: string, status: SupportTicketStatus, adminResponse?: string) {
    const admin = await prisma.user.findUnique({ where: { id: adminUserId }, select: { role: true } });
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPPORT')) {
      throw new Error('Unauthorized. Admin/Support credentials required.');
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(adminResponse ? { adminResponse } : {}),
      },
    });

    // Notify user of ticket update
    await prisma.userNotification.create({
      data: {
        userId: ticket.userId,
        title: `Support Ticket #${ticket.ticketNumber} Updated`,
        message: `Status updated to ${status}.`,
        type: 'SYSTEM',
        link: '/contact',
      },
    }).catch(() => {});

    return ticket;
  }
}

export const supportService = new SupportService();
