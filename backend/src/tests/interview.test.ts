import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { UserStatus, InterviewMode, InterviewType, Difficulty } from '@prisma/client';

describe('Nexora AI Interview Studio API & Service Tests', () => {
  jest.setTimeout(30000);

  let userA: any;
  let userB: any;
  let tokenA: string;
  let tokenB: string;
  let interviewIdA: string;

  beforeAll(async () => {
    // Setup Test User A
    userA = await prisma.user.create({
      data: {
        email: `interview_usera_${Date.now()}@nexora.ai`,
        firstName: 'InterviewUserA',
        lastName: 'Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenA = tokenService.generateAccessToken({ userId: userA.id, email: userA.email, status: userA.status });

    // Setup Test User B
    userB = await prisma.user.create({
      data: {
        email: `interview_userb_${Date.now()}@nexora.ai`,
        firstName: 'InterviewUserB',
        lastName: 'Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenB = tokenService.generateAccessToken({ userId: userB.id, email: userB.email, status: userB.status });
  });

  afterAll(async () => {
    // Clean up
    await prisma.interviewEvent.deleteMany({ where: { interview: { userId: { in: [userA.id, userB.id] } } } });
    await prisma.interviewRecording.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.interviewReport.deleteMany({ where: { interview: { userId: { in: [userA.id, userB.id] } } } });
    await prisma.interviewAnswer.deleteMany({ where: { question: { interview: { userId: { in: [userA.id, userB.id] } } } } });
    await prisma.interviewQuestion.deleteMany({ where: { interview: { userId: { in: [userA.id, userB.id] } } } });
    await prisma.interview.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
  });

  // 1. Auth protection
  it('1. should reject unauthenticated interview creation with 401', async () => {
    await request(app)
      .post('/api/interviews/create')
      .send({
        mode: InterviewMode.MOCK_TEST,
        targetRole: 'Frontend Developer',
      })
      .expect(401);
  });

  // 2. Create Interview Session
  it('2. should create new interview session and auto-generate question 1 for User A', async () => {
    const res = await request(app)
      .post('/api/interviews/create')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        mode: InterviewMode.MOCK_TEST,
        type: InterviewType.TECHNICAL,
        targetRole: 'Senior Full Stack Engineer',
        difficulty: Difficulty.MEDIUM,
        durationMinutes: 30,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.targetRole).toBe('Senior Full Stack Engineer');
    expect(res.body.questions.length).toBeGreaterThan(0);
    expect(res.body.questions[0].questionText).toBeDefined();

    interviewIdA = res.body.id;
  });

  // 2b. Create SYSTEM_DESIGN Interview Session
  it('2b. should create a SYSTEM_DESIGN interview session and generate system-design question 1', async () => {
    const res = await request(app)
      .post('/api/interviews/create')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        mode: InterviewMode.MOCK_TEST,
        type: InterviewType.SYSTEM_DESIGN,
        targetRole: 'Backend System Architect',
        difficulty: Difficulty.HARD,
        durationMinutes: 45,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.type).toBe('SYSTEM_DESIGN');
    expect(res.body.questions.length).toBeGreaterThan(0);
    expect(res.body.questions[0].questionText).toBeDefined();
  });

  // 3. Retrieve Interview by ID
  it('3. should retrieve interview details for User A', async () => {
    const res = await request(app)
      .get(`/api/interviews/${interviewIdA}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(res.body.id).toBe(interviewIdA);
    expect(res.body.userId).toBe(userA.id);
  });

  // 4. Strict Ownership Isolation Check: User B trying to access User A's session
  it('4. should block User B from accessing User A interview session with 404', async () => {
    await request(app)
      .get(`/api/interviews/${interviewIdA}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);
  });

  // 5. Submit Answer & Speech/Language Analysis
  it('5. should submit candidate answer and calculate WPM and language distribution', async () => {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewIdA },
      include: { questions: true },
    });
    const questionId = interview!.questions[0].id;

    const res = await request(app)
      .post(`/api/interviews/${interviewIdA}/answers`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        questionId,
        userText: 'In my previous project, I designed a microservices architecture using Node.js and Redis caching. Actually, we handled over 50,000 requests per minute with zero downtime.',
        transcriptText: 'In my previous project, I designed a microservices architecture using Node.js and Redis caching. Actually, we handled over 50,000 requests per minute with zero downtime.',
        durationSeconds: 30,
      })
      .expect(200);

    expect(res.body.id).toBeDefined();
    expect(res.body.wpm).toBeGreaterThan(0);
    expect(res.body.evaluationScore).toBeGreaterThanOrEqual(0);
  });

  // 6. Next Question Generation
  it('6. should generate next adaptive question via AI microservice', async () => {
    const res = await request(app)
      .post(`/api/interviews/${interviewIdA}/next-question`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(res.body.isFinished).toBe(false);
    expect(res.body.question).toBeDefined();
    expect(res.body.question.questionIndex).toBe(2);
  });

  // 7. Log Integrity Event
  it('7. should log integrity event (window blur / focus loss)', async () => {
    const res = await request(app)
      .post(`/api/interviews/${interviewIdA}/events`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        eventType: 'WINDOW_BLUR',
        message: 'Candidate switched tabs during interview.',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.eventType).toBe('WINDOW_BLUR');
  });

  // 8. Upload Video Recording Stream
  it('8. should upload video recording blob for interview session', async () => {
    const mockVideoBuffer = Buffer.from('FAKE_WEBM_VIDEO_HEADER_CONTENT_DATA');

    const res = await request(app)
      .post(`/api/interviews/${interviewIdA}/recording`)
      .set('Authorization', `Bearer ${tokenA}`)
      .attach('video', mockVideoBuffer, 'interview.webm')
      .field('durationSeconds', '180')
      .expect(200);

    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('SAVED');
    expect(res.body.durationSeconds).toBe(180);
  });

  // 9. Stream Recording Buffer with User B Ownership Check
  it('9. should allow User A to stream recording but reject User B with 404', async () => {
    // User A succeeds
    const streamRes = await request(app)
      .get(`/api/interviews/${interviewIdA}/recording`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(streamRes.headers['content-type']).toContain('video/webm');

    // User B blocked
    await request(app)
      .get(`/api/interviews/${interviewIdA}/recording`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);
  });

  // 10. Finish Interview & Synthesize 5-Dimension Performance Report
  it('10. should finish interview and synthesize report with presentation HUD & STAR metrics', async () => {
    const res = await request(app)
      .post(`/api/interviews/${interviewIdA}/finish`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        presentationMetrics: {
          faceVisibilityPct: 98,
          cameraOrientation: 'Centered',
          gazeShifts: 2,
          posture: 'Upright',
        },
      })
      .expect(200);

    expect(res.body.overallScore).toBeGreaterThan(0);
    expect(res.body.technicalScore).toBeGreaterThan(0);
    expect(res.body.communicationScore).toBeGreaterThan(0);
    expect(Array.isArray(res.body.strengths)).toBe(true);
    expect(Array.isArray(res.body.improvements)).toBe(true);
  });

  // 11. List User Interview History
  it('11. should list User A interview history', async () => {
    const res = await request(app)
      .get('/api/interviews')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(Array.isArray(res.body.interviews)).toBe(true);
    expect(res.body.interviews.length).toBeGreaterThan(0);
    expect(res.body.interviews.some((item: any) => item.id === interviewIdA)).toBe(true);
  });

  // 12. Delete Interview Session
  it('12. should delete interview session', async () => {
    await request(app)
      .delete(`/api/interviews/${interviewIdA}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    // Verify deleted
    await request(app)
      .get(`/api/interviews/${interviewIdA}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(404);
  });
});
