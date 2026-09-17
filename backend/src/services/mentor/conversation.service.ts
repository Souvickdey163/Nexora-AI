import { prisma } from '../../config/database';
import { MentorRole } from '@prisma/client';
import { env } from '../../config/env';
import { MentorConversationDTO, MentorMessageDTO } from './types';

export class ConversationService {
  /**
   * Create a new conversation for an authenticated user.
   */
  public async createConversation(userId: string, title?: string): Promise<MentorConversationDTO> {
    const defaultTitle = title && title.trim() ? title.trim() : 'New Conversation';
    const conversation = await prisma.mentorConversation.create({
      data: {
        userId,
        title: defaultTitle,
      },
    });

    return conversation;
  }

  /**
   * List all conversations owned by a user, ordered by recent update.
   */
  public async getUserConversations(userId: string): Promise<MentorConversationDTO[]> {
    const conversations = await prisma.mentorConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return conversations;
  }

  /**
   * Get conversation details and all messages, verifying ownership.
   */
  public async getConversationById(userId: string, conversationId: string): Promise<MentorConversationDTO | null> {
    const conversation = await prisma.mentorConversation.findFirst({
      where: {
        id: conversationId,
        userId, // Server-side ownership check
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return conversation;
  }

  /**
   * Delete a conversation by ID, verifying ownership.
   */
  public async deleteConversation(userId: string, conversationId: string): Promise<boolean> {
    const conversation = await prisma.mentorConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      return false;
    }

    await prisma.mentorConversation.delete({
      where: { id: conversationId },
    });

    return true;
  }

  /**
   * Retrieve messages of a conversation owned by the user.
   */
  public async getMessages(userId: string, conversationId: string): Promise<MentorMessageDTO[]> {
    const conversation = await prisma.mentorConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found or access denied.');
    }

    const messages = await prisma.mentorMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  /**
   * Add a message to a conversation.
   */
  public async addMessage(conversationId: string, role: MentorRole, content: string): Promise<MentorMessageDTO> {
    const message = await prisma.mentorMessage.create({
      data: {
        conversationId,
        role,
        content,
      },
    });

    // Touch conversation updatedAt
    await prisma.mentorConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  /**
   * Update conversation title (e.g., auto-generated from first message).
   */
  public async updateTitle(conversationId: string, title: string): Promise<void> {
    await prisma.mentorConversation.update({
      where: { id: conversationId },
      data: { title: title.trim().substring(0, 80) },
    });
  }

  /**
   * Check if the user has reached their daily message limit.
   */
  public async checkDailyMessageLimit(userId: string): Promise<boolean> {
    const dailyLimit = env.MENTOR_DAILY_MESSAGE_LIMIT || 20;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const messageCount = await prisma.mentorMessage.count({
      where: {
        role: MentorRole.USER,
        createdAt: { gte: startOfDay },
        conversation: { userId },
      },
    });

    return messageCount >= dailyLimit;
  }
}

export const conversationService = new ConversationService();
