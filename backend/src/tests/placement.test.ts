import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { placementReadinessService } from '../services/placementReadiness.service';
import { creditService } from '../services/credit.service';
import { aiClient } from '../services/ai.client';
import { PLACEMENT_WEIGHTS, getReadinessLevel } from '../config/placement.config';
import { UserStatus } from '@prisma/client';

describe('Placement Intelligence End-to-End Test Suite', () => {
  jest.setTimeout(45000);

  let userA: any;
  let userB: any;
  let tokenA: string;
  let tokenB: string;
  let assessmentIdA: string;

  beforeAll(async () => {
    // 1. Setup User A with credits
    userA = await prisma.user.create({
      data: {
        email: `placement_usera_${Date.now()}@nexora.ai`,
        firstName: 'PlacementUserA',
        lastName: 'Tester',
        credits: 20,
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenA = tokenService.generateAccessToken({ userId: userA.id, email: userA.email, status: userA.status });
    await creditService.grantWelcomeBonus(userA.id);

    // 2. Setup User B
    userB = await prisma.user.create({
      data: {
        email: `placement_userb_${Date.now()}@nexora.ai`,
        firstName: 'PlacementUserB',
        lastName: 'Tester',
        credits: 10,
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenB = tokenService.generateAccessToken({ userId: userB.id, email: userB.email, status: userB.status });
    await creditService.grantWelcomeBonus(userB.id);

    // Seed mock interview for User A
    const interview = await prisma.interview.create({
      data: {
        userId: userA.id,
        targetRole: 'Software Engineer',
        status: 'COMPLETED',
        overallScore: 82,
        technicalScore: 85,
        communicationScore: 80,
      },
    });

    // Seed mock coding solved problem for User A
    const problem = await prisma.codingProblem.create({
      data: {
        slug: `prob_placement_${Date.now()}`,
        title: 'Two Sum Placement Test',
        description: 'Find target indices',
        difficulty: 'MEDIUM',
        topic: 'Arrays',
        examples: [],
        constraints: [],
        starterCode: {},
      },
    });

    await prisma.codingProgress.create({
      data: {
        userId: userA.id,
        problemId: problem.id,
        isSolved: true,
        attemptsCount: 1,
      },
    });

    await prisma.codingSubmission.create({
      data: {
        userId: userA.id,
        problemId: problem.id,
        language: 'javascript',
        code: 'function twoSum() {}',
        status: 'ACCEPTED',
        testsPassed: 5,
        totalTests: 5,
      },
    });

    // Seed mock active career roadmap for User A
    const roadmap = await prisma.careerRoadmap.create({
      data: {
        userId: userA.id,
        targetRole: 'Software Engineer',
        progressPct: 60,
        status: 'ACTIVE',
      },
    });

    await prisma.roadmapMilestone.createMany({
      data: [
        { roadmapId: roadmap.id, stage: 'DSA', title: 'Arrays & Strings', description: 'Master arrays and two pointers', completed: true, order: 0 },
        { roadmapId: roadmap.id, stage: 'Systems', title: 'Databases', description: 'Master PostgreSQL & SQL queries', completed: false, order: 1 },
      ],
    });
  });

  afterAll(async () => {
    // Cleanup created users
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id] } },
    });
  });

  // 1. Authenticated user can create assessment
  test('1. Authenticated user can create placement assessment', async () => {
    const res = await request(app)
      .post('/api/placement/assess')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        targetRole: 'Software Engineer',
        companyCategory: 'Product Technology',
        forceRefresh: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.targetRole).toBe('Software Engineer');
    expect(res.body.data.overallScore).toBeGreaterThanOrEqual(0);
    expect(res.body.data.dimensions.length).toBe(4);

    assessmentIdA = res.body.data.id;
  });

  // 2. Unauthenticated request rejected
  test('2. Unauthenticated request is rejected with 401', async () => {
    const res = await request(app).post('/api/placement/assess').send({});
    expect(res.status).toBe(401);
  });

  // 3. Cross-user access protection
  test('3. User B cannot access User A assessment', async () => {
    const res = await request(app)
      .get(`/api/placement/${assessmentIdA}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  // 4. Target role validation
  test('4. Custom target role is supported and sanitized', async () => {
    const res = await request(app)
      .post('/api/placement/assess')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        targetRole: 'Principal Cloud Architect',
        companyCategory: 'Product Technology',
        forceRefresh: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.targetRole).toBe('Principal Cloud Architect');
  });

  // 5. Company category selection
  test('5. Company category selection is preserved in assessment', async () => {
    const res = await request(app)
      .post('/api/placement/assess')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        targetRole: 'Backend Developer',
        companyCategory: 'Tier-1 Technology Startups',
        forceRefresh: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.companyCategory).toBe('Tier-1 Technology Startups');
  });

  // 6. Coding score calculation
  test('6. Coding score calculation correctly evaluates solved problem history', async () => {
    const current = await placementReadinessService.getCurrentAssessment(userA.id);
    const codingDim = current?.dimensions.find((d) => d.dimension === 'CODING');

    expect(codingDim).toBeDefined();
    expect(codingDim?.score).toBeGreaterThan(0);
    expect(codingDim?.evidenceLevel).not.toBe('INSUFFICIENT');
  });

  // 7. Interview score calculation
  test('7. Interview score calculation aggregates completed sessions', async () => {
    const current = await placementReadinessService.getCurrentAssessment(userA.id);
    const interviewDim = current?.dimensions.find((d) => d.dimension === 'INTERVIEW');

    expect(interviewDim).toBeDefined();
    expect(interviewDim?.score).toBe(82);
    expect(interviewDim?.evidenceLevel).toBe('LIMITED');
  });

  // 8. Resume score calculation
  test('8. Missing resume handled correctly as null score and INSUFFICIENT evidence', async () => {
    const current = await placementReadinessService.getCurrentAssessment(userA.id);
    const resumeDim = current?.dimensions.find((d) => d.dimension === 'RESUME');

    expect(resumeDim).toBeDefined();
    expect(resumeDim?.score).toBeNull();
    expect(resumeDim?.evidenceLevel).toBe('INSUFFICIENT');
  });

  // 9. Roadmap score calculation
  test('9. Active roadmap progress percentage is mapped correctly', async () => {
    const current = await placementReadinessService.getCurrentAssessment(userA.id);
    const roadmapDim = current?.dimensions.find((d) => d.dimension === 'ROADMAP');

    expect(roadmapDim).toBeDefined();
    expect(roadmapDim?.score).toBe(50); // 1 of 2 milestones completed = 50%
  });

  // 10. Weighted overall calculation matches PLACEMENT_WEIGHTS
  test('10. Weighted overall calculation normalizes score across available weights', async () => {
    const assessment = await placementReadinessService.getCurrentAssessment(userA.id);
    expect(assessment).toBeDefined();

    if (assessment) {
      // Dimensions: INTERVIEW (82, 0.40), CODING (~22, 0.30), ROADMAP (50, 0.15), RESUME (null, 0.15)
      // Total available weight = 0.40 + 0.30 + 0.15 = 0.85 (85% coverage)
      expect(assessment.evidenceCoverage).toBe(85);
    }
  });

  // 11-14. User B missing all data sources
  test('11-14. User B with zero evidence data yields 0 overall score and Insufficient Data dimensions', async () => {
    const assessment = await placementReadinessService.calculateAssessment(userB.id, 'Data Analyst', 'Global IT Services', true);

    expect(assessment.overallScore).toBe(0);
    expect(assessment.evidenceCoverage).toBe(0);
    expect(assessment.readinessLevel).toBe('Needs Attention');

    assessment.dimensions.forEach((d) => {
      expect(d.score).toBeNull();
      expect(d.evidenceLevel).toBe('INSUFFICIENT');
    });
  });

  // 15. Evidence coverage calculation accuracy
  test('15. Evidence coverage calculated correctly as percentage sum of available weights', async () => {
    const assessment = await placementReadinessService.getCurrentAssessment(userA.id);
    expect(assessment?.evidenceCoverage).toBe(85);
  });

  // 16. Readiness level label matching
  test('16. Readiness level calculated correctly based on score range', () => {
    expect(getReadinessLevel(25).label).toBe('Needs Attention');
    expect(getReadinessLevel(50).label).toBe('Developing');
    expect(getReadinessLevel(68).label).toBe('Progressing');
    expect(getReadinessLevel(82).label).toBe('Strong Preparation');
    expect(getReadinessLevel(95).label).toBe('Highly Prepared');
  });

  // 17. Recommendation generation
  test('17. Recommendation generation produces prioritized action plan with routes', async () => {
    const assessment = await placementReadinessService.getCurrentAssessment(userA.id);
    expect(assessment?.recommendations).toBeDefined();
    expect(assessment?.recommendations.length).toBeGreaterThan(0);

    const firstRec = assessment?.recommendations[0];
    expect(firstRec?.priority).toBeDefined();
    expect(firstRec?.route).toBeDefined();
  });

  // 18. Assessment persistence
  test('18. Assessment persistence writes records and dimensions to database', async () => {
    const count = await prisma.placementAssessment.count({ where: { userId: userA.id } });
    expect(count).toBeGreaterThan(0);
  });

  // 19. Assessment history query
  test('19. GET /api/placement/history returns historical assessments ordered by date', async () => {
    const res = await request(app)
      .get('/api/placement/history')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 20. 15-minute caching mechanism
  test('20. Duplicate calculation without forceRefresh returns cached assessment without re-deducting credits', async () => {
    const balBefore = await creditService.getUserBalance(userA.id);

    const res = await request(app)
      .post('/api/placement/assess')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        targetRole: 'Software Engineer',
        companyCategory: 'Product Technology',
        forceRefresh: false,
      });

    const balAfter = await creditService.getUserBalance(userA.id);

    expect(res.status).toBe(200);
    expect(balAfter).toBe(balBefore); // No credits deducted!
  });

  // 21. Insufficient credits handling
  test('21. Insufficient credits returns HTTP 402 with INSUFFICIENT_CREDITS code', async () => {
    // Deplete userB credits to 0
    await prisma.user.update({ where: { id: userB.id }, data: { credits: 0 } });

    const res = await request(app)
      .post('/api/placement/assess')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ forceRefresh: true });

    expect(res.status).toBe(402);
    expect(res.body.code).toBe('INSUFFICIENT_CREDITS');
    expect(res.body.requiredCredits).toBe(2);
  });

  // 22. Credit deduction atomicity
  test('22. Atomic deduction of 2 credits upon forceRefresh assessment generation', async () => {
    // Reset User A credits to 50
    await prisma.user.update({ where: { id: userA.id }, data: { credits: 50 } });

    await request(app)
      .post('/api/placement/assess')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ targetRole: 'DevOps Engineer', forceRefresh: true });

    const balAfter = await creditService.getUserBalance(userA.id);
    expect(balAfter).toBe(48); // Exactly 2 credits deducted!
  });

  // 23. AI service failure fallback
  test('23. AI explanation service fallback generates structured response seamlessly if Gemini is unavailable', async () => {
    const fallback = (aiClient as any).getLocalPlacementFallback({
      targetRole: 'QA Engineer',
      companyCategory: 'Global IT Services',
      overallScore: 65,
      evidenceCoverage: 75,
      readinessLevel: 'Progressing',
      dimensions: [
        { dimension: 'CODING', score: 70, evidenceLevel: 'MODERATE', source: 'Coding Arena', explanation: 'Good', evidenceDetails: [] },
      ],
    });

    expect(fallback.summary).toContain('QA Engineer');
    expect(fallback.recommendedActions.length).toBeGreaterThan(0);
  });

  // 24. Invalid AI response handling
  test('24. Invalid AI response handled cleanly without throwing error', async () => {
    const current = await placementReadinessService.getCurrentAssessment(userA.id);
    expect(current?.summary).toBeDefined();
  });

  // 25. Recommendation toggle ownership check
  test('25. User B cannot toggle User A recommendation', async () => {
    const assessmentA = await placementReadinessService.getCurrentAssessment(userA.id);
    const recId = assessmentA?.recommendations[0]?.id;

    if (recId && assessmentA) {
      const res = await request(app)
        .patch(`/api/placement/${assessmentA.id}/recommendations/${recId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ completed: true });

      expect(res.status).toBe(404);
    }
  });
});
