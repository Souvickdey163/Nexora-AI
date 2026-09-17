import { getStoredAccessToken } from './auth';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/auth').replace(/\/auth\/?$/, '/resumes');

async function fetchResumeApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to json if body is NOT FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
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

export const resumeApi = {
  // Upload initial resume PDF
  async uploadResume(file: File, title?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    return fetchResumeApi('/', {
      method: 'POST',
      body: formData,
    });
  },

  // Upload new version for existing resume
  async uploadVersion(resumeId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return fetchResumeApi(`/${resumeId}/versions`, {
      method: 'POST',
      body: formData,
    });
  },

  // Trigger AI analysis for a resume version
  async analyzeVersion(
    resumeId: string,
    versionId: string,
    data: { targetRole?: string; targetCompany?: string; jobDescription?: string }
  ) {
    return fetchResumeApi(`/${resumeId}/versions/${versionId}/analyze`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // List user's resumes
  async listResumes() {
    return fetchResumeApi('/', { method: 'GET' });
  },

  // Get details & version list for a resume
  async getResumeDetails(resumeId: string) {
    return fetchResumeApi(`/${resumeId}`, { method: 'GET' });
  },

  // Get details for a specific version
  async getVersionDetails(resumeId: string, versionId: string) {
    return fetchResumeApi(`/${resumeId}/versions/${versionId}`, { method: 'GET' });
  },

  // Get analysis history
  async getAnalysisHistory(resumeId: string, page = 1, limit = 10) {
    return fetchResumeApi(`/${resumeId}/analyses?page=${page}&limit=${limit}`, { method: 'GET' });
  },

  // Get single analysis details
  async getSingleAnalysis(resumeId: string, analysisId: string) {
    return fetchResumeApi(`/${resumeId}/analyses/${analysisId}`, { method: 'GET' });
  },

  // Get score progression history
  async getScoreProgress(resumeId: string) {
    return fetchResumeApi(`/${resumeId}/progress`, { method: 'GET' });
  },

  // Get dashboard analytics summary
  async getAnalyticsSummary() {
    return fetchResumeApi('/analytics/summary', { method: 'GET' });
  },

  // Delete a resume
  async deleteResume(resumeId: string) {
    return fetchResumeApi(`/${resumeId}`, { method: 'DELETE' });
  },
};
