import { prisma } from '../config/database';

const INITIAL_LEARNING_TOPICS = [
  {
    slug: 'typescript-deep-dive',
    title: 'TypeScript & ES6+ Advanced Handbook',
    category: 'Frontend',
    difficulty: 'Intermediate',
    estimatedMinutes: 45,
    description: 'Master generics, utility types, conditional types, and async execution in modern JavaScript.',
    resources: [
      { title: 'TypeScript Official Documentation', url: 'https://www.typescriptlang.org/docs/', type: 'Documentation', isFree: true },
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'Guide', isFree: true },
    ],
  },
  {
    slug: 'dsa-sliding-window',
    title: 'Sliding Window & Two Pointer Algorithmic Patterns',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    estimatedMinutes: 60,
    description: 'Learn step-by-step implementations for fixed & variable length sliding window problems.',
    resources: [
      { title: 'NeetCode 150 Roadmap', url: 'https://neetcode.io/roadmap', type: 'Interactive Practice', isFree: true },
      { title: 'GeeksforGeeks Window Sliding Technique', url: 'https://www.geeksforgeeks.org/window-sliding-technique/', type: 'Tutorial', isFree: true },
    ],
  },
  {
    slug: 'postgresql-indexing',
    title: 'PostgreSQL Indexing & Query Execution Performance',
    category: 'Databases',
    difficulty: 'Advanced',
    estimatedMinutes: 50,
    description: 'Understand B-Tree indexes, EXPLAIN ANALYZE execution plans, and JOIN optimization.',
    resources: [
      { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/current/indexes.html', type: 'Documentation', isFree: true },
      { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/', type: 'E-Book / Guide', isFree: true },
    ],
  },
  {
    slug: 'system-design-fundamentals',
    title: 'System Design Fundamentals: Caching & Load Balancing',
    category: 'Systems',
    difficulty: 'Advanced',
    estimatedMinutes: 90,
    description: 'Learn horizontal scaling, CDN distribution, Redis caching patterns, and reverse proxies.',
    resources: [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'GitHub Repository', isFree: true },
      { title: 'Cloudflare What Is Load Balancing', url: 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/', type: 'Article', isFree: true },
    ],
  },
];

export class LearningService {
  async ensureTopics() {
    const count = await prisma.learningTopic.count();
    if (count === 0) {
      for (const t of INITIAL_LEARNING_TOPICS) {
        await prisma.learningTopic.create({ data: t });
      }
    }
  }

  async getTopics(userId: string, category?: string) {
    await this.ensureTopics();

    const topics = await prisma.learningTopic.findMany({
      where: category ? { category } : undefined,
      orderBy: { title: 'asc' },
    });

    const userProgresses = await prisma.userLearningProgress.findMany({
      where: { userId },
    });

    const progressMap = new Map(userProgresses.map((p) => [p.topicId, p]));

    return topics.map((t) => {
      const p = progressMap.get(t.id);
      return {
        ...t,
        isCompleted: p?.isCompleted ?? false,
        isBookmarked: p?.isBookmarked ?? false,
      };
    });
  }

  async toggleProgress(
    userId: string,
    topicId: string,
    data: { isCompleted?: boolean; isBookmarked?: boolean }
  ) {
    const existing = await prisma.userLearningProgress.findUnique({
      where: { userId_topicId: { userId, topicId } },
    });

    const newCompleted =
      data.isCompleted !== undefined ? data.isCompleted : existing?.isCompleted ?? false;
    const newBookmarked =
      data.isBookmarked !== undefined ? data.isBookmarked : existing?.isBookmarked ?? false;

    return prisma.userLearningProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: {
        userId,
        topicId,
        isCompleted: newCompleted,
        isBookmarked: newBookmarked,
        completedAt: newCompleted ? new Date() : null,
      },
      update: {
        isCompleted: newCompleted,
        isBookmarked: newBookmarked,
        completedAt: newCompleted ? new Date() : null,
      },
    });
  }
}

export const learningService = new LearningService();
