import { getStoredAccessToken } from './auth';

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api')
    .replace(/\/auth\/?$/, '')
    .replace(/\/+$/, '') + '/placement';

async function fetchPlacementApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  requiredCredits?: number;
  currentCredits?: number;
}> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.error || `HTTP ${res.status} request failed.`,
        code: json.code,
        requiredCredits: json.requiredCredits,
        currentCredits: json.currentCredits,
      };
    }
    return json;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to connect to Placement Intelligence backend.',
    };
  }
}

export interface PlacementDimension {
  id: string;
  assessmentId: string;
  dimension: 'INTERVIEW' | 'CODING' | 'RESUME' | 'ROADMAP';
  score: number | null;
  evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  source: string;
  explanation: string;
  evidenceDetails: string[];
  sourceUpdatedAt: string | null;
}

export interface PlacementRecommendation {
  id: string;
  assessmentId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  actionType: string;
  route: string;
  completed: boolean;
  createdAt: string;
}

export interface PlacementAssessment {
  id: string;
  userId: string;
  targetRole: string;
  companyCategory: string;
  overallScore: number;
  evidenceCoverage: number;
  readinessLevel: string;
  summary: string;
  strengths: string[];
  priorityAreas: string[];
  roleSpecificAdvice: string[];
  aiExplanation?: any;
  createdAt: string;
  updatedAt: string;
  dimensions: PlacementDimension[];
  recommendations: PlacementRecommendation[];
}

export interface PlacementSummary {
  hasAssessment: boolean;
  currentScore: number | null;
  readinessLevel: string;
  evidenceCoverage: number;
  targetRole: string;
  companyCategory: string;
  lastCalculatedAt: string | null;
  totalAssessmentsCalculated: number;
}

export const placementApi = {
  async assessReadiness(targetRole?: string, companyCategory?: string, forceRefresh?: boolean) {
    return fetchPlacementApi<PlacementAssessment>('/assess', {
      method: 'POST',
      body: JSON.stringify({ targetRole, companyCategory, forceRefresh }),
    });
  },

  async getCurrentAssessment() {
    return fetchPlacementApi<PlacementAssessment | null>('/current');
  },

  async getAssessmentHistory(limit: number = 20) {
    return fetchPlacementApi<PlacementAssessment[]>(`/history?limit=${limit}`);
  },

  async getAssessmentById(assessmentId: string) {
    return fetchPlacementApi<PlacementAssessment>(`/${assessmentId}`);
  },

  async toggleRecommendation(assessmentId: string, recommendationId: string, completed?: boolean) {
    return fetchPlacementApi<PlacementRecommendation>(
      `/${assessmentId}/recommendations/${recommendationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      }
    );
  },

  async getSummary() {
    return fetchPlacementApi<PlacementSummary>('/summary');
  },
};
