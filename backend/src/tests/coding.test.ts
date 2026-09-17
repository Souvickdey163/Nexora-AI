import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { aiClient } from '../services/ai.client';
import { UserStatus } from '@prisma/client';

describe('Nexora Coding Arena API & Service Tests', () => {
  jest.setTimeout(30000);

  let userA: any;
  let userB: any;
  let tokenA: string;
  let tokenB: string;
  let testProblemId: string;
  let testProblemSlug: string;

  beforeAll(async () => {
    // Setup Test User A
    userA = await prisma.user.create({
      data: {
        email: `coding_usera_${Date.now()}@nexora.ai`,
        firstName: 'CodingUserA',
        lastName: 'Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenA = tokenService.generateAccessToken({ userId: userA.id, email: userA.email, status: userA.status });

    // Setup Test User B
    userB = await prisma.user.create({
      data: {
        email: `coding_userb_${Date.now()}@nexora.ai`,
        firstName: 'CodingUserB',
        lastName: 'Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenB = tokenService.generateAccessToken({ userId: userB.id, email: userB.email, status: userB.status });

    // Fetch a seeded problem ID
    const problem = await prisma.codingProblem.findFirst();
    if (problem) {
      testProblemId = problem.id;
      testProblemSlug = problem.slug;
    }
  });

  beforeEach(() => {
    // Mock AI Client sendMentorChat
    aiClient.sendMentorChat = jest.fn(async (userMessage: string) => {
      if (userMessage.includes('HINT')) {
        return {
          message: 'Hint: Think about using Kadane algorithm or a running sum variable.',
          model: 'gemini-3.6-flash',
          provider: 'gemini',
        };
      }
      return {
        message: 'Mocked Nexus AI Coding Advice: Ensure optimal time complexity O(N).',
        model: 'gemini-3.6-flash',
        provider: 'gemini',
      };
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.codingSubmission.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.codingProgress.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
  });

  // 1. Problem Listing
  it('1. should list coding problems with pagination and count', async () => {
    const res = await request(app)
      .get('/api/coding/problems?page=1&limit=10')
      .expect(200);

    expect(Array.isArray(res.body.problems)).toBe(true);
    expect(res.body.problems.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.page).toBe(1);
  });

  // 2. Problem Filtering by Difficulty and Topic
  it('2. should filter problems by difficulty and topic', async () => {
    const res = await request(app)
      .get('/api/coding/problems?difficulty=EASY&topic=Arrays')
      .expect(200);

    expect(Array.isArray(res.body.problems)).toBe(true);
    res.body.problems.forEach((p: any) => {
      expect(p.difficulty).toBe('EASY');
      expect(p.topic.toLowerCase()).toBe('arrays');
    });
  });

  // 3. Problem Retrieval & Hidden Test Case Protection
  it('3. should retrieve problem details and NEVER expose hidden test cases or expected outputs', async () => {
    const res = await request(app)
      .get(`/api/coding/problems/${testProblemId}`)
      .expect(200);

    expect(res.body.id).toBe(testProblemId);
    expect(res.body.slug).toBe(testProblemSlug);
    expect(Array.isArray(res.body.testCases)).toBe(true);

    // Verify hidden test cases do not leak expected output
    res.body.testCases.forEach((tc: any) => {
      if (tc.isHidden) {
        expect(tc.expectedOutput).toBeUndefined();
      }
    });
  });

  // 4. Authentication Protection for Execution Endpoints
  it('4. should reject /run and /submit without JWT token with status 401', async () => {
    await request(app)
      .post(`/api/coding/problems/${testProblemId}/run`)
      .send({ language: 'python', code: 'class Solution:\n    def test(): pass' })
      .expect(401);

    await request(app)
      .post(`/api/coding/problems/${testProblemId}/submit`)
      .send({ language: 'python', code: 'class Solution:\n    def test(): pass' })
      .expect(401);
  });

  // 5. Code Running (/run against visible test cases)
  it('5. should execute code run against visible test cases for authenticated user', async () => {
    const res = await request(app)
      .post(`/api/coding/problems/${testProblemId}/run`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        language: 'python',
        code: `class Solution:\n    def solve(self):\n        return True`,
      })
      .expect(200);

    expect(res.body.status).toBeDefined();
    expect(typeof res.body.testsPassed).toBe('number');
    expect(Array.isArray(res.body.testSummary)).toBe(true);
  });

  // 6. Code Submission & Progress Calculation (/submit)
  it('6. should process code submission, evaluate test cases, and persist submission & progress in DB', async () => {
    const res = await request(app)
      .post(`/api/coding/problems/${testProblemId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        language: 'python',
        code: `class Solution:\n    def maxSubArray(self, nums):\n        cur = max_sum = nums[0]\n        for x in nums[1:]:\n            cur = max(x, cur + x)\n            max_sum = max(max_sum, cur)\n        return max_sum`,
      })
      .expect(200);

    expect(res.body.submissionId).toBeDefined();
    expect(res.body.result.status).toBe('ACCEPTED');
    expect(res.body.result.testsPassed).toBeGreaterThan(0);

    // Verify submission record in DB
    const dbSub = await prisma.codingSubmission.findUnique({
      where: { id: res.body.submissionId },
    });
    expect(dbSub).toBeDefined();
    expect(dbSub?.userId).toBe(userA.id);

    // Verify progress record in DB
    const dbProg = await prisma.codingProgress.findUnique({
      where: { userId_problemId: { userId: userA.id, problemId: testProblemId } },
    });
    expect(dbProg).toBeDefined();
    expect(dbProg?.isSolved).toBe(true);
  });

  // 7. User Submissions History
  it('7. should list user submission history', async () => {
    const res = await request(app)
      .get(`/api/coding/submissions?problemId=${testProblemId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].problemId).toBe(testProblemId);
  });

  // 8. User Stats & Streak Calculation
  it('8. should calculate user coding statistics, difficulty breakdown, and streak', async () => {
    const res = await request(app)
      .get('/api/coding/stats')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(res.body.totalSolved).toBeGreaterThanOrEqual(1);
    expect(res.body.totalProblems).toBeGreaterThan(0);
    expect(res.body.difficultyBreakdown).toBeDefined();
    expect(Array.isArray(res.body.topicPerformance)).toBe(true);
  });

  // 9. AI Coding Mentor Query Endpoint
  it('9. should consult AI Coding Mentor and return contextual advice', async () => {
    const res = await request(app)
      .post('/api/coding/mentor')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        problemId: testProblemId,
        queryType: 'HINT',
        language: 'python',
        userCode: 'class Solution: pass',
      })
      .expect(200);

    expect(res.body.message).toContain('Hint:');
    expect(res.body.provider).toBe('gemini');
  });

  // 10. Error Validation: Unsupported Language
  it('10. should reject unsupported language with 400 error', async () => {
    const res = await request(app)
      .post(`/api/coding/problems/${testProblemId}/run`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        language: 'ruby_unsupported',
        code: 'def test; end',
      })
      .expect(400);

    expect(res.body.error).toContain('is not supported');
  });

  // 11. Error Validation: Oversized Code
  it('11. should reject oversized code with 400 validation error', async () => {
    const hugeCode = 'a'.repeat(60000);
    const res = await request(app)
      .post(`/api/coding/problems/${testProblemId}/run`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        language: 'python',
        code: hugeCode,
      })
      .expect(400);

    expect(res.body.error).toBeDefined();
  });
});
