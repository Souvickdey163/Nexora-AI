export type ResourceType = 'course' | 'module' | 'lesson' | 'project';
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  provider: string;
  category: string;
  skills: string[];
  resourceType: ResourceType;
  url: string;
  difficulty?: ResourceDifficulty;
  sourceId?: string;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  relevanceScore?: number;
  matchedMissingSkills?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LearningResourceQueryParams {
  category?: string;
  search?: string;
  provider?: string;
  difficulty?: string;
  skill?: string;
  limit?: number;
  sortBy?: 'relevance' | 'title' | 'category' | 'difficulty' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface RecommendationResult {
  missingSkills: string[];
  targetRole: string | null;
  recommendedResources: LearningResource[];
  generalResources: LearningResource[];
}
