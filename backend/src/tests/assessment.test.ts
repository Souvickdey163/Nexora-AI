import { assessmentService } from '../services/assessment.service';
import { prisma } from '../config/database';
import { creditService } from '../services/credit.service';

describe('Diagnostic Skill Assessment Unit & Integration Test Suite', () => {
  let testUserId: string;
  let secondaryUserId: string;

  beforeAll(async () => {
    // Create test user with credits
    const testUser = await prisma.user.create({
      data: {
        email: `assessment_test_${Date.now()}@nexora.ai`,
        passwordHash: 'hashed_password',
        firstName: 'Skill',
        lastName: 'Tester',
        credits: 10,
      },
    });
    testUserId = testUser.id;
    await creditService.grantWelcomeBonus(testUserId);

    // Create secondary user for cross-user security checks
    const secUser = await prisma.user.create({
      data: {
        email: `assessment_sec_${Date.now()}@nexora.ai`,
        passwordHash: 'hashed_password',
        firstName: 'Other',
        lastName: 'User',
        credits: 10,
      },
    });
    secondaryUserId = secUser.id;
    await creditService.grantWelcomeBonus(secondaryUserId);
  });

  afterAll(async () => {
    await prisma.skillAssessmentAttempt.deleteMany({
      where: { userId: { in: [testUserId, secondaryUserId] } },
    });
    await prisma.creditTransaction.deleteMany({
      where: { userId: { in: [testUserId, secondaryUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, secondaryUserId] } },
    });
  });

  it('1. Should return categories and statistical information', async () => {
    const categories = await assessmentService.getCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThanOrEqual(5);
    expect(categories.some((c) => c.name.includes('DBMS') || c.id === 'DBMS')).toBe(true);
  });

  it('2 & 3. Should deduct 2 credits and start a new assessment session', async () => {
    const userBefore = await prisma.user.findUnique({ where: { id: testUserId } });
    const initialCredits = userBefore?.credits || 10;

    const session = (await assessmentService.startAssessment(testUserId, 'DBMS & SQL', 'INTERMEDIATE', 10)) as any;
    expect(session).toBeDefined();
    expect(session.assessmentId).toBeDefined();
    expect(session.category).toBe('DBMS');
    expect(session.totalQuestions).toBe(10);
    expect(session.questions.length).toBe(10);

    // Verify correct answers are NOT exposed to browser
    session.questions.forEach((q: any) => {
      expect(q.correctOptionIndex).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    });

    const userAfter = await prisma.user.findUnique({ where: { id: testUserId } });
    expect(userAfter?.credits).toBe(initialCredits - 2);
  });

  it('4. Should fail to start assessment when credits are insufficient', async () => {
    const poorUser = await prisma.user.create({
      data: {
        email: `poor_user_${Date.now()}@nexora.ai`,
        passwordHash: 'pass',
        firstName: 'Poor',
        lastName: 'User',
        credits: 0,
        creditTransactions: {
          create: {
            type: 'WELCOME_BONUS',
            amount: 10,
            balanceBefore: 0,
            balanceAfter: 0,
            description: 'Test Welcome Bonus',
            status: 'COMPLETED',
          },
        },
      },
    });

    await expect(
      assessmentService.startAssessment(poorUser.id, 'DSA', 'BEGINNER', 10)
    ).rejects.toThrow();

    await prisma.creditTransaction.deleteMany({ where: { userId: poorUser.id } });
    await prisma.user.delete({ where: { id: poorUser.id } });
  });

  it('5 & 6. Should restore active session on refresh', async () => {
    const active = (await assessmentService.getActiveSession(testUserId)) as any;
    expect(active).toBeDefined();
    expect(active?.status).toBe('IN_PROGRESS');
  });

  it('7 & 8. Should save and update (upsert) user answers', async () => {
    const active = (await assessmentService.getActiveSession(testUserId)) as any;
    expect(active).toBeDefined();
    const q1 = active.questions[0];

    const save1 = await assessmentService.saveAnswer(testUserId, active.assessmentId, q1.id, 1, 12);
    expect(save1.success).toBe(true);

    // Update answer
    const save2 = await assessmentService.saveAnswer(testUserId, active.assessmentId, q1.id, 2, 18);
    expect(save2.success).toBe(true);

    const checkActive = (await assessmentService.getActiveSession(testUserId)) as any;
    expect((checkActive?.answersData as any[]).length).toBe(1);
    expect((checkActive?.answersData as any[])[0].selectedOptionIndex).toBe(2);
  });

  it('9 & 10. Should log proctored integrity events', async () => {
    const active = (await assessmentService.getActiveSession(testUserId)) as any;
    const log1 = await assessmentService.logIntegrityEvent(testUserId, active.assessmentId, 'FULLSCREEN_ENTER');
    expect(log1.success).toBe(true);

    const log2 = await assessmentService.logIntegrityEvent(testUserId, active.assessmentId, 'TAB_HIDDEN');
    expect(log2.success).toBe(true);
  });

  it('11, 12 & 13. Should calculate deterministic score on submit', async () => {
    const active = (await assessmentService.getActiveSession(testUserId)) as any;
    const assessmentId = active.assessmentId;

    // Fetch internal correct options for deterministic testing
    const attemptRecord = await prisma.skillAssessmentAttempt.findUnique({
      where: { id: assessmentId },
    });
    const storedQuestions = (attemptRecord?.questionsData as any[]) || [];

    // Answer 8 correct, 2 incorrect -> Expected 80%
    const testAnswers = storedQuestions.map((q, idx) => ({
      questionId: q.id,
      selectedOptionIndex: idx < 8 ? q.correctOptionIndex : (q.correctOptionIndex + 1) % 4,
      timeSpentSeconds: 15,
    }));

    const result = await assessmentService.submitAssessment(testUserId, assessmentId, testAnswers);
    expect(result.score).toBe(80);
    expect(result.correctAnswers).toBe(8);
    expect(result.incorrectAnswers).toBe(2);
    expect(result.status).toBe('COMPLETED');
    expect(result.topicAnalysis).toBeDefined();
    expect(result.aiReport).toBeDefined();
  });

  it('14. Reject cross-user assessment access', async () => {
    const history = await assessmentService.getHistory(testUserId);
    const completedAttemptId = history[0].id;

    await expect(
      assessmentService.getAssessmentResult(completedAttemptId, secondaryUserId)
    ).rejects.toThrow();
  });

  it('15. History and Analytics should return user specific data', async () => {
    const history = await assessmentService.getHistory(testUserId);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].userId).toBe(testUserId);

    const analytics = await assessmentService.getAnalytics(testUserId);
    expect(analytics.totalAssessments).toBeGreaterThan(0);
    expect(analytics.averageScore).toBe(80);
    expect(analytics.domainProficiency).toBeDefined();
  });
});
