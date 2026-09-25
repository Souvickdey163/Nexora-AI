import { prisma } from '../config/database';
import { creditService } from './credit.service';
import { CREDIT_COSTS } from '../config/creditCosts';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const INITIAL_QUESTION_BANK = [
  // DSA
  {
    category: 'DSA',
    difficulty: 'MEDIUM',
    questionText: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctOptionIndex: 1,
    explanation: 'A balanced BST divides search space by half at each node, giving logarithmic time complexity O(log N).',
  },
  {
    category: 'DSA',
    difficulty: 'MEDIUM',
    questionText: 'Which algorithm is typically used to find the shortest path in a weighted graph without negative edges?',
    options: ['Breadth-First Search (BFS)', 'Dijkstra Algorithm', 'Kruskal Algorithm', 'Floyd-Warshall Algorithm'],
    correctOptionIndex: 1,
    explanation: "Dijkstra's algorithm efficiently computes single-source shortest paths in graphs with non-negative edge weights.",
  },
  // DBMS
  {
    category: 'DBMS',
    difficulty: 'MEDIUM',
    questionText: 'In ACID properties of database transactions, what does the "I" stand for?',
    options: ['Integrity', 'Isolation', 'Indexability', 'Immutability'],
    correctOptionIndex: 1,
    explanation: 'Isolation ensures that concurrent transactions execute without interfering with each other.',
  },
  {
    category: 'DBMS',
    difficulty: 'MEDIUM',
    questionText: 'Which SQL join returns all rows from the left table and matched rows from the right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correctOptionIndex: 1,
    explanation: 'LEFT JOIN returns all records from the left table even if there are no matches in the right table.',
  },
  // Computer Networks
  {
    category: 'Computer Networks',
    difficulty: 'MEDIUM',
    questionText: 'Which transport layer protocol provides reliable, connection-oriented data transmission with flow control?',
    options: ['UDP', 'IP', 'TCP', 'ICMP'],
    correctOptionIndex: 2,
    explanation: 'TCP (Transmission Control Protocol) is connection-oriented, guarantees packet delivery and order.',
  },
  // Operating Systems
  {
    category: 'Operating Systems',
    difficulty: 'MEDIUM',
    questionText: 'What condition is NOT required for a deadlock to occur in an operating system?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctOptionIndex: 2,
    explanation: 'Deadlock requires NO preemption. Allowing preemption prevents deadlocks.',
  },
  // OOP
  {
    category: 'OOP',
    difficulty: 'MEDIUM',
    questionText: 'Which object-oriented principle allows a subclass to provide a specific implementation of a method declared in its parent class?',
    options: ['Encapsulation', 'Polymorphism / Method Overriding', 'Abstraction', 'Composition'],
    correctOptionIndex: 1,
    explanation: 'Method overriding is a key mechanism of runtime polymorphism in OOP.',
  },
  // Web Development
  {
    category: 'Web Development',
    difficulty: 'MEDIUM',
    questionText: 'In HTTP, what status code represents "401"?',
    options: ['Forbidden', 'Unauthorized', 'Not Found', 'Internal Server Error'],
    correctOptionIndex: 1,
    explanation: '401 Unauthorized indicates that the request requires valid authentication credentials.',
  },
  // System Design
  {
    category: 'System Design',
    difficulty: 'MEDIUM',
    questionText: 'What strategy is used to prevent the "Thundering Herd" cache stampede problem?',
    options: ['Mutex Locking / Probabilistic Early Expiration', 'Increasing CPU cores', 'Truncating logs', 'Disabling SSL'],
    correctOptionIndex: 0,
    explanation: 'Mutex locks or probabilistic early recomputation ensure only one worker re-populates expired cache entries.',
  },
  // Programming
  {
    category: 'Programming',
    difficulty: 'MEDIUM',
    questionText: 'In JavaScript / TypeScript, what is the value of typeof null?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctOptionIndex: 2,
    explanation: 'In JS, typeof null returns "object" due to a historical legacy implementation detail.',
  },
];

export class AssessmentService {
  /**
   * Seed question bank if empty.
   */
  async ensureQuestionBank() {
    const count = await prisma.assessmentQuestion.count();
    if (count === 0) {
      for (const q of INITIAL_QUESTION_BANK) {
        await prisma.assessmentQuestion.create({ data: q });
      }
    }
  }

