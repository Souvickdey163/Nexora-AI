import { getStoredAccessToken } from './auth';

const getLearningApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/auth$/, '/learning');
  }
  return 'http://localhost:5001/api/learning';
};

async function fetchLearningApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const API_BASE_URL = getLearningApiBaseUrl();
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
    return { success: false, error: err?.message || 'Failed to connect to learning service.' };
  }
}

export type ResourceType = 'course' | 'module' | 'lesson' | 'project';

export interface LearningResource {
  id: string;
  sourceId?: string;
  title: string;
  description?: string;
  provider: string;
  category: string;
  skills: string[];
  resourceType: ResourceType;
  url: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isCompleted?: boolean;
  isBookmarked?: boolean;
  relevanceScore?: number;
  matchedMissingSkills?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LearningResourcesResponse {
  success: boolean;
  count?: number;
  targetRole?: string | null;
  missingSkills?: string[];
  recommendedForGaps?: LearningResource[];
  resources?: LearningResource[];
  error?: string;
}

export interface LearningQueryParams {
  category?: string;
  search?: string;
  provider?: string;
  difficulty?: string;
  skill?: string;
  limit?: number;
  sortBy?: string;
}

export const learningApi = {
  /**
   * GET /api/learning/resources
   * Unified endpoint fetching normalized resources from PostgreSQL with recommendations
   */
  async getResources(params: LearningQueryParams = {}): Promise<LearningResourcesResponse> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.provider) query.append('provider', params.provider);
    if (params.difficulty) query.append('difficulty', params.difficulty);
    if (params.skill) query.append('skill', params.skill);
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchLearningApi<LearningResourcesResponse>(`/resources${queryString}`);
  },

  /**
   * GET /api/learning/freecodecamp
   * Phase 1 direct freeCodeCamp backend service endpoint
   */
  async getFreeCodeCamp(params: LearningQueryParams = {}): Promise<LearningResourcesResponse> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchLearningApi<LearningResourcesResponse>(`/freecodecamp${queryString}`);
  },

  /**
   * POST /api/learning/resources/:resourceId/progress
   * Toggle completion / bookmark status
   */
  async toggleResourceProgress(resourceId: string, completed?: boolean, bookmarked?: boolean) {
    return fetchLearningApi<{ success: boolean; progress: any }>(
      `/resources/${resourceId}/progress`,
      {
        method: 'POST',
        body: JSON.stringify({ completed, bookmarked }),
      }
    );
  },

  /**
   * POST /api/learning/sync
   * Synchronize resources into database
   */
  async syncResources(provider: string = 'freeCodeCamp') {
    return fetchLearningApi<{ success: boolean; syncedCount: number }>(`/sync`, {
      method: 'POST',
      body: JSON.stringify({ provider }),
    });
  },

  // Legacy fallback support
  async getTopics() {
    return fetchLearningApi<{ success: boolean; topics: any[] }>('/topics');
  },

  async toggleProgress(topicId: string, completed?: boolean) {
    return this.toggleResourceProgress(topicId, completed);
  },
};
