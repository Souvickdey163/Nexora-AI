const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/auth';

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Get stored JWT access token from localStorage.
 */
export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexora_access_token');
};

/**
 * Save JWT access token to localStorage.
 */
export const setStoredAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexora_access_token', token);
  }
};

/**
 * Clear authentication state from localStorage.
 */
export const clearStoredAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexora_access_token');
    localStorage.removeItem('nexora_user');
  }
};

/**
 * Generic fetch wrapper for API requests.
 */
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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
      error: err?.message || 'Network error. Failed to connect to Nexora backend server.',
    };
  }
}

export const authApi = {
  // Sign Up / Register
  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return fetchApi('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Sign In / Login
  async login(data: { email: string; password: string }) {
    const res = await fetchApi<any>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.tokens?.accessToken) {
      setStoredAccessToken(res.data.tokens.accessToken);
      if (typeof window !== 'undefined' && res.data.user) {
        localStorage.setItem('nexora_user', JSON.stringify(res.data.user));
      }
    }
    return res;
  },

  // Verify Email OTP Code
  async verifyEmail(data: { email: string; otp: string }) {
    const res = await fetchApi<any>('/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.tokens?.accessToken) {
      setStoredAccessToken(res.data.tokens.accessToken);
      if (typeof window !== 'undefined' && res.data.user) {
        localStorage.setItem('nexora_user', JSON.stringify(res.data.user));
      }
    }
    return res;
  },

  // Resend Email OTP
  async resendOtp(email: string) {
    return fetchApi('/resend-verification-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Request Password Reset OTP
  async forgotPassword(email: string) {
    return fetchApi('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify Reset OTP Code
  async verifyResetOtp(data: { email: string; otp: string }) {
    return fetchApi('/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset Password
  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return fetchApi('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Logout
  async logout() {
    await fetchApi('/logout', { method: 'POST' });
    clearStoredAuth();
  },

  // Get Current Authenticated User Profile
  async getCurrentUser() {
    return fetchApi('/me', { method: 'GET' });
  },

  // OAuth Redirect URLs
  getOAuthRedirectUrl(provider: 'google' | 'github' | 'linkedin') {
    return `${API_BASE_URL}/${provider}`;
  },
};
