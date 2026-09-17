import { conversationService } from './conversation.service';
import { contextService } from './context.service';
import { aiClient } from '../ai.client';
import { env } from '../../config/env';
import { MentorRole } from '@prisma/client';
import { MentorChatResponseDTO, SendMessageInput } from './types';

export class MentorService {
  /**
   * Process a user chat message to the AI Mentor.
   */
  public async handleUserChat(userId: string, input: SendMessageInput): Promise<MentorChatResponseDTO> {
    const messageText = (input.message || '').trim();

    // 1. Input Validation
    if (!messageText) {
      throw new Error('Message text cannot be empty.');
    }

    const maxLength = env.MENTOR_MAX_MESSAGE_LENGTH || 4000;
    if (messageText.length > maxLength) {
      throw new Error(`Message exceeds maximum allowed length of ${maxLength} characters.`);
    }

    // 2. Check Daily Usage Limit
    const isLimitReached = await conversationService.checkDailyMessageLimit(userId);
    if (isLimitReached) {
      throw new Error(`You have reached your daily limit of ${env.MENTOR_DAILY_MESSAGE_LIMIT || 20} messages with the AI Mentor. Please try again tomorrow.`);
    }

    // 3. Obtain or Create Conversation
    let conversation;
    if (input.conversationId) {
      conversation = await conversationService.getConversationById(userId, input.conversationId);
      if (!conversation) {
        throw new Error('Conversation not found or access denied.');
      }
    } else {
      const generatedTitle = messageText.length > 35 ? `${messageText.substring(0, 35)}...` : messageText;
      conversation = await conversationService.createConversation(userId, generatedTitle);
    }

    // 4. Load Conversation History (bounded to MENTOR_MAX_CONTEXT_MESSAGES)
    const existingMessages = conversation.messages || (await conversationService.getMessages(userId, conversation.id));
    const maxContextMessages = env.MENTOR_MAX_CONTEXT_MESSAGES || 20;
    const boundedHistory = existingMessages.slice(-maxContextMessages).map((m) => ({
      role: m.role.toLowerCase(),
      content: m.content,
    }));

    // 5. Build Selective Candidate Context
    const careerContext = await contextService.buildSelectiveContext(userId, messageText);

    // 6. Call FastAPI AI Microservice (which calls Gemini API Free Tier)
    const aiResponse = await aiClient.sendMentorChat(messageText, boundedHistory, careerContext);

    // 7. Save User Message & Assistant Response in DB
    const userMessageDTO = await conversationService.addMessage(conversation.id, MentorRole.USER, messageText);
    const assistantMessageDTO = await conversationService.addMessage(
      conversation.id,
      MentorRole.ASSISTANT,
      aiResponse.message
    );

    // 8. Auto-update Title if still default "New Conversation"
    if (conversation.title === 'New Conversation') {
      const autoTitle = messageText.length > 35 ? `${messageText.substring(0, 35)}...` : messageText;
      await conversationService.updateTitle(conversation.id, autoTitle);
      conversation.title = autoTitle;
    }

    return {
      conversationId: conversation.id,
      title: conversation.title,
      userMessage: userMessageDTO,
      assistantMessage: assistantMessageDTO,
      model: aiResponse.model,
      provider: aiResponse.provider,
    };
  }
}

export const mentorService = new MentorService();
