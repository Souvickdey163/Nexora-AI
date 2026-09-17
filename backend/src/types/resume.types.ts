import { ParsingStatus, AnalysisStatus } from '@prisma/client';
import { ParsedResumeData } from '../utils/resumeParser';

export interface SuggestedChange {
  section: string;
  current: string;
  suggested: string;
  reason: string;
}

export interface AIAnalysisResult {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectsScore: number;
  formattingScore: number;
  keywordScore: number;
  summaryScore: number;

  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  missingSkills: string[];
  recommendations: string[];
  suggestedChanges: SuggestedChange[];

  aiProvider: string;
  aiModel: string;
}

export interface CreateResumeDto {
  title?: string;
}

export interface AnalyzeResumeDto {
  targetRole?: string;
  targetCompany?: string;
  jobDescription?: string;
}

export interface ScoreProgressItem {
  analysisId: string;
  score: number;
  targetRole?: string;
  createdAt: Date;
}

export interface ScoreProgressResponse {
  currentScore: number;
  previousScore: number;
  improvement: number;
  history: ScoreProgressItem[];
}

export interface AnalyticsSummaryResponse {
  totalResumes: number;
  totalAnalyses: number;
  latestScore: number;
  averageScore: number;
  scoreImprovement: number;
  strongestCategory: string;
  weakestCategory: string;
  topMissingSkills: string[];
}
