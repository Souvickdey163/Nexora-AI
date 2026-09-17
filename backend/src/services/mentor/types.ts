import { MentorRole } from '@prisma/client';

export interface MentorMessageDTO {
  id: string;
  conversationId: string;
  role: MentorRole;
  content: string;
  createdAt: Date;
}

export interface MentorConversationDTO {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: MentorMessageDTO[];
}

export interface SendMessageInput {
  conversationId?: string;
  message: string;
}

export interface MentorChatResponseDTO {
  conversationId: string;
  title: string;
  userMessage: MentorMessageDTO;
  assistantMessage: MentorMessageDTO;
  model: string;
  provider: string;
}

export interface CareerContext {
  userProfile?: {
    name?: string;
    headline?: string;
    bio?: string;
    skills?: string[];
  };
  targetRole?: string;
  careerGoals?: string;
  resume?: {
    title?: string;
    scores?: Record<string, number>;
    detectedSkills?: string[];
  };
  codingStats?: {
    score?: number;
    solved?: number;
  };
  [key: string]: any;
}
