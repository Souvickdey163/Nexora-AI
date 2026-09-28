import { prisma } from '../config/database';
import { creditService } from './credit.service';
import { CREDIT_COSTS } from '../config/creditCosts';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';
import { aiClient } from './ai.client';
import { logger } from '../utils/logger';

const INITIAL_QUESTION_BANK = [
  // DSA
  {
    category: 'DSA',
    topic: 'Binary Search Trees',
    difficulty: 'INTERMEDIATE',
    questionText: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctOptionIndex: 1,
    explanation: 'A balanced BST divides search space by half at each node, giving logarithmic time complexity O(log N).',
  },
  {
    category: 'DSA',
    topic: 'Graph Algorithms',
    difficulty: 'INTERMEDIATE',
    questionText: 'Which algorithm is typically used to find the single-source shortest path in a weighted graph without negative edges?',
    options: ['Breadth-First Search (BFS)', 'Dijkstra Algorithm', 'Kruskal Algorithm', 'Floyd-Warshall Algorithm'],
    correctOptionIndex: 1,
    explanation: "Dijkstra's algorithm efficiently computes single-source shortest paths in graphs with non-negative edge weights.",
  },
  {
    category: 'DSA',
    topic: 'Sorting & Searching',
    difficulty: 'BEGINNER',
    questionText: 'Which sorting algorithm has a worst-case time complexity of O(N^2) but O(N log N) average-case time complexity?',
    options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting Sort'],
    correctOptionIndex: 1,
    explanation: 'Quick Sort has O(N^2) worst-case when bad pivot choices occur, but O(N log N) average performance.',
  },
  {
    category: 'DSA',
    topic: 'Dynamic Programming',
    difficulty: 'ADVANCED',
    questionText: 'In Dynamic Programming, what property must a problem possess for DP to be applicable?',
    options: ['Greedy Choice Property', 'Optimal Substructure and Overlapping Subproblems', 'Divide and Conquer without overlaps', 'Unweighted Edges'],
    correctOptionIndex: 1,
    explanation: 'DP applies to problems displaying optimal substructure (optimal solution contains optimal sub-solutions) and overlapping subproblems.',
  },

  // DBMS
  {
    category: 'DBMS',
    topic: 'ACID Transactions',
    difficulty: 'INTERMEDIATE',
    questionText: 'In ACID properties of database transactions, what does the "I" stand for?',
    options: ['Integrity', 'Isolation', 'Indexability', 'Immutability'],
    correctOptionIndex: 1,
    explanation: 'Isolation ensures that concurrent transactions execute independently without uncommitted interferences.',
  },
  {
    category: 'DBMS',
    topic: 'SQL Joins',
    difficulty: 'BEGINNER',
    questionText: 'Which SQL join returns all rows from the left table and matched rows from the right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correctOptionIndex: 1,
    explanation: 'LEFT JOIN returns all records from the left table regardless of matching records in the right table.',
  },
  {
    category: 'DBMS',
    topic: 'Indexing & Performance',
    difficulty: 'ADVANCED',
    questionText: 'Which data structure is most commonly used for database index files to minimize disk I/O operations?',
    options: ['Binary Search Tree', 'B+ Tree', 'Linked List', 'Min-Heap'],
    correctOptionIndex: 1,
    explanation: 'B+ Trees have high fan-out, storing data entries at leaf nodes, making disk block retrieval highly optimal.',
  },
  {
    category: 'DBMS',
    topic: 'Normalization',
    difficulty: 'INTERMEDIATE',
    questionText: 'A database table is in Third Normal Form (3NF) if it is in 2NF and has no:',
    options: ['Partial Dependencies', 'Transitive Dependencies', 'Multivalued Dependencies', 'Primary Keys'],
    correctOptionIndex: 1,
    explanation: '3NF requires that no non-prime attribute is transitively dependent on the primary key.',
  },

  // Operating Systems
  {
    category: 'Operating Systems',
    topic: 'Deadlocks',
    difficulty: 'INTERMEDIATE',
    questionText: 'What condition is NOT required for a deadlock to occur in an operating system?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctOptionIndex: 2,
    explanation: 'Deadlocks require No Preemption. If preemption is allowed, resources can be taken back, breaking deadlock.',
  },
  {
    category: 'Operating Systems',
    topic: 'Virtual Memory',
    difficulty: 'ADVANCED',
    questionText: 'What phenomenon occurs when excessive page faulting leads to the OS spending more time swapping pages than executing processes?',
    options: ['Paging Fault', 'Thrashing', 'Segmentation Fault', 'Fragmentation'],
    correctOptionIndex: 1,
    explanation: 'Thrashing occurs when memory is oversubscribed, causing continuous page swapping and near-zero CPU throughput.',
  },
  {
    category: 'Operating Systems',
    topic: 'CPU Scheduling',
    difficulty: 'BEGINNER',
    questionText: 'Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?',
    options: ['First-Come, First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Priority Scheduling'],
    correctOptionIndex: 1,
    explanation: 'SJF (Shortest Job First) is provably optimal for minimizing average waiting time.',
  },

  // Computer Networks
  {
    category: 'Computer Networks',
    topic: 'Transport Layer Protocols',
    difficulty: 'BEGINNER',
    questionText: 'Which transport layer protocol provides reliable, connection-oriented data transmission with flow control?',
    options: ['UDP', 'IP', 'TCP', 'ICMP'],
    correctOptionIndex: 2,
    explanation: 'TCP (Transmission Control Protocol) provides connection establishment, ordering, and retransmission reliability.',
  },
  {
    category: 'Computer Networks',
    topic: 'HTTP & Application Protocols',
    difficulty: 'INTERMEDIATE',
    questionText: 'In HTTP/2, what key enhancement resolved the Head-of-Line (HOL) blocking problem present at the HTTP layer in HTTP/1.1?',
    options: ['Binary Frames and Multiplexing over a single TCP Connection', 'UDP Socket Bindings', 'Gzip Compression', 'DNS Prefetching'],
    correctOptionIndex: 0,
    explanation: 'HTTP/2 multiplexes multiple requests/responses as binary frames concurrently over one connection.',
  },
  {
    category: 'Computer Networks',
    topic: 'Network Layer & IP',
    difficulty: 'INTERMEDIATE',
    questionText: 'What is the primary function of the Address Resolution Protocol (ARP)?',
    options: ['Translate domain names to IP addresses', 'Translate IPv4 addresses to MAC physical addresses', 'Route packets across autonomous systems', 'Assign dynamic IP addresses'],
    correctOptionIndex: 1,
    explanation: 'ARP maps an IP layer address to a physical Ethernet (MAC) address on a local area network.',
  },

  // System Design
  {
    category: 'System Design',
    topic: 'Caching Strategies',
    difficulty: 'INTERMEDIATE',
    questionText: 'What strategy is used to prevent the "Thundering Herd" cache stampede problem when a popular key expires?',
    options: ['Mutex Locking / Probabilistic Early Expiration', 'Increasing CPU cores', 'Truncating database logs', 'Disabling TLS'],
    correctOptionIndex: 0,
    explanation: 'Mutex locks or probabilistic early recomputation ensure only one worker recomputes an expired cache key.',
  },
  {
    category: 'System Design',
    topic: 'Scalability & Load Balancing',
    difficulty: 'ADVANCED',
    questionText: 'In distributed caching, why is Consistent Hashing preferred over traditional modulo hashing (hash(key) % N)?',
    options: ['It computes hashes faster', 'Adding or removing a node re-maps only 1/N keys on average', 'It encrypts cached data', 'It eliminates all cache misses'],
    correctOptionIndex: 1,
    explanation: 'Consistent hashing minimizes key redistribution to O(K/N) when scaling cluster nodes.',
  },
  {
    category: 'System Design',
    topic: 'CAP Theorem & Databases',
    difficulty: 'INTERMEDIATE',
    questionText: 'According to the CAP Theorem, when a network partition occurs in a distributed database system, what choice must be made?',
    options: ['Consistency vs Availability', 'Latency vs Throughput', 'Security vs Compression', 'ACID vs BASE'],
    correctOptionIndex: 0,
    explanation: 'During a network partition (P), a distributed system can either remain Consistent (C) by failing un-synced requests or Available (A) by serving stale data.',
  },
];

