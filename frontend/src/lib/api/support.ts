import { getStoredAccessToken } from './auth';

const getSupportApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const cleanBase = envUrl.replace(/\/auth\/?$/, '').replace(/\/+$/, '');
  return `${cleanBase}/support`;
};

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  userId: string;
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  attachmentUrl?: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  adminResponse?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPayload {
  name?: string;
  email?: string;
  category: string;
  priority?: string;
  subject: string;
  description: string;
  attachmentUrl?: string;
}

async function fetchSupportApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string; errors?: Record<string, string[]> }> {
  const baseUrl = getSupportApiBaseUrl();
  const token = getStoredAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to connect to Nexora support server.',
    };
  }
}

export const supportApi = {
  // Create support ticket
  async createTicket(payload: CreateTicketPayload) {
    return fetchSupportApi<{ ticket: SupportTicketItem }>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Get current user's tickets
  async getUserTickets() {
    return fetchSupportApi<{ tickets: SupportTicketItem[]; count: number }>('/tickets', {
      method: 'GET',
    });
  },

  // Get specific ticket by id/ticketNumber
  async getTicketById(id: string) {
    return fetchSupportApi<{ ticket: SupportTicketItem }>(`/tickets/${id}`, {
      method: 'GET',
    });
  },
};
