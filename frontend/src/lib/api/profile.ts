import { getStoredAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/profile')
  : 'http://localhost:5001/api/profile';

async function fetchProfileApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = { ...((options.headers as Record<string, string>) || {}) };

  // Set JSON content-type unless sending FormData for file uploads
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

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
      error: err?.message || 'Failed to communicate with profile server.',
    };
  }
}

export interface UserProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  credits: number;
  emailVerified: boolean;
  status: string;
  createdAt: string;
  connectedAccounts?: string[];
  profile?: {
    headline?: string;
    bio?: string;
    skills?: string[];
    education?: string;
    location?: string;
    targetRole?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
  };
}

export const profileApi = {
  async getProfile() {
    return fetchProfileApi<{ user: UserProfileData }>('', { method: 'GET' });
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    headline?: string;
    bio?: string;
    targetRole?: string;
    education?: string;
    location?: string;
    websiteUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  }) {
    return fetchProfileApi<{ user: UserProfileData }>('', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return fetchProfileApi<{ avatarUrl: string; user: UserProfileData }>('/avatar', {
      method: 'POST',
      body: formData,
    });
  },
};
