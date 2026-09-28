import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { jobvettaProvider } from '../services/jobs/providers/jobvetta.provider';
import { adzunaProvider } from '../services/jobs/providers/adzuna.provider';
import { jobService } from '../services/jobs/job.service';

jest.setTimeout(30000);

describe('Job Opportunities & Career Matching Feature Tests', () => {
  let testUserId: string;
  let testUserToken: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `job_test_${Date.now()}@nexora.ai`,
        firstName: 'Job',
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

    // Create a UserProfile with skills & targetRole
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        targetRole: 'Backend Engineer',
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Git'],
      },
    });
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.userProfile.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  describe('Providers Architecture', () => {
    it('should fetch normalized jobs via AdzunaProvider', async () => {
      const jobs = await adzunaProvider.fetchJobs({ limit: 3, q: 'Software Engineer' });
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);

      const job = jobs[0];
      expect(job).toHaveProperty('id');
      expect(job).toHaveProperty('title');
      expect(job).toHaveProperty('company');
      expect(job).toHaveProperty('skills');
      expect(job).toHaveProperty('applyUrl');
    });

    it('should fetch normalized jobs via JobvettaProvider (with Adzuna fallback)', async () => {
      const jobs = await jobvettaProvider.fetchJobs({ limit: 3, q: 'Backend Engineer' });
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
    });
  });

  describe('Resume Skill Matching & Scoring Engine', () => {
    it('should compute personalized match scores and skill gaps for user', async () => {
      const res = await jobService.getRecommendedJobs(testUserId, { limit: 5 });

      expect(res.success).toBe(true);
      expect(res.targetRole).toBe('Backend Engineer');
      expect(Array.isArray(res.userSkills)).toBe(true);
      expect(Array.isArray(res.recommendedJobs)).toBe(true);
      expect(res.recommendedJobs.length).toBeGreaterThan(0);

      const firstJob = res.recommendedJobs[0];
      expect(firstJob).toHaveProperty('matchScore');
      expect(typeof firstJob.matchScore).toBe('number');
      expect(Array.isArray(firstJob.matchedSkills)).toBe(true);
      expect(Array.isArray(firstJob.missingSkills)).toBe(true);
    });
  });

  describe('Express API Endpoints', () => {
    it('GET /api/jobs should return normalized job opportunities', async () => {
      const res = await request(app).get('/api/jobs?limit=5').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('GET /api/jobs/recommended should return transparent match scores for authenticated user', async () => {
      const res = await request(app)
        .get('/api/jobs/recommended')
        .set('Authorization', `Bearer ${testUserToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.recommendedJobs)).toBe(true);
      expect(Array.isArray(res.body.topMissingSkills)).toBe(true);
    });

    it('GET /api/jobs/:id should return single job opening details', async () => {
      const jobsRes = await request(app).get('/api/jobs?limit=1');
      const jobId = jobsRes.body.jobs[0].id;

      const singleRes = await request(app).get(`/api/jobs/${jobId}`).expect(200);

      expect(singleRes.body.success).toBe(true);
      expect(singleRes.body.job.id).toBe(jobId);
    });
  });
});
