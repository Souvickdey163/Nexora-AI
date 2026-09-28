import { getStoredAccessToken } from './auth';

const getJobsApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/jobs');
  }
  return 'http://localhost:5001/api/jobs';
};

async function fetchJobsApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const API_BASE_URL = getJobsApiBaseUrl();
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to connect to jobs service.' };
  }
}

export interface JobSalary {
  min?: number;
  max?: number;
  currency?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  remoteType?: string;
  description?: string;
  skills: string[];
  postedAt?: string;
  salary?: JobSalary;
  applyUrl: string;
  source: string;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

export interface RecommendedJobsResponse {
  success: boolean;
  count?: number;
  targetRole?: string | null;
  userSkills?: string[];
  recommendedJobs?: JobOpportunity[];
  allJobs?: JobOpportunity[];
  topMissingSkills?: string[];
  error?: string;
}

export interface JobQueryParams {
  q?: string;
  location?: string;
  days?: number;
  limit?: number;
  remote?: string;
  employmentType?: string;
}

export const jobsApi = {
  /**
   * GET /api/jobs
   * Fetch all raw/filtered job openings from backend
   */
  async getJobs(params: JobQueryParams = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.location) query.append('location', params.location);
    if (params.days) query.append('days', params.days.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.remote) query.append('remote', params.remote);
    if (params.employmentType) query.append('employmentType', params.employmentType);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJobsApi<{ success: boolean; count: number; jobs: JobOpportunity[] }>(
      `${queryString}`
    );
  },

  /**
   * GET /api/jobs/recommended
   * Fetch personalized job recommendations with resume skill-matching & gap scores
   */
  async getRecommendedJobs(params: JobQueryParams = {}): Promise<RecommendedJobsResponse> {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.location) query.append('location', params.location);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJobsApi<RecommendedJobsResponse>(`/recommended${queryString}`);
  },

  /**
   * GET /api/jobs/:id
   * Fetch details for a specific job opening
   */
  async getJobById(id: string) {
    return fetchJobsApi<{ success: boolean; job: JobOpportunity }>(`/${id}`);
  },
};
