import { getStoredAccessToken } from './auth';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/auth').replace(/\/auth\/?$/, '/github');

async function fetchGitHubApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    return (await res.json()) as T;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error. Failed to connect to Nexora backend server.',
    } as any;
  }
}

export interface GitHubProfile {
  id: string;
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  bio?: string;
  publicRepos: number;
  followers: number;
  following: number;
  lastSyncedAt: string;
  stats: {
    totalRepositories: number;
    totalLanguages: number;
    projectsAnalyzed: number;
  };
}

export interface RepositoryAnalysis {
  id: string;
  repositoryId: string;
  repositoryName: string;
  repositoryOwner: string;
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  analyzedAt: string;
  projectSummary: string;
  architectureSummary: string;
  detectedStack: string[];
  engineeringAreas: string[];
  engineeringSignals: {
    hasReadme: boolean;
    readmeLength: number;
    readmeQuality: 'High' | 'Medium' | 'Basic' | 'Missing';
    hasTests: boolean;
    testFrameworks: string[];
    hasCiCd: boolean;
    ciCdTools: string[];
    hasDocker: boolean;
    hasLinting: boolean;
    hasEnvConfig: boolean;
    hasPackageManifest: boolean;
    fileCount: number;
    dirCount: number;
    detectedArchitecture: string;
  };
  activitySignals: {
    totalCommitsSampled: number;
    lastPushedAt: string | null;
    activePeriod: string;
    maintenanceStatus: string;
  };
  aiReview: {
    maintainability: string;
    projectOrganization: string;
    documentationQuality: string;
    testingCoverage: string;
    errorHandlingNotes: string;
    keyStrengths: string[];
    improvementSuggestions: string[];
  };
  resumeBullets: string[];
  interviewQuestions: Array<{
    question: string;
    category: string;
    followUp: string;
    expectedAnswerKey: string;
  }>;
}

export interface GitHubRepository {
  id: string;
  githubAccountId: string;
  userId: string;
  githubRepoId: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  primaryLanguage: string | null;
  languages: Record<string, number> | null;
  stars: number;
  forks: number;
  isPrivate: boolean;
  defaultBranch: string;
  pushedAt: string | null;
  updatedAt: string;
  analyses: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
}

export interface ResumeAlignmentItem {
  skill: string;
  category: string;
  resumeFound: boolean;
  githubEvidence: 'STRONG' | 'MODERATE' | 'LIMITED' | 'DETECTED' | 'INSUFFICIENT';
  statusLabel: string;
  matchingRepositories: string[];
}

export const githubApi = {
  getProfile: async () => {
    return await fetchGitHubApi<{
      success: boolean;
      connected: boolean;
      profile: GitHubProfile | null;
    }>('/profile');
  },

  connect: async (username: string) => {
    return await fetchGitHubApi<{
      success: boolean;
      message: string;
      profile: GitHubProfile;
    }>('/connect', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  disconnect: async () => {
    return await fetchGitHubApi<{ success: boolean; message: string }>('/disconnect', {
      method: 'POST',
    });
  },

  getRepositories: async (params?: { search?: string; filter?: string; language?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.filter) query.append('filter', params.filter);
    if (params?.language) query.append('language', params.language);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return await fetchGitHubApi<{
      success: boolean;
      count: number;
      repositories: GitHubRepository[];
    }>(`/repositories${queryString}`);
  },

  analyzeRepository: async (owner: string, repo: string) => {
    return await fetchGitHubApi<{
      success: boolean;
      message: string;
      analysis: RepositoryAnalysis;
    }>(`/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/analyze`, {
      method: 'POST',
    });
  },

  getResumeAlignment: async () => {
    return await fetchGitHubApi<{
      success: boolean;
      alignment: ResumeAlignmentItem[];
    }>('/resume-alignment');
  },
};
