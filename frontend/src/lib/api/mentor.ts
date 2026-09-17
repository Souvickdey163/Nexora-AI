import { getStoredAccessToken } from './auth';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/auth\/?$/, '').replace(/\/+$/, '') + '/mentor';

async function fetchMentorApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || data.detail || `Server error (${res.status})`,
        status: res.status,
      };
    }

    return {
      success: true,
      data,
      status: res.status,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error. Failed to connect to Nexora backend server.',
    };
  }
}

export interface MentorMessageDTO {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

export interface MentorConversationDTO {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: MentorMessageDTO[];
}

export interface MentorChatResponseDTO {
  conversationId: string;
  title: string;
  userMessage: MentorMessageDTO;
  assistantMessage: MentorMessageDTO;
  model: string;
  provider: string;
}

export const mentorApi = {
  // List conversations
  async listConversations() {
    return fetchMentorApi<MentorConversationDTO[]>('/conversations', { method: 'GET' });
  },

  // Get conversation with messages
  async getConversation(id: string) {
    return fetchMentorApi<MentorConversationDTO>(`/conversations/${id}`, { method: 'GET' });
  },

  // Create new conversation
  async createConversation(title?: string) {
    return fetchMentorApi<MentorConversationDTO>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  // Delete conversation
  async deleteConversation(id: string) {
    return fetchMentorApi<{ message: string; conversationId: string }>(`/conversations/${id}`, {
      method: 'DELETE',
    });
  },

  // Send message to AI mentor
  async sendMessage(conversationId: string | undefined, message: string) {
    return fetchMentorApi<MentorChatResponseDTO>('/chat', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message }),
    });
  },
};
