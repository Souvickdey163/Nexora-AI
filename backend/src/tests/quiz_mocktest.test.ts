import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { quizApiService } from '../services/quizapi.service';
import { learningRecommendationService } from '../services/learning-recommendation.service';

jest.setTimeout(30000);

describe('QuizAPI Technical MCQ Mock Test Integration Tests', () => {
  let testUserToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `quiz_test_${Date.now()}@nexora.ai`,
        firstName: 'Quiz',
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
      await prisma.quizMockTestAttempt.deleteMany({
        where: { mockTest: { userId: testUserId } },
      });
      await prisma.quizMockTest.deleteMany({ where: { userId: testUserId } });
      await prisma.userActivity.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  describe('1. QuizAPI Direct Service', () => {
    it('should fetch questions from QuizAPI or fallback and normalize them', async () => {
      const questions = await quizApiService.fetchQuestions({
        category: 'Linux',
        difficulty: 'Medium',
        limit: 5,
      });

      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);

      const q = questions[0];
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('category');
      expect(q).toHaveProperty('difficulty');
      expect(Array.isArray(q.answers)).toBe(true);
      expect(q.answers.length).toBeGreaterThan(0);
    });

    it('should fetch questions without throwing error', async () => {
      const questions = await quizApiService.fetchQuestions({
        category: 'Docker',
        difficulty: 'Easy',
        limit: 3,
      });

      expect(questions.length).toBeGreaterThan(0);
      const q = questions[0];
      expect(q).toHaveProperty('question');
    });
  });

  describe('2. QuizAPI Endpoint Integration', () => {
    let generatedTestId: string;
    let questionsReceived: any[];

    it('should reject unauthenticated request to /api/quiz/generate', async () => {
      const res = await request(app)
        .post('/api/quiz/generate')
        .send({ category: 'Linux', limit: 5 });

      expect(res.status).toBe(401);
    });

    it('should generate a mock test via POST /api/quiz/generate', async () => {
      const res = await request(app)
        .post('/api/quiz/generate')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          category: 'Linux',
          difficulty: 'Medium',
          limit: 5,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('testSession');
      expect(res.body.testSession).toHaveProperty('testId');
      expect(Array.isArray(res.body.testSession.questions)).toBe(true);
      expect(res.body.testSession.questions.length).toBeGreaterThan(0);

      generatedTestId = res.body.testSession.testId;
      questionsReceived = res.body.testSession.questions;

      // Verify correct answers are not exposed in generated test payload
      for (const q of questionsReceived) {
        expect(q.correctAnswer).toBeUndefined();
        for (const a of q.answers) {
          expect(a.isCorrect).toBeUndefined();
        }
      }
    });

    it('should submit mock test answers via POST /api/quiz/submit and record results', async () => {
      const userAnswersMap: Record<string, string> = {};
      questionsReceived.forEach((q, idx) => {
        if (idx % 2 === 0 && q.answers.length > 0) {
          userAnswersMap[q.id] = q.answers[0].id;
        }
      });

      const res = await request(app)
        .post('/api/quiz/submit')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          testId: generatedTestId,
          userAnswers: userAnswersMap,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const report = res.body;
      expect(report).toHaveProperty('testId', generatedTestId);
      expect(report).toHaveProperty('totalQuestions', questionsReceived.length);
      expect(report).toHaveProperty('score');
      expect(report).toHaveProperty('accuracyPct');
      expect(report).toHaveProperty('category');
      expect(report).toHaveProperty('topicScores');
      expect(Array.isArray(report.questions)).toBe(true);

      // Verify answers are evaluated securely
      const evalFirst = report.questions[0];
      expect(evalFirst).toHaveProperty('question');
      expect(evalFirst).toHaveProperty('correctAnswer');
      expect(evalFirst).toHaveProperty('isCorrect');

      // Verify Prisma DB storage
      const dbTest = await prisma.quizMockTest.findUnique({
        where: { id: generatedTestId },
        include: { attempts: true },
      });

      expect(dbTest).not.toBeNull();
      expect(dbTest?.userId).toBe(testUserId);
      expect(dbTest?.attempts.length).toBe(questionsReceived.length);
    });

    it('should fetch user mock test history via GET /api/quiz/history', async () => {
      const res = await request(app)
        .get('/api/quiz/history')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.history)).toBe(true);
      expect(res.body.history.length).toBeGreaterThan(0);

      const historyItem = res.body.history[0];
      expect(historyItem).toHaveProperty('id', generatedTestId);
      expect(historyItem).toHaveProperty('category');
      expect(historyItem).toHaveProperty('score');
      expect(historyItem).toHaveProperty('accuracyPct');
    });

    it('should fetch available categories & resume skill recommendations via GET /api/quiz/categories', async () => {
      const res = await request(app)
        .get('/api/quiz/categories')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.allCategories)).toBe(true);
      expect(res.body.allCategories.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.recommendedTopics)).toBe(true);
    });
  });

  describe('3. Learning Hub Integration for Weak Mock Test Topics', () => {
    it('should feed weak mock test scores (<60% accuracy) into Learning Hub recommendations', async () => {
      // Seed a failed test with 20% accuracy
      await prisma.quizMockTest.create({
        data: {
          userId: testUserId,
          category: 'Docker',
          difficulty: 'Hard',
          totalQuestions: 10,
          correctAnswers: 2,
          incorrectAnswers: 8,
          unanswered: 0,
          score: 2,
          accuracyPct: 20,
          completed: true,
          attempts: {
            create: [
              {
                questionId: 'dock_1',
                questionText: 'What is a container image?',
                selectedAnswer: 'ans_wrong',
                correctAnswer: 'ans_right',
                isCorrect: false,
              },
            ],
          },
        },
      });

      const recommendation = await learningRecommendationService.getPersonalizedRecommendations(testUserId, []);
      expect(recommendation).toHaveProperty('missingSkills');
      expect(recommendation.missingSkills).toContain('docker');
    });
  });
});
