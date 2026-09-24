import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { creditService } from '../services/credit.service';
import { UserStatus } from '@prisma/client';

describe('Phase Features Integration Tests', () => {
  jest.setTimeout(30000);

  let testUserToken: string;
  let testUserId: string;
  const testUserEmail = `phase_test_${Date.now()}@nexora.ai`;

  beforeAll(async () => {
    // Create test user directly in DB
    const user = await prisma.user.create({
      data: {
        email: testUserEmail,
        firstName: 'Phase',
        lastName: 'Tester',
        name: 'Phase Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    testUserId = user.id;

    // Grant 10 welcome credits
    await creditService.grantWelcomeBonus(testUserId);

    // Generate JWT access token
    testUserToken = tokenService.generateAccessToken({
      userId: testUserId,
      email: testUserEmail,
      status: UserStatus.ACTIVE,
    });
  });

  afterAll(async () => {
    // Cleanup
    if (testUserId) {
      await prisma.userNotification.deleteMany({ where: { userId: testUserId } });
      await prisma.userActivity.deleteMany({ where: { userId: testUserId } });
      await prisma.userLearningProgress.deleteMany({ where: { userId: testUserId } });
      await prisma.skillAssessmentAttempt.deleteMany({ where: { userId: testUserId } });
      await prisma.careerRoadmap.deleteMany({ where: { userId: testUserId } });
      await prisma.creditTransaction.deleteMany({ where: { userId: testUserId } });
      await prisma.payment.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });

  test('1. GET /api/credits/balance returns user balance and 10 welcome credits', async () => {
    const res = await request(app)
      .get('/api/credits/balance')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.credits).toBe(10);
  });

  test('2. GET /api/dashboard/overview returns aggregated user stats', async () => {
    const res = await request(app)
      .get('/api/dashboard/overview')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.overview.user.email).toBe(testUserEmail);
    expect(res.body.overview.stats.credits).toBe(10);
  });

  test('3. GET /api/roadmap/active creates/returns active roadmap', async () => {
    const res = await request(app)
      .get('/api/roadmap/active')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.roadmap).toBeDefined();
    expect(res.body.roadmap.milestones.length).toBeGreaterThan(0);
  });

  test('4. POST /api/roadmap/generate deducts 2 credits and generates new roadmap', async () => {
    const res = await request(app)
      .post('/api/roadmap/generate')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ targetRole: 'Staff Frontend Engineer' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.roadmap.targetRole).toBe('Staff Frontend Engineer');

    // Check balance reduced to 8
    const balanceRes = await request(app)
      .get('/api/credits/balance')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(balanceRes.body.credits).toBe(8);
  });

  test('5. GET /api/assessment/questions returns questions and deducts 2 credits', async () => {
    const res = await request(app)
      .get('/api/assessment/questions?category=DBMS%20%26%20SQL&difficulty=Intermediate')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.attemptId).toBeDefined();
    expect(res.body.questions.length).toBeGreaterThan(0);

    // Check balance reduced to 6
    const balanceRes = await request(app)
      .get('/api/credits/balance')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(balanceRes.body.credits).toBe(6);
  });

  test('6. GET /api/analytics/dashboard returns dashboard analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analytics).toBeDefined();
  });

  test('7. GET /api/placement/readiness returns explainable readiness metrics', async () => {
    const res = await request(app)
      .get('/api/placement/readiness')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.readiness.dimensions.length).toBeGreaterThan(0);
  });

  test('8. GET /api/learning/topics returns public learning topics', async () => {
    const res = await request(app)
      .get('/api/learning/topics')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.topics.length).toBeGreaterThan(0);
  });

  test('9. GET /api/notifications & PATCH /api/notifications/read-all', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const markRes = await request(app)
      .patch('/api/notifications/read-all')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(markRes.status).toBe(200);
    expect(markRes.body.success).toBe(true);
  });

  test('10. GET /api/activities returns user activity trail', async () => {
    const res = await request(app)
      .get('/api/activities')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.activities).toBeDefined();
  });
});