  /**
   * Get supported categories and question statistics.
   */
  async getCategories() {
    await this.ensureQuestionBank();
    const categories = [
      'DSA',
      'Programming',
      'DBMS',
      'Computer Networks',
      'Operating Systems',
      'OOP',
      'Web Development',
      'System Design',
    ];

    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.assessmentQuestion.count({
          where: { category: cat },
        });
        return {
          name: cat,
          questionCount: count || 10,
          difficulty: 'Beginner to Advanced',
        };
      })
    );

    return categoryStats;
  }

  /**
   * Start a new assessment session.
   * Deducts 2 credits atomically.
   * NEVER exposes correct answer keys!
   */
  async startAssessment(userId: string, category: string, difficulty = 'MEDIUM') {
    // 1. Atomic Credit Deduction (2 credits)
    await creditService.deductCredits(
      userId,
      CREDIT_COSTS.SKILL_ASSESSMENT,
      'SKILL_ASSESSMENT',
      `Skill Assessment (${category})`
    );

    // 2. Try to generate brand new dynamic MCQs via Gemini API
    let freshQuestions = await this.generateDynamicMCQsWithAI(category, difficulty, 5);

    if (!freshQuestions || freshQuestions.length === 0) {
      await this.ensureQuestionBank();
      const existing = await prisma.assessmentQuestion.findMany({
        where: { category },
      });
      const pool = existing.length > 0 ? existing : await prisma.assessmentQuestion.findMany();
      // Shuffle pool to return random order each session
      freshQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    // 3. Strip correctOptionIndex to prevent answer leakage
    const safeQuestions = freshQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options,
    }));

    return {
      category,
      difficulty,
      totalQuestions: safeQuestions.length,
      timeLimitMinutes: 15,
      questions: safeQuestions,
    };
  }

  /**
   * Submit and evaluate assessment.
   */
  async submitAssessment(
    userId: string,
    category: string,
    difficulty: string,
    userAnswers: Array<{ questionId: string; selectedOptionIndex: number }>,
    timeTakenSeconds = 300
  ) {
    await this.ensureQuestionBank();

    let correctAnswers = 0;
    const questionDetails: any[] = [];
    const weakAreasSet = new Set<string>();

    for (const ans of userAnswers) {
      const q = await prisma.assessmentQuestion.findUnique({
        where: { id: ans.questionId },
      });

      if (q) {
        const isCorrect = q.correctOptionIndex === ans.selectedOptionIndex;
        if (isCorrect) {
          correctAnswers += 1;
        } else {
          weakAreasSet.add(q.category);
        }

        questionDetails.push({
          questionId: q.id,
          questionText: q.questionText,
          selectedOptionIndex: ans.selectedOptionIndex,
          correctOptionIndex: q.correctOptionIndex,
          isCorrect,
          explanation: q.explanation,
        });
      }
    }

    const totalQuestions = userAnswers.length || 10;
    const accuracyPct = Math.round((correctAnswers / totalQuestions) * 100);
    const score = accuracyPct;

    const weakAreas = Array.from(weakAreasSet);
    const recommendations = weakAreas.map(
      (area) => `Review core ${area} topics and practice 10 related problems.`
    );
    if (recommendations.length === 0) {
      recommendations.push(`Excellent performance! Proceed to Advanced ${category} topics.`);
    }

    // Persist attempt in PostgreSQL
    const attempt = await prisma.skillAssessmentAttempt.create({
      data: {
        userId,
        category,
        difficulty,
        score,
        totalQuestions,
        correctAnswers,
        accuracyPct,
        timeTakenSeconds,
        weakAreas,
        recommendations,
        questionDetails,
      },
    });

    // Log Activity & Create Notification
    await activityService.logActivity(
      userId,
      'ASSESSMENT_COMPLETED',
      `Completed ${category} Assessment (${score}%)`,
      { attemptId: attempt.id, category, score }
    );

    await notificationService.createNotification(
      userId,
      'Assessment Evaluation',
      `Scored ${score}% in ${category} Assessment (${correctAnswers}/${totalQuestions} correct).`,
      'ASSESSMENT',
      '/features/assessment'
    );

    return attempt;
  }

  /**
   * Get user assessment attempts history.
   */
  async getHistory(userId: string) {
    return prisma.skillAssessmentAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });
  }

  private async generateDynamicMCQsWithAI(category: string, difficulty: string, count: number = 5) {
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const prompt = `Generate ${count} brand new, unique multiple-choice questions (MCQs) for candidate diagnostic assessment.
Category: "${category}"
Difficulty: "${difficulty}"

Return a valid JSON array ONLY (no markdown code blocks, no plain text) of objects with this exact schema:
[
  {
    "category": "${category}",
    "difficulty": "${difficulty}",
    "questionText": "Clear, precise technical question statement...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 1,
    "explanation": "Brief explanation of why Option B is correct..."
  }
]`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
        }),
      });

      if (response.ok) {
        const resJson = (await response.json()) as any;
        const jsonText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const createdQuestions = [];
            for (const q of parsed) {
              if (q.questionText && Array.isArray(q.options) && q.options.length === 4) {
                const created = await prisma.assessmentQuestion.create({
                  data: {
                    category: q.category || category,
                    difficulty: q.difficulty || difficulty,
                    questionText: q.questionText,
                    options: q.options,
                    correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
                    explanation: q.explanation || 'Option evaluation completed.',
                  },
                });
                createdQuestions.push(created);
              }
            }
            if (createdQuestions.length > 0) {
              logger.info(`✅ Generated ${createdQuestions.length} fresh dynamic MCQs via Gemini API for ${category}`);
              return createdQuestions;
            }
          }
        }
      }
    } catch (err: any) {
      logger.warn(`⚠️ Failed to generate dynamic MCQs with Gemini: ${err.message}`);
    }

    return null;
  }
}

export const assessmentService = new AssessmentService();
