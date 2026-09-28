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

export interface JobQueryParams {
  q?: string;
  location?: string;
  days?: number;
  limit?: number;
  remote?: string;
  employmentType?: string;
}

export interface RecommendedJobsResponse {
  success: boolean;
  count: number;
  targetRole?: string | null;
  userSkills?: string[];
  recommendedJobs: JobOpportunity[];
  allJobs: JobOpportunity[];
  topMissingSkills: string[];
}
