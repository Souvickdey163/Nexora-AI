import { prisma } from '../config/database';
import { LearningProvider } from './providers/learning-provider.interface';
import { freeCodeCampProvider } from './providers/freecodecamp.provider';
import { LearningResource } from '../types/learning.types';

export class LearningSyncService {
  private providers: Map<string, LearningProvider> = new Map();

  constructor() {
    // Register freeCodeCamp provider by default
    this.registerProvider(freeCodeCampProvider);
  }

  public registerProvider(provider: LearningProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  public getProvider(providerName: string): LearningProvider | undefined {
    return this.providers.get(providerName.toLowerCase());
  }

  /**
   * Synchronizes learning resources from a specific provider (or all providers) into PostgreSQL.
   */
  async syncResources(providerName?: string): Promise<{
    syncedCount: number;
    provider: string;
    resources: LearningResource[];
  }> {
    const targetProviders = providerName
      ? [this.getProvider(providerName)].filter(Boolean) as LearningProvider[]
      : Array.from(this.providers.values());

    if (targetProviders.length === 0) {
      throw new Error(`Provider '${providerName}' is not registered.`);
    }

    let totalSynced = 0;
    const allSyncedResources: LearningResource[] = [];

    for (const provider of targetProviders) {
      const fetchedResources = await provider.fetchResources();

      for (const item of fetchedResources) {
        const sourceId = item.sourceId || item.id;

        const upserted = await prisma.learningResource.upsert({
          where: {
            provider_sourceId: {
              provider: item.provider,
              sourceId,
            },
          },
          create: {
            provider: item.provider,
            sourceId,
            title: item.title,
            description: item.description || null,
            category: item.category,
            skills: item.skills || [],
            resourceType: item.resourceType,
            url: item.url,
            difficulty: item.difficulty || 'intermediate',
          },
          update: {
            title: item.title,
            description: item.description || null,
            category: item.category,
            skills: item.skills || [],
            resourceType: item.resourceType,
            url: item.url,
            difficulty: item.difficulty || 'intermediate',
          },
        });

        totalSynced++;
        allSyncedResources.push({
          id: upserted.id,
          sourceId: upserted.sourceId,
          provider: upserted.provider,
          title: upserted.title,
          description: upserted.description || undefined,
          category: upserted.category,
          skills: upserted.skills,
          resourceType: upserted.resourceType as any,
          url: upserted.url,
          difficulty: (upserted.difficulty as any) || undefined,
          createdAt: upserted.createdAt,
          updatedAt: upserted.updatedAt,
        });
      }
    }

    return {
      syncedCount: totalSynced,
      provider: providerName || 'all',
      resources: allSyncedResources,
    };
  }

  /**
   * Ensures that initial resources are synced into PostgreSQL on application startup if database table is empty.
   */
  async ensureSyncedOnStartup(): Promise<void> {
    try {
      const count = await prisma.learningResource.count();
      if (count === 0) {
        console.log('🔄 Initializing Learning Resource Sync into PostgreSQL...');
        await this.syncResources();
        console.log('✅ Learning Resources synced successfully into PostgreSQL.');
      }
    } catch (err) {
      console.error('⚠️ Failed auto-syncing Learning Resources on startup:', err);
    }
  }
}

export const learningSyncService = new LearningSyncService();
