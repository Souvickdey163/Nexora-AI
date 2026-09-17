import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { UserStatus } from '@prisma/client';
import { validatePdfFile } from '../utils/pdfValidator';

// Minimal valid PDF binary buffer with magic bytes %PDF-
const samplePdfBuffer = Buffer.from(
  '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 56 >>\nstream\nBT /F1 12 Tf 72 712 Td (John Doe - Senior Software Engineer JavaScript TypeScript React Node.js PostgreSQL Docker AWS REST API) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000224 00000 n \n0000000300 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n407\n%%EOF'
);

describe('AI Resume Intelligence Feature - E2E Backend Tests', () => {
  jest.setTimeout(30000);

  let user1Id = '';
  let user1Token = '';
  let user2Id = '';
  let user2Token = '';
  let resumeId = '';
  let version1Id = '';
  let version2Id = '';
  let analysis1Id = '';

  const user1Email = `resume_test1_${Date.now()}@nexora.ai`;
  const user2Email = `resume_test2_${Date.now()}@nexora.ai`;

  beforeAll(async () => {
    await prisma.$connect();

    // Create User 1
    const u1 = await prisma.user.create({
      data: {
        email: user1Email,
        firstName: 'Resume',
        lastName: 'User1',
        emailVerified: true,
        status: UserStatus.ACTIVE,
        profile: { create: { skills: ['JavaScript'] } },
      },
    });
    user1Id = u1.id;
    user1Token = tokenService.generateAccessToken({ userId: u1.id, email: u1.email, status: u1.status });

    // Create User 2
    const u2 = await prisma.user.create({
      data: {
        email: user2Email,
        firstName: 'Resume',
        lastName: 'User2',
        emailVerified: true,
        status: UserStatus.ACTIVE,
        profile: { create: { skills: ['Python'] } },
      },
    });
    user2Id = u2.id;
    user2Token = tokenService.generateAccessToken({ userId: u2.id, email: u2.email, status: u2.status });
  });

  afterAll(async () => {
    // Cleanup database test records
    await prisma.resume.deleteMany({ where: { userId: { in: [user1Id, user2Id] } } });
    await prisma.userProfile.deleteMany({ where: { userId: { in: [user1Id, user2Id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [user1Id, user2Id] } } });
    await prisma.$disconnect();
  });

  // 1. PDF Validator Utility Unit Test
  test('1. PDF Validator should reject invalid extensions, MIME types, or fake headers', () => {
    const invalidExt = validatePdfFile(Buffer.from('test'), 'resume.docx', 'application/pdf');
    expect(invalidExt.valid).toBe(false);

    const invalidMime = validatePdfFile(Buffer.from('test'), 'resume.pdf', 'text/plain');
    expect(invalidMime.valid).toBe(false);

    const invalidHeader = validatePdfFile(Buffer.from('NOT_A_PDF'), 'resume.pdf', 'application/pdf');
    expect(invalidHeader.valid).toBe(false);

    const valid = validatePdfFile(samplePdfBuffer, 'resume.pdf', 'application/pdf');
    expect(valid.valid).toBe(true);
  });

  // 2. Authorization Security Check
  test('2. Unauthenticated access to /api/resumes should return 401', async () => {
    const res = await request(app).get('/api/resumes');
    expect(res.status).toBe(401);
  });

  // 3. Initial PDF Resume Upload (Creates Resume + Version 1)
  test('3. POST /api/resumes uploads PDF and creates Resume + Version 1', async () => {
    const res = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${user1Token}`)
      .attach('file', samplePdfBuffer, 'John_Doe_Resume.pdf')
      .field('title', 'Software Engineer Resume');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Software Engineer Resume');
    expect(res.body.data.currentVersion).toBeDefined();
    expect(res.body.data.currentVersion.versionNumber).toBe(1);

    resumeId = res.body.data.id;
    version1Id = res.body.data.currentVersion.id;
  });

  // 4. IDOR / Ownership Security Check
  test('4. User 2 cannot access or view User 1 resume details', async () => {
    const res = await request(app)
      .get(`/api/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found or access denied');
  });

  // 5. Versioning (Upload Version 2)
  test('5. POST /api/resumes/:resumeId/versions uploads Version 2 without deleting Version 1', async () => {
    const res = await request(app)
      .post(`/api/resumes/${resumeId}/versions`)
      .set('Authorization', `Bearer ${user1Token}`)
      .attach('file', samplePdfBuffer, 'John_Doe_Resume_v2.pdf');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.versionNumber).toBe(2);

    version2Id = res.body.data.id;

    // Verify all versions list returns both Version 1 and Version 2
    const listRes = await request(app)
      .get(`/api/resumes/${resumeId}/versions`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(2);
  });

  // 6. Secure Stream File Download
  test('6. GET /api/resumes/:resumeId/versions/:versionId/file streams PDF with ownership check', async () => {
    // Unauthorized attempt by User 2
    const unauthRes = await request(app)
      .get(`/api/resumes/${resumeId}/versions/${version1Id}/file`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(unauthRes.status).toBe(404);

    // Authorized download by User 1
    const authRes = await request(app)
      .get(`/api/resumes/${resumeId}/versions/${version1Id}/file`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(authRes.status).toBe(200);
    expect(authRes.header['content-type']).toContain('application/pdf');
  });

  // 7. Trigger AI Analysis
  test('7. POST /api/resumes/:resumeId/versions/:versionId/analyze executes AI analysis', async () => {
    // Ensure test versions have extracted text set for PDF parser mock
    await prisma.resumeVersion.updateMany({
      where: { id: { in: [version1Id, version2Id] } },
      data: { extractedText: 'John Doe - Senior Software Engineer JavaScript TypeScript React Node.js PostgreSQL Docker AWS REST API' },
    });

    const res = await request(app)
      .post(`/api/resumes/${resumeId}/versions/${version1Id}/analyze`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        targetRole: 'Senior Fullstack Engineer',
        targetCompany: 'Nexora AI',
        jobDescription: 'Looking for a Senior Engineer with Node.js, PostgreSQL, React, and TypeScript expertise.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overallScore).toBeGreaterThanOrEqual(0);
    expect(res.body.data.overallScore).toBeLessThanOrEqual(100);
    expect(res.body.data.analysisStatus).toBe('COMPLETED');
    expect(res.body.data.strengths.length).toBeGreaterThan(0);

    analysis1Id = res.body.data.id;
  });

  // 8. Analysis History (Never Overwrites Previous Analysis)
  test('8. Second analysis creates a new historical record without overwriting Analysis 1', async () => {
    const res2 = await request(app)
      .post(`/api/resumes/${resumeId}/versions/${version2Id}/analyze`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        targetRole: 'Lead Backend Engineer',
      });

    expect(res2.status).toBe(200);
    expect(res2.body.data.id).not.toBe(analysis1Id);

    // Get analysis history list
    const historyRes = await request(app)
      .get(`/api/resumes/${resumeId}/analyses`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(historyRes.status).toBe(200);
    expect(historyRes.body.data.total).toBe(2);
    expect(historyRes.body.data.data.length).toBe(2);
  });

  // 9. Score Progress Endpoint
  test('9. GET /api/resumes/:resumeId/progress returns score trajectory over time', async () => {
    const res = await request(app)
      .get(`/api/resumes/${resumeId}/progress`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentScore).toBeDefined();
    expect(res.body.data.history.length).toBe(2);
  });

  // 10. Dashboard Analytics Summary Endpoint
  test('10. GET /api/resumes/analytics/summary returns aggregated user stats', async () => {
    const res = await request(app)
      .get('/api/resumes/analytics/summary')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalResumes).toBeGreaterThanOrEqual(1);
    expect(res.body.data.totalAnalyses).toBeGreaterThanOrEqual(2);
  });

  // 11. Delete Resume (Safely Cascades DB & Files)
  test('11. DELETE /api/resumes/:resumeId removes resume and associated resources', async () => {
    // User 2 attempt to delete User 1 resume should fail
    const unauthDelete = await request(app)
      .delete(`/api/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(unauthDelete.status).toBe(404);

    // User 1 authorized delete
    const authDelete = await request(app)
      .delete(`/api/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(authDelete.status).toBe(200);

    // Verify deleted
    const getRes = await request(app)
      .get(`/api/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(getRes.status).toBe(404);
  });
});
