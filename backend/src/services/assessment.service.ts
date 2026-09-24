import { prisma } from '../config/database';
import { creditService } from './credit.service';
import { CREDIT_COSTS } from '../config/creditCosts';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';

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

    await this.ensureQuestionBank();

    // 2. Fetch questions for selected category
    let questions = await prisma.assessmentQuestion.findMany({
      where: { category },
      take: 10,
    });

    if (questions.length === 0) {
      // Fallback: fetch any available questions
      questions = await prisma.assessmentQuestion.findMany({ take: 10 });
    }

    // 3. Strip correctOptionIndex to prevent answer leakage
    const safeQuestions = questions.map((q) => ({
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
}

export const assessmentService = new AssessmentService();
