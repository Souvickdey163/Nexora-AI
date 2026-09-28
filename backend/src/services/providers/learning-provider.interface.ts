import { LearningResource } from '../../types/learning.types';

export interface LearningProvider {
  name: string;
  fetchResources(params?: {
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<LearningResource[]>;
}
