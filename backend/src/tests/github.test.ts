import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';

describe('GitHub Intelligence API Endpoints', () => {
  let userId: string;
  let authToken: string;
  let testUserBId: string;
  let authTokenB: string;

  beforeAll(async () => {
    // Cleanup any pre-existing test users
    await prisma.user.deleteMany({
      where: { email: { in: ['github_test_user@nexora.ai', 'github_test_user_b@nexora.ai'] } },
    });

    // Create primary test user A
    const userA = await prisma.user.create({
      data: {
        email: 'github_test_user@nexora.ai',
        firstName: 'GitHub',
        lastName: 'Developer',
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
    userId = userA.id;
    authToken = tokenService.generateAccessToken({ userId: userA.id, email: userA.email, status: 'ACTIVE' });

    // Create test user B for data isolation verification
    const userB = await prisma.user.create({
      data: {
        email: 'github_test_user_b@nexora.ai',
        firstName: 'Other',
        lastName: 'User',
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
    testUserBId = userB.id;
    authTokenB = tokenService.generateAccessToken({ userId: userB.id, email: userB.email, status: 'ACTIVE' });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: ['github_test_user@nexora.ai', 'github_test_user_b@nexora.ai'] } },
    });
    await prisma.$disconnect();
  });

  it('1. GET /api/github/profile should return connected: false when not connected', async () => {
    const res = await request(app)
      .get('/api/github/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.connected).toBe(false);
    expect(res.body.profile).toBeNull();
  });

  it('2. POST /api/github/connect should connect GitHub account with real profile metadata', async () => {
    const res = await request(app)
      .post('/api/github/connect')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ username: 'octocat' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.profile).toBeDefined();
    expect(res.body.profile.username).toBe('octocat');
    expect(res.body.profile.stats.totalRepositories).toBeGreaterThanOrEqual(0);
  });

  it('3. GET /api/github/repositories should return user repositories', async () => {
    const res = await request(app)
      .get('/api/github/repositories')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.repositories)).toBe(true);
  });

  it('4. POST /api/github/repositories/:owner/:repo/analyze should trigger analysis on explicit request', async () => {
    // First seed a test repository for user A
    const account = await prisma.gitHubAccount.findUnique({ where: { userId } });
    if (!account) throw new Error('Account missing');

    const repo = await prisma.gitHubRepository.create({
      data: {
        githubAccountId: account.id,
        userId,
        githubRepoId: '999999',
        owner: 'octocat',
        name: 'Hello-World',
        fullName: 'octocat/Hello-World',
        description: 'My first repository on GitHub!',
        url: 'https://github.com/octocat/Hello-World',
        primaryLanguage: 'TypeScript',
        stars: 120,
        forks: 45,
      },
    });

    const res = await request(app)
      .post(`/api/github/repositories/octocat/Hello-World/analyze`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analysis).toBeDefined();
    expect(res.body.analysis.projectSummary).toBeDefined();
    expect(res.body.analysis.engineeringSignals).toBeDefined();
    expect(Array.isArray(res.body.analysis.resumeBullets)).toBe(true);
    expect(Array.isArray(res.body.analysis.interviewQuestions)).toBe(true);
  });

  it('5. GET /api/github/resume-alignment should return evidence-based resume skills comparison', async () => {
    const res = await request(app)
      .get('/api/github/resume-alignment')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.alignment)).toBe(true);
    if (res.body.alignment.length > 0) {
      const firstSkill = res.body.alignment[0];
      expect(firstSkill.statusLabel).toMatch(/(Strong|Moderate|Limited|Insufficient) (GitHub|repository) evidence/);
    }
  });

  it('6. User Data Isolation: User B cannot see User A GitHub profile or repos', async () => {
    const res = await request(app)
      .get('/api/github/profile')
      .set('Authorization', `Bearer ${authTokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.connected).toBe(false);

    const reposRes = await request(app)
      .get('/api/github/repositories')
      .set('Authorization', `Bearer ${authTokenB}`);

    expect(reposRes.status).toBe(200);
    expect(reposRes.body.repositories.length).toBe(0);
  });
});
