import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/payments')
  : 'http://localhost:5001/api/payments';

async function fetchPaymentsApi<T = any>(
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
      error: err?.message || 'Failed to communicate with payment gateway server.',
    };
  }
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceInINR: number;
  amountInPaise: number;
  popular?: boolean;
  description: string;
}

export const paymentsApi = {
  async getPackages() {
    return fetchPaymentsApi<{ packages: CreditPackage[] }>('/packages', {
      method: 'GET',
    });
  },

  async createOrder(packageId: string) {
    return fetchPaymentsApi<{
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      packageId: string;
      creditsGranted: number;
    }>('/create-order', {
      method: 'POST',
      body: JSON.stringify({ packageId }),
    });
  },

  async verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return fetchPaymentsApi<{
      creditsGranted: number;
      credits: number;
    }>('/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
