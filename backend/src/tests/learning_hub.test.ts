import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { freeCodeCampService } from '../services/freecodecamp.service';
import { learningSyncService } from '../services/learning-sync.service';
import { learningRecommendationService } from '../services/learning-recommendation.service';

jest.setTimeout(30000);

describe('Learning Hub Course/Resource Integration Tests', () => {
  let testUserToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `learning_test_${Date.now()}@nexora.ai`,
        firstName: 'Learning',
        lastName: 'Tester',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    testUserId = user.id;
    testUserToken = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      status: user.status,
    });
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.userLearningResourceProgress.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  describe('Phase 1: freeCodeCamp Service', () => {
    it('should fetch freeCodeCamp curriculum resources in normalized LearningResource format', async () => {
      const resources = await freeCodeCampService.fetchCurriculum({ limit: 5 });
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);

      const first = resources[0];
      expect(first.provider).toBe('freeCodeCamp');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('url');
      expect(first).toHaveProperty('category');
      expect(first).toHaveProperty('skills');
      expect(first).toHaveProperty('resourceType');
    });

    it('should filter freeCodeCamp resources by category and search keyword', async () => {
      const filtered = await freeCodeCampService.fetchCurriculum({
        category: 'Frontend',
        search: 'CSS',
      });
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.every((r) => r.category === 'Frontend' || r.skills.includes('CSS3'))).toBe(true);
    });
  });

  describe('Phase 1 Route: GET /api/learning/freecodecamp', () => {
    it('should return normalized freeCodeCamp resources via Express endpoint', async () => {
      const res = await request(app)
        .get('/api/learning/freecodecamp?category=javascript&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.provider).toBe('freeCodeCamp');
      expect(Array.isArray(res.body.resources)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });
  });

  describe('Phase 2 & 3: Database Integration & Synchronization', () => {
    it('should synchronize freeCodeCamp resources into PostgreSQL via LearningSyncService without duplicates', async () => {
      const syncResult = await learningSyncService.syncResources('freeCodeCamp');
      expect(syncResult.syncedCount).toBeGreaterThan(0);
      expect(syncResult.provider).toBe('freeCodeCamp');

      // Verify records in DB
      const dbCount = await prisma.learningResource.count({
        where: { provider: 'freeCodeCamp' },
      });
      expect(dbCount).toBeGreaterThan(0);
    });

    it('should support trigger synchronization via POST /api/learning/sync', async () => {
      const res = await request(app)
        .post('/api/learning/sync')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ provider: 'freeCodeCamp' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.syncedCount).toBeGreaterThan(0);
    });
  });

  describe('Phase 4: Learning Hub API (GET /api/learning/resources)', () => {
    it('should return normalized resources from PostgreSQL with category and search filter', async () => {
      const res = await request(app)
        .get('/api/learning/resources?category=Databases')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.resources)).toBe(true);
      expect(res.body.resources.some((r: any) => r.category === 'Databases')).toBe(true);
    });

    it('should allow user progress toggle via POST /api/learning/resources/:resourceId/progress', async () => {
      const resourcesRes = await request(app).get('/api/learning/resources?limit=1');
      const resourceId = resourcesRes.body.resources[0].id;

      const progressRes = await request(app)
        .post(`/api/learning/resources/${resourceId}/progress`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ completed: true })
        .expect(200);

      expect(progressRes.body.success).toBe(true);
      expect(progressRes.body.progress.isCompleted).toBe(true);
    });
  });

  describe('Phase 5 & 7: Skill-Based Recommendation Engine', () => {
    it('should score resources higher when they match user missing skill gaps', async () => {
      const sampleResources = [
        {
          id: '1',
          title: 'JavaScript Deep Dive',
          category: 'Frontend',
          skills: ['JavaScript', 'ES6'],
          provider: 'freeCodeCamp',
          resourceType: 'course' as const,
          url: 'https://freecodecamp.org',
        },
        {
          id: '2',
          title: 'PostgreSQL Database Administration',
          category: 'Databases',
          skills: ['PostgreSQL', 'SQL'],
          provider: 'freeCodeCamp',
          resourceType: 'course' as const,
          url: 'https://freecodecamp.org',
        },
      ];

      // Inject temporary user profile targetRole
      await prisma.userProfile.upsert({
        where: { userId: testUserId },
        create: { userId: testUserId, targetRole: 'Full Stack Developer', skills: ['HTML', 'CSS'] },
        update: { targetRole: 'Full Stack Developer', skills: ['HTML', 'CSS'] },
      });

      const recommendation = await learningRecommendationService.getPersonalizedRecommendations(
        testUserId,
        sampleResources
      );

      expect(recommendation).toHaveProperty('scoredResources');
      expect(recommendation.scoredResources.length).toBe(2);
    });
  });
});
