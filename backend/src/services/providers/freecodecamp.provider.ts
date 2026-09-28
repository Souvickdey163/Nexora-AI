import { LearningProvider } from './learning-provider.interface';
import { freeCodeCampService } from '../freecodecamp.service';
import { LearningResource } from '../../types/learning.types';

export class FreeCodeCampProvider implements LearningProvider {
  public readonly name = 'freeCodeCamp';

  async fetchResources(params?: {
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<LearningResource[]> {
    return freeCodeCampService.fetchCurriculum(params);
  }
}

export const freeCodeCampProvider = new FreeCodeCampProvider();
