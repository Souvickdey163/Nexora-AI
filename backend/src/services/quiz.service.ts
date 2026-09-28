import { prisma } from '../config/database';
import { quizApiService } from './quizapi.service';
import {
  NormalizedQuizQuestion,
  QuizGenerateRequest,
  QuizMockTestSummary,
  QuizSubmitRequest,
} from '../types/quiz.types';

export class QuizService {
  /**
   * Generates a new MCQ mock test via QuizAPI and stores it in PostgreSQL
   */
  async generateMockTest(userId: string, params: QuizGenerateRequest) {
    const category = params.category || 'DevOps';
    const difficulty = params.difficulty || 'Medium';
    const limit = Math.min(20, Math.max(5, params.limit || 10));

    // Map requested subject to QuizAPI tags/category if applicable
    const tags: string[] = [];
    if (category.toLowerCase() === 'docker') tags.push('docker');
    if (category.toLowerCase() === 'kubernetes') tags.push('kubernetes');
    if (category.toLowerCase() === 'javascript') tags.push('javascript');
    if (category.toLowerCase() === 'python') tags.push('python');
    if (category.toLowerCase() === 'sql') tags.push('sql');
    if (category.toLowerCase() === 'react') tags.push('react');
    if (category.toLowerCase() === 'linux') tags.push('linux');

    const questions = await quizApiService.fetchQuestions({
      category,
      difficulty,
      limit,
      tags: tags.length > 0 ? tags : undefined,
    });

    // Create QuizMockTest record in PostgreSQL
    const mockTest = await prisma.quizMockTest.create({
      data: {
        userId,
        category,
        difficulty,
        totalQuestions: questions.length,
        questionsData: questions as any,
        completed: false,
      },
    });

    // Prepare client-safe question list (strip correctAnswer & explanation to prevent cheating)
    const clientQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      description: q.description,
      difficulty: q.difficulty,
      category: q.category,
      answers: q.answers,
    }));

    return {
      testId: mockTest.id,
      category: mockTest.category,
      difficulty: mockTest.difficulty,
      totalQuestions: mockTest.totalQuestions,
      createdAt: mockTest.createdAt,
      questions: clientQuestions,
    };
  }

  /**
   * Submits user answers, calculates score, accuracy, topic breakdown, and persists attempt
   */
  async submitMockTest(userId: string, request: QuizSubmitRequest) {
    const mockTest = await prisma.quizMockTest.findUnique({
      where: { id: request.testId },
    });

    if (!mockTest || mockTest.userId !== userId) {
      throw new Error('Mock test session not found or unauthorized');
    }

    const storedQuestions: NormalizedQuizQuestion[] = (mockTest.questionsData as any) || [];
    const userAnswers = request.userAnswers || {};

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    const topicStats: Record<string, { total: number; correct: number }> = {};
    const questionEvaluations: any[] = [];

    for (const q of storedQuestions) {
      const selected = userAnswers[q.id] || null;
      const topic = q.category || mockTest.category;

      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0 };
      }
      topicStats[topic].total += 1;

      let isCorrect = false;

      if (!selected) {
        unanswered += 1;
      } else {
        // Compare selected option ID or text against correct answer ID
        const matchedOption = q.answers.find(
          (a) => a.id === selected || a.text.trim().toLowerCase() === selected.trim().toLowerCase()
        );

        if (matchedOption && matchedOption.id === q.correctAnswer) {
          isCorrect = true;
          correctAnswers += 1;
          topicStats[topic].correct += 1;
        } else {
          incorrectAnswers += 1;
        }
      }

      // Create QuizMockTestAttempt record
      await prisma.quizMockTestAttempt.create({
        data: {
          mockTestId: mockTest.id,
          questionId: q.id,
          questionText: q.question,
          selectedAnswer: selected,
          correctAnswer: q.correctAnswer || 'opt-a',
          isCorrect,
          explanation: q.explanation || null,
        },
      });

      questionEvaluations.push({
        id: q.id,
        question: q.question,
        answers: q.answers,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    }

    const score = correctAnswers;
    const accuracyPct =
      storedQuestions.length > 0 ? Math.round((correctAnswers / storedQuestions.length) * 100) : 0;

    // Format topic scores
    const topicScores: Record<string, number> = {};
    Object.entries(topicStats).forEach(([t, stat]) => {
      topicScores[t] = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    });

    // Update completed test record in PostgreSQL
    const updatedTest = await prisma.quizMockTest.update({
      where: { id: mockTest.id },
      data: {
        completed: true,
        completedAt: new Date(),
        correctAnswers,
        incorrectAnswers,
        unanswered,
        score,
        accuracyPct,
        answersData: userAnswers as any,
        topicScores: topicScores as any,
      },
    });

    // Log to UserActivity
    await prisma.userActivity.create({
      data: {
        userId,
        actionType: 'MOCK_TEST_COMPLETED',
        title: `Completed ${mockTest.category} MCQ Mock Test`,
        metadata: {
          category: mockTest.category,
          score,
          totalQuestions: mockTest.totalQuestions,
          accuracyPct,
        },
      },
    }).catch(() => {});

    return {
      success: true,
      testId: updatedTest.id,
      category: updatedTest.category,
      difficulty: updatedTest.difficulty,
      totalQuestions: updatedTest.totalQuestions,
      correctAnswers: updatedTest.correctAnswers,
      incorrectAnswers: updatedTest.incorrectAnswers,
      unanswered: updatedTest.unanswered,
      score: updatedTest.score,
      accuracyPct: updatedTest.accuracyPct,
      topicScores,
      questions: questionEvaluations,
      completedAt: updatedTest.completedAt || new Date(),
    };
  }

  /**
   * Retrieves past completed mock test attempts for the user
   */
  async getMockTestHistory(userId: string): Promise<QuizMockTestSummary[]> {
    const history = await prisma.quizMockTest.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });

    return history.map((t) => ({
      id: t.id,
      category: t.category,
      difficulty: t.difficulty,
      totalQuestions: t.totalQuestions,
      correctAnswers: t.correctAnswers,
      incorrectAnswers: t.incorrectAnswers,
      unanswered: t.unanswered,
      score: t.score,
      accuracyPct: t.accuracyPct,
      completedAt: t.completedAt || t.createdAt,
    }));
  }

  /**
   * Recommends relevant subjects based on user's resume & extracted skills
   */
  async getRecommendedTopics(userId: string) {
    const [profile, latestAnalysis] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.resumeAnalysis.findFirst({
        where: { resumeVersion: { resume: { userId } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const userSkillsSet = new Set<string>();
    if (profile?.skills) {
      profile.skills.forEach((s) => userSkillsSet.add(s.toLowerCase()));
    }
    if (latestAnalysis?.extractedData && typeof latestAnalysis.extractedData === 'object') {
      const data: any = latestAnalysis.extractedData;
      if (Array.isArray(data.skills)) {
        data.skills.forEach((s: any) => {
          if (typeof s === 'string') userSkillsSet.add(s.toLowerCase());
          else if (s?.name) userSkillsSet.add(s.name.toLowerCase());
        });
      }
    }

    const availableCategories = [
      'Linux',
      'DevOps',
      'Docker',
      'Kubernetes',
      'SQL',
      'JavaScript',
      'Python',
      'PHP',
      'HTML',
      'CSS',
      'React',
      'Node.js',
      'Networking',
      'Security',
    ];

    const recommended: string[] = [];

    availableCategories.forEach((cat) => {
      if (Array.from(userSkillsSet).some((s) => s.includes(cat.toLowerCase()) || cat.toLowerCase().includes(s))) {
        recommended.push(cat);
      }
    });

    return {
      allCategories: availableCategories,
      recommendedTopics: recommended.length > 0 ? recommended : ['JavaScript', 'Docker', 'SQL', 'Linux'],
      userSkills: Array.from(userSkillsSet),
    };
  }
}

export const quizService = new QuizService();
