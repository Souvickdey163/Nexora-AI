export type EvidenceLevel = 'STRONG' | 'MODERATE' | 'LIMITED' | 'DETECTED' | 'INSUFFICIENT';

export interface GitHubUserProfile {
  username: string;
  githubUserId: string;
  name?: string;
  avatarUrl?: string;
  profileUrl?: string;
  bio?: string;
  publicRepos: number;
  followers: number;
  following: number;
}

export interface RawGitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  default_branch: string;
  pushed_at: string;
  updated_at: string;
}

export interface EngineeringSignals {
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
}

export interface ActivitySignals {
  totalCommitsSampled: number;
  lastPushedAt: string | null;
  activePeriod: string;
  maintenanceStatus: 'Active' | 'Maintained' | 'Dormant' | 'Initial';
}

export interface AiCodeReview {
  maintainability: string;
  projectOrganization: string;
  documentationQuality: string;
  testingCoverage: string;
  errorHandlingNotes: string;
  keyStrengths: string[];
  improvementSuggestions: string[];
}

export interface RepositoryAnalysisData {
  repositoryId: string;
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  projectSummary: string;
  architectureSummary: string;
  detectedStack: string[];
  engineeringAreas: string[];
  engineeringSignals: EngineeringSignals;
  activitySignals: ActivitySignals;
  aiReview: AiCodeReview;
  resumeBullets: string[];
  interviewQuestions: Array<{
    question: string;
    category: string;
    followUp: string;
    expectedAnswerKey: string;
  }>;
}

export interface SkillEvidenceItem {
  skill: string;
  category: 'Frontend' | 'Backend' | 'Languages' | 'Database' | 'Cloud/DevOps' | 'AI/ML';
  evidenceLevel: EvidenceLevel;
  evidenceDetails: string[];
}

export interface ResumeAlignmentItem {
  skill: string;
  category: string;
  resumeFound: boolean;
  githubEvidence: EvidenceLevel;
  statusLabel: string; // e.g. "Strong GitHub evidence", "Limited GitHub evidence"
  matchingRepositories: string[];
}
