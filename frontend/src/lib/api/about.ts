import { getStoredAccessToken } from './auth';

const getAboutApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const cleanBase = envUrl.replace(/\/auth\/?$/, '').replace(/\/+$/, '');
  return `${cleanBase}/about`;
};

export interface PlatformModuleInfo {
  name: string;
  description: string;
  route: string;
}

export interface PlatformOverviewData {
  platform: {
    name: string;
    tagline: string;
    description: string;
    version: string;
    status: string;
    updatedAt: string;
  };
  modules: PlatformModuleInfo[];
  techStack: string[];
  securityFeatures: string[];
}

export interface UserCareerSummaryData {
  user: {
    name: string;
    email: string;
    avatar: string | null;
    credits: number;
    profileCompleted: boolean;
  };
  careerStats: {
    resumesUploaded: number;
    codingProblemsSolved: number;
    mockTestsCompleted: number;
    githubConnected: boolean;
    roadmapsCreated: number;
    placementAssessmentsCompleted: number;
  };
}

async function fetchAboutApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  const baseUrl = getAboutApiBaseUrl();
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
      error: err?.message || 'Failed to connect to Nexora platform API.',
    };
  }
}

export const aboutApi = {
  async getPlatformInfo() {
    return fetchAboutApi<PlatformOverviewData>('');
  },

  async getUserSummary() {
    return fetchAboutApi<UserCareerSummaryData>('/me');
  },
};
