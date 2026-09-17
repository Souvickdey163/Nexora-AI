import { Request, Response } from 'express';
import { conversationService } from '../services/mentor/conversation.service';
import { mentorService } from '../services/mentor/mentor.service';
import { logger } from '../utils/logger';

function getUserId(req: Request): string | undefined {
  const user = (req as any).user;
  return user?.userId || user?.id;
}

export class MentorController {
  /**
   * POST /api/mentor/conversations
   */
  public async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized user.' });
        return;
      }

      const { title } = req.body;
      const conversation = await conversationService.createConversation(userId, title);
      res.status(201).json(conversation);
    } catch (err: any) {
      logger.error(`Error in createConversation: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to create conversation.' });
    }
  }

  /**
   * GET /api/mentor/conversations
   */
  public async listConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized user.' });
        return;
      }

      const conversations = await conversationService.getUserConversations(userId);
      res.status(200).json(conversations);
    } catch (err: any) {
      logger.error(`Error in listConversations: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to list conversations.' });
    }
  }

  /**
   * GET /api/mentor/conversations/:id
   */
  public async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized user.' });
        return;
      }

      const conversation = await conversationService.getConversationById(userId, id);
      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found or access denied.' });
        return;
      }

      res.status(200).json(conversation);
    } catch (err: any) {
      logger.error(`Error in getConversation: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to retrieve conversation.' });
    }
  }

  /**
   * DELETE /api/mentor/conversations/:id
   */
  public async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized user.' });
        return;
      }

      const deleted = await conversationService.deleteConversation(userId, id);
      if (!deleted) {
        res.status(404).json({ error: 'Conversation not found or access denied.' });
        return;
      }

      res.status(200).json({ message: 'Conversation deleted successfully.', conversationId: id });
    } catch (err: any) {
      logger.error(`Error in deleteConversation: ${err.message}`);
      res.status(500).json({ error: err.message || 'Failed to delete conversation.' });
    }
  }

  /**
   * GET /api/mentor/conversations/:id/messages
   */
  public async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized user.' });
        return;
      }

      const messages = await conversationService.getMessages(userId, id);
      res.status(200).json(messages);
    } catch (err: any) {
      logger.error(`Error in getMessages: ${err.message}`);
      res.status(404).json({ error: err.message || 'Failed to fetch messages.' });
    }
  }

  /**
   * POST /api/mentor/conversations/:id/messages or POST /api/mentor/chat
   */
  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized user.' });
        return;
      }

      const conversationId = req.params.id || req.body.conversationId;
      const { message } = req.body;

      const responseDTO = await mentorService.handleUserChat(userId, {
        conversationId,
        message,
      });

      res.status(200).json(responseDTO);
    } catch (err: any) {
      logger.error(`Error in sendMessage: ${err.message}`);

      const errMsg = err.message || '';

      if (errMsg.includes('quota has been reached')) {
        res.status(429).json({ error: errMsg });
        return;
      }

      if (errMsg.includes('ECONNREFUSED') || errMsg.includes('fetch failed')) {
        res.status(503).json({ error: 'AI Mentor microservice is currently unreachable. Please try again in a moment.' });
        return;
      }

      res.status(400).json({ error: errMsg || 'Failed to process chat message.' });
    }
  }
}

export const mentorController = new MentorController();