export class AssessmentService {
  /**
   * Seed question bank if empty or populate default topics.
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
   * Get supported categories and statistics.
   */
  async getCategories() {
    await this.ensureQuestionBank();
    const categories = [
      { id: 'DSA', name: 'DSA / Data Structures & Algorithms', display: 'Data Structures & Algorithms' },
      { id: 'DBMS', name: 'DBMS & SQL', display: 'Database Management Systems & SQL' },
      { id: 'OS', name: 'Operating Systems', display: 'Operating Systems & Concurrency' },
      { id: 'NETWORKS', name: 'Computer Networks', display: 'Computer Networks & HTTP/TCP' },
      { id: 'SYSTEM_DESIGN', name: 'System Design', display: 'Distributed Systems & Scalability' },
    ];

    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.assessmentQuestion.count({
          where: {
            OR: [
              { category: cat.id },
              { category: { contains: cat.id, mode: 'insensitive' } },
              { category: { contains: cat.name, mode: 'insensitive' } },
            ],
          },
        });
        return {
          id: cat.id,
          name: cat.name,
          displayName: cat.display,
          questionCount: count > 0 ? count : 10,
          difficulty: 'Beginner • Intermediate • Advanced',
        };
      })
    );

    return categoryStats;
  }

  /**
   * Normalize category input into standard category string.
   */
  private normalizeCategory(catInput: string): string {
    const upper = catInput.trim().toUpperCase();
    if (upper === 'DSA' || upper.includes('DATA STRUCTURE')) return 'DSA';
    if (upper === 'DBMS' || upper.includes('SQL') || upper.includes('DATABASE')) return 'DBMS';
    if (upper === 'OS' || upper.includes('OPERATING SYSTEM')) return 'OS';
    if (upper === 'NETWORKS' || upper.includes('NETWORK')) return 'NETWORKS';
    if (upper === 'SYSTEM_DESIGN' || upper.includes('SYSTEM DESIGN')) return 'SYSTEM_DESIGN';
    return catInput.trim();
  }

  /**
   * Normalize difficulty string.
   */
  private normalizeDifficulty(diffInput: string): string {
    const upper = diffInput.trim().toUpperCase();
    if (upper.startsWith('BEG')) return 'BEGINNER';
    if (upper.startsWith('ADV')) return 'ADVANCED';
    return 'INTERMEDIATE';
  }

  /**
   * Check if user has an active IN_PROGRESS assessment.
   */
  async getActiveSession(userId: string) {
    const active = await prisma.skillAssessmentAttempt.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
      orderBy: { startedAt: 'desc' },
    });

    if (!active) return null;

    // Check expiration
    if (active.expiresAt && new Date() > new Date(active.expiresAt)) {
      logger.info(`⏳ Assessment ${active.id} has expired. Auto-grading session...`);
      return this.evaluateAndCompleteAssessment(active.id, userId, true);
    }

    // Return safe session data (strip answer key!)
    const rawQuestions = (active.questionsData as any[]) || [];
    const safeQuestions = rawQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      topic: q.topic || 'General CS',
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options,
    }));

    return {
      assessmentId: active.id,
      category: active.category,
      difficulty: active.difficulty,
      status: active.status,
      startedAt: active.startedAt,
      expiresAt: active.expiresAt,
      totalQuestions: active.totalQuestions,
      answersData: active.answersData || [],
      questions: safeQuestions,
      integrityEvents: active.integrityEvents || [],
    };
  }

  /**
   * Start a brand new Assessment Session.
   * Atomic 2 credit deduction.
   * Server-backed lifecycle and timer.
   * Strips correctOptionIndex from browser payload!
   */
  async startAssessment(userId: string, rawCategory: string, rawDifficulty: string = 'INTERMEDIATE', questionCount: number = 10) {
    const category = this.normalizeCategory(rawCategory);
    const difficulty = this.normalizeDifficulty(rawDifficulty);

    // 1. Check if user already has an active session
    const existingActive = await this.getActiveSession(userId);
    if (existingActive && existingActive.status === 'IN_PROGRESS') {
      return existingActive;
    }

    // 2. Atomic Credit Deduction (2 credits)
    await creditService.deductCredits(
      userId,
      CREDIT_COSTS.SKILL_ASSESSMENT,
      'SKILL_ASSESSMENT',
      `Diagnostic Skill Assessment (${category})`
    );

    // 3. Find user previous topics to vary question set
    const pastAttempts = await prisma.skillAssessmentAttempt.findMany({
      where: { userId, category },
      take: 5,
      orderBy: { completedAt: 'desc' },
    });

    const previousTopics: string[] = [];
    pastAttempts.forEach((att) => {
      if (Array.isArray(att.weakAreas)) previousTopics.push(...att.weakAreas);
    });

    // 4. Generate dynamic AI MCQs
    let questionsList = await aiClient.generateAssessmentQuestions(category, difficulty, questionCount, previousTopics);

    // Fallback if AI generation unavailable
    if (!questionsList || questionsList.length < questionCount) {
      await this.ensureQuestionBank();
      const existing = await prisma.assessmentQuestion.findMany({
        where: {
          OR: [
            { category },
            { category: { contains: category, mode: 'insensitive' } },
          ],
        },
      });

      const pool = existing.length > 0 ? existing : await prisma.assessmentQuestion.findMany();
      let selected: any[] = [];
      if (pool.length > 0) {
        while (selected.length < questionCount) {
          const shuffled = [...pool].sort(() => 0.5 - Math.random());
          selected.push(...shuffled);
        }
        selected = selected.slice(0, questionCount);
        questionsList = selected.map((q, idx) => ({
          id: `db_q_${idx + 1}_${Date.now()}_${idx}`,
          category: q.category,
          topic: q.topic || 'General CS',
          difficulty: q.difficulty || difficulty,
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation || 'Question evaluation completed.',
        }));
      }
    }

    // Ensure questions list length & unique IDs
    const formattedQuestions = (questionsList || []).map((q: any, idx: number) => ({
      id: q.id || `q_${idx + 1}_${Date.now()}`,
      category: q.category || category,
      topic: q.topic || 'General CS',
      difficulty: q.difficulty || difficulty,
      questionText: q.questionText,
      options: q.options,
      correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
      explanation: q.explanation || 'Option evaluation completed.',
    }));

    const durationMinutes = 15;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    // 5. Create Assessment Session Record in PostgreSQL
    const session = await prisma.skillAssessmentAttempt.create({
      data: {
        userId,
        category,
        difficulty,
        status: 'IN_PROGRESS',
        totalQuestions: formattedQuestions.length,
        startedAt,
        expiresAt,
        questionsData: formattedQuestions,
        answersData: [],
        integrityEvents: [],
      },
    });

    // Log Activity
    await activityService.logActivity(
      userId,
      'ASSESSMENT_STARTED',
      `Started ${category} Assessment (${difficulty})`,
      { assessmentId: session.id, category, difficulty }
    );

    // 6. Return response to browser (SAFE: NO correctOptionIndex!)
    const safeQuestions = formattedQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options,
    }));

    return {
      assessmentId: session.id,
      category: session.category,
      difficulty: session.difficulty,
      status: session.status,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      totalQuestions: safeQuestions.length,
      timeLimitMinutes: durationMinutes,
      answersData: [],
      questions: safeQuestions,
    };
  }

  /**
   * Save / Upsert answer for active session (prevents answer loss on refresh).
   */
  async saveAnswer(
    userId: string,
    assessmentId: string,
    questionId: string,
    selectedOptionIndex: number,
    timeSpentSeconds: number = 0
  ) {
    const session = await prisma.skillAssessmentAttempt.findUnique({
      where: { id: assessmentId },
    });

    if (!session || session.userId !== userId) {
      throw new Error('Assessment session not found or unauthorized.');
    }

    if (session.status !== 'IN_PROGRESS') {
      throw new Error(`Assessment is already ${session.status.toLowerCase()}.`);
    }

    // Check expiration
    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
      await this.evaluateAndCompleteAssessment(assessmentId, userId, true);
      throw new Error('Assessment session has expired and has been auto-submitted.');
    }

    const currentAnswers = (session.answersData as any[]) || [];
    const existingIndex = currentAnswers.findIndex((a) => a.questionId === questionId);

    const updatedAnswer = {
      questionId,
      selectedOptionIndex,
      answeredAt: new Date().toISOString(),
      timeSpentSeconds: Math.max(0, timeSpentSeconds),
    };

    if (existingIndex >= 0) {
      currentAnswers[existingIndex] = updatedAnswer;
    } else {
      currentAnswers.push(updatedAnswer);
    }

    await prisma.skillAssessmentAttempt.update({
      where: { id: assessmentId },
      data: {
        answersData: currentAnswers,
      },
    });

    return { success: true, answeredCount: currentAnswers.length };
  }

  /**
   * Log anti-cheating browser integrity event.
   */
  async logIntegrityEvent(userId: string, assessmentId: string, eventType: string, details?: string) {
    const session = await prisma.skillAssessmentAttempt.findUnique({
      where: { id: assessmentId },
    });

    if (!session || session.userId !== userId) return { success: false };

    const currentEvents = (session.integrityEvents as any[]) || [];
    currentEvents.push({
      eventType,
      timestamp: new Date().toISOString(),
      details: details || `Event ${eventType} recorded`,
    });

    await prisma.skillAssessmentAttempt.update({
      where: { id: assessmentId },
      data: { integrityEvents: currentEvents },
    });

    return { success: true, eventCount: currentEvents.length };
  }

  /**
   * Submit and evaluate assessment.
   * Server-side grading, domain/topic matrix, difficulty & timing analysis, AI natural language report.
   */
  async submitAssessment(userId: string, assessmentId: string, finalAnswersOverride?: Array<{ questionId: string; selectedOptionIndex: number; timeSpentSeconds?: number }>) {
    return this.evaluateAndCompleteAssessment(assessmentId, userId, false, finalAnswersOverride);
  }

  /**
   * Internal evaluation engine.
   */
  private async evaluateAndCompleteAssessment(
    assessmentId: string,
    userId: string,
    isExpired: boolean = false,
    finalAnswersOverride?: Array<{ questionId: string; selectedOptionIndex: number; timeSpentSeconds?: number }>
  ) {
    const session = await prisma.skillAssessmentAttempt.findUnique({
      where: { id: assessmentId },
    });

    if (!session || session.userId !== userId) {
      throw new Error('Assessment session not found or unauthorized.');
    }

    if (session.status === 'COMPLETED' || session.status === 'EXPIRED') {
      return this.getAssessmentResult(assessmentId, userId);
    }

    const questions = (session.questionsData as any[]) || [];
    let storedAnswers = (session.answersData as any[]) || [];

    // Apply any overrides sent at submit time
    if (finalAnswersOverride && Array.isArray(finalAnswersOverride)) {
      finalAnswersOverride.forEach((override) => {
        const idx = storedAnswers.findIndex((a) => a.questionId === override.questionId);
        const item = {
          questionId: override.questionId,
          selectedOptionIndex: override.selectedOptionIndex,
          answeredAt: new Date().toISOString(),
          timeSpentSeconds: override.timeSpentSeconds || 0,
        };
        if (idx >= 0) storedAnswers[idx] = item;
        else storedAnswers.push(item);
      });
    }

    const answersMap = new Map<string, { selectedOptionIndex: number; timeSpentSeconds: number }>();
    storedAnswers.forEach((ans) => {
      answersMap.set(ans.questionId, {
        selectedOptionIndex: ans.selectedOptionIndex,
        timeSpentSeconds: ans.timeSpentSeconds || 0,
      });
    });

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unansweredCount = 0;
    let totalTimeTaken = 0;
    const timePerQuestion: number[] = [];

    const questionDetails: any[] = [];
    const topicStats: Record<string, { total: number; correct: number }> = {};
    const difficultyStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const topicName = q.topic || 'General CS';
      const diffName = (q.difficulty || session.difficulty || 'INTERMEDIATE').toUpperCase();

      if (!topicStats[topicName]) topicStats[topicName] = { total: 0, correct: 0 };
      topicStats[topicName].total += 1;

      if (!difficultyStats[diffName]) difficultyStats[diffName] = { total: 0, correct: 0 };
      difficultyStats[diffName].total += 1;

      const userAns = answersMap.get(q.id);
      if (userAns !== undefined && userAns.selectedOptionIndex >= 0) {
        const isCorrect = userAns.selectedOptionIndex === q.correctOptionIndex;
        if (isCorrect) {
          correctAnswers += 1;
          topicStats[topicName].correct += 1;
          difficultyStats[diffName].correct += 1;
        } else {
          incorrectAnswers += 1;
        }
        totalTimeTaken += userAns.timeSpentSeconds;
        timePerQuestion.push(userAns.timeSpentSeconds);

        questionDetails.push({
          questionId: q.id,
          questionText: q.questionText,
          options: q.options,
          topic: topicName,
          difficulty: diffName,
          selectedOptionIndex: userAns.selectedOptionIndex,
          correctOptionIndex: q.correctOptionIndex,
          isCorrect,
          explanation: q.explanation,
          timeSpentSeconds: userAns.timeSpentSeconds,
        });
      } else {
        unansweredCount += 1;
        questionDetails.push({
          questionId: q.id,
          questionText: q.questionText,
          options: q.options,
          topic: topicName,
          difficulty: diffName,
          selectedOptionIndex: -1,
          correctOptionIndex: q.correctOptionIndex,
          isCorrect: false,
          explanation: q.explanation,
          timeSpentSeconds: 0,
        });
      }
    });

    const totalQuestions = questions.length || 10;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const answeredCount = correctAnswers + incorrectAnswers;
    const accuracyPct = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;
    const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeTaken / totalQuestions) : 0;

    // Strengths and Weaknesses derived from topic stats
    const strengths: string[] = [];
    const weakAreas: string[] = [];
    const topicAnalysis: Record<string, { total: number; correct: number; accuracyPct: number; status: string }> = {};

    Object.entries(topicStats).forEach(([tName, stat]) => {
      const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      let status = 'NEEDS_IMPROVEMENT';
      if (acc >= 75) {
        status = 'STRONG';
        strengths.push(tName);
      } else {
        weakAreas.push(tName);
      }
      topicAnalysis[tName] = {
        total: stat.total,
        correct: stat.correct,
        accuracyPct: acc,
        status,
      };
    });

    // Difficulty Analysis
    const difficultyAnalysis: Record<string, { total: number; correct: number; accuracyPct: number }> = {};
    Object.entries(difficultyStats).forEach(([dName, stat]) => {
      difficultyAnalysis[dName] = {
        total: stat.total,
        correct: stat.correct,
        accuracyPct: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
      };
    });

    // Timing Analysis
    const timingAnalysis = {
      totalTimeTakenSeconds: totalTimeTaken,
      avgTimePerQuestionSeconds: avgTimePerQuestion,
      fastestQuestionSeconds: timePerQuestion.length > 0 ? Math.min(...timePerQuestion) : 0,
      slowestQuestionSeconds: timePerQuestion.length > 0 ? Math.max(...timePerQuestion) : 0,
    };

    // Domain Proficiency Map
    const domainScores: Record<string, number> = {
      [session.category]: score,
    };

    // Construct recommendations
    const recommendations = weakAreas.map((area) => `Review core ${area} principles and solve 5 practice questions.`);
    if (recommendations.length === 0) {
      recommendations.push(`Outstanding mastery! Proceed to Advanced ${session.category} topics.`);
    }

    // AI Natural Language Explanation (Gemini)
    const aiReport = await aiClient.explainAssessmentResult({
      category: session.category,
      difficulty: session.difficulty,
      score,
      correctCount: correctAnswers,
      totalQuestions,
      strengths,
      weaknesses: weakAreas,
      topicAnalysis,
      timingAnalysis,
    });

    const finalStatus = isExpired ? 'EXPIRED' : 'COMPLETED';
    const completedAt = new Date();

    // Update session record
    const updated = await prisma.skillAssessmentAttempt.update({
      where: { id: assessmentId },
      data: {
        status: finalStatus,
        score,
        correctAnswers,
        incorrectAnswers,
        unansweredCount,
        accuracyPct,
        timeTakenSeconds: totalTimeTaken,
        avgTimePerQuestion,
        weakAreas,
        recommendations,
        domainScores,
        topicAnalysis,
        difficultyAnalysis,
        timingAnalysis,
        aiReport,
        questionDetails,
        completedAt,
      },
    });

    // Log Activity & Notification
    await activityService.logActivity(
      userId,
      'ASSESSMENT_COMPLETED',
      `Completed ${session.category} Diagnostic Assessment (${score}%)`,
      { attemptId: updated.id, category: session.category, score }
    );

    await notificationService.createNotification(
      userId,
      'Assessment Result Available',
      `Scored ${score}% in ${session.category} (${correctAnswers}/${totalQuestions} correct).`,
      'ASSESSMENT',
      '/features/assessment'
    );

    return this.getAssessmentResult(assessmentId, userId);
  }

  /**
   * Get complete result for completed/expired assessment.
   */
  async getAssessmentResult(assessmentId: string, userId: string) {
    const attempt = await prisma.skillAssessmentAttempt.findUnique({
      where: { id: assessmentId },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error('Assessment result not found or unauthorized.');
    }

    // Historical comparison with user's previous attempts in this category
    const previousAttempts = await prisma.skillAssessmentAttempt.findMany({
      where: {
        userId,
        category: attempt.category,
        status: { in: ['COMPLETED', 'EXPIRED'] },
        id: { not: attempt.id },
      },
      orderBy: { completedAt: 'asc' },
      select: { id: true, score: true, completedAt: true, difficulty: true },
    });

    const categoryTrend = [
      ...previousAttempts.map((p, i) => ({ attemptNumber: i + 1, score: p.score, date: p.completedAt })),
      { attemptNumber: previousAttempts.length + 1, score: attempt.score, date: attempt.completedAt },
    ];

    return {
      id: attempt.id,
      category: attempt.category,
      difficulty: attempt.difficulty,
      status: attempt.status,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      unansweredCount: attempt.unansweredCount,
      accuracyPct: attempt.accuracyPct,
      timeTakenSeconds: attempt.timeTakenSeconds,
      avgTimePerQuestion: attempt.avgTimePerQuestion,
      weakAreas: attempt.weakAreas,
      recommendations: attempt.recommendations,
      domainScores: attempt.domainScores || { [attempt.category]: attempt.score },
      topicAnalysis: attempt.topicAnalysis || {},
      difficultyAnalysis: attempt.difficultyAnalysis || {},
      timingAnalysis: attempt.timingAnalysis || {},
      aiReport: attempt.aiReport || {},
      questionDetails: attempt.questionDetails || [],
      integrityEvents: attempt.integrityEvents || [],
      categoryTrend,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
    };
  }

  /**
   * Get user assessment attempts history.
   */
  async getHistory(userId: string) {
    return prisma.skillAssessmentAttempt.findMany({
      where: {
        userId,
        status: { in: ['COMPLETED', 'EXPIRED', 'SUBMITTED'] },
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });
  }

  /**
   * Get historical performance analytics & trend across domains.
   */
  async getAnalytics(userId: string) {
    const attempts = await prisma.skillAssessmentAttempt.findMany({
      where: {
        userId,
        status: { in: ['COMPLETED', 'EXPIRED'] },
      },
      orderBy: { completedAt: 'asc' },
    });

    if (attempts.length === 0) {
      return {
        totalAssessments: 0,
        averageScore: 0,
        bestCategory: 'N/A',
        domainProficiency: {},
        categoryTrends: {},
      };
    }

    const domainTotals: Record<string, { totalScore: number; count: number; best: number }> = {};
    const categoryTrends: Record<string, Array<{ attemptNumber: number; score: number; date: Date | null }>> = {};

    let totalScoreSum = 0;

    attempts.forEach((att) => {
      totalScoreSum += att.score;
      const cat = att.category;

      if (!domainTotals[cat]) domainTotals[cat] = { totalScore: 0, count: 0, best: 0 };
      domainTotals[cat].totalScore += att.score;
      domainTotals[cat].count += 1;
      domainTotals[cat].best = Math.max(domainTotals[cat].best, att.score);

      if (!categoryTrends[cat]) categoryTrends[cat] = [];
      categoryTrends[cat].push({
        attemptNumber: categoryTrends[cat].length + 1,
        score: att.score,
        date: att.completedAt,
      });
    });

    const domainProficiency: Record<string, number> = {};
    let bestCatName = 'N/A';
    let bestCatAvg = -1;

    Object.entries(domainTotals).forEach(([cat, data]) => {
      const avg = Math.round(data.totalScore / data.count);
      domainProficiency[cat] = avg;
      if (avg > bestCatAvg) {
        bestCatAvg = avg;
        bestCatName = cat;
      }
    });

    return {
      totalAssessments: attempts.length,
      averageScore: Math.round(totalScoreSum / attempts.length),
      bestCategory: bestCatName,
      domainProficiency,
      categoryTrends,
    };
  }
}

export const assessmentService = new AssessmentService();
