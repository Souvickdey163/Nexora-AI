import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/credits')
  : 'http://localhost:5001/api/credits';

async function fetchCreditsApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to communicate with Nexora credit server.',
    };
  }
}

export const creditsApi = {
  async getBalance() {
    return fetchCreditsApi<{ credits: number }>('/balance', { method: 'GET' });
  },

  async getHistory() {
    return fetchCreditsApi<{
      transactions: Array<{
        id: string;
        type: string;
        amount: number;
        balanceBefore: number;
        balanceAfter: number;
        source: string;
        description: string;
        createdAt: string;
      }>;
    }>('/history', { method: 'GET' });
  },
};
