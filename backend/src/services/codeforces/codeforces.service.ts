import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import crypto from 'crypto';

export interface NormalizedCFProblem {
  id: string;
  contestId: number;
  index: string;
  name: string;
  type: string;
  rating?: number | null;
  points?: number | null;
  tags: string[];
  solvedCount?: number | null;
  officialUrl: string;
  source: 'CODEFORCES';
}

export interface NormalizedCFContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds?: number | null;
  relativeTimeSeconds?: number | null;
  officialUrl: string;
}

export class CodeforcesService {
  private problemsCache: { data: NormalizedCFProblem[]; timestamp: number } | null = null;
  private contestsCache: { data: NormalizedCFContest[]; timestamp: number } | null = null;

  private PROBLEMS_CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes
  private CONTESTS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Fetch Codeforces Problemset from official API or DB cache
   */
  public async getProblems(query?: {
    search?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    tag?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    problems: NormalizedCFProblem[];
    total: number;
    page: number;
    totalPages: number;
    isCachedFallback?: boolean;
  }> {
    const page = Math.max(1, query?.page || 1);
    const limit = Math.min(100, Math.max(1, query?.limit || 20));
    const skip = (page - 1) * limit;

    let allProblems = await this.fetchAndCacheProblems();

    // Filtering
    let filtered = [...allProblems];

    if (query?.search && query.search.trim()) {
      const s = query.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s)) ||
          `${p.contestId}${p.index}`.toLowerCase().includes(s)
      );
    }

    if (query?.rating) {
      filtered = filtered.filter((p) => p.rating === query.rating);
    }

    if (query?.minRating) {
      filtered = filtered.filter((p) => (p.rating || 0) >= query.minRating!);
    }

    if (query?.maxRating) {
      filtered = filtered.filter((p) => (p.rating || 9999) <= query.maxRating!);
    }

    if (query?.tag && query.tag !== 'ALL') {
      const tLower = query.tag.toLowerCase();
      filtered = filtered.filter((p) => p.tags.some((t) => t.toLowerCase() === tLower));
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      problems: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Get stable Daily Challenge for a specific user and date
   */
  public async getDailyChallenge(userId?: string, dateStr?: string): Promise<{
    date: string;
    problem: NormalizedCFProblem;
    isPersonalized: boolean;
  }> {
    const dateKey = dateStr || new Date().toISOString().split('T')[0];
    const allProblems = await this.fetchAndCacheProblems();

    // Filter reasonable rating pool for daily challenge (rating 800 - 1600)
    const pool = allProblems.filter((p) => p.rating && p.rating >= 800 && p.rating <= 1600);
    const candidateList = pool.length > 0 ? pool : allProblems;

    // Create a deterministic hash string combining date + userId
    const seed = `${dateKey}_${userId || 'global_daily'}`;
    const hashHex = crypto.createHash('sha256').update(seed).digest('hex');
    const hashInt = parseInt(hashHex.substring(0, 8), 16);

    const selectedIndex = hashInt % candidateList.length;
    const selectedProblem = candidateList[selectedIndex];

    return {
      date: dateKey,
      problem: selectedProblem,
      isPersonalized: !!userId,
    };
  }

  /**
   * Fetch upcoming Codeforces contests
   */
  public async getUpcomingContests(): Promise<{
    contests: NormalizedCFContest[];
    total: number;
  }> {
    const contests = await this.fetchAndCacheContests();
    const upcoming = contests.filter((c) => c.phase === 'BEFORE' || c.phase === 'CODING');

    return {
      contests: upcoming,
      total: upcoming.length,
    };
  }

  /**
   * Fetch Codeforces problems from official API, sync to DB, or fallback to DB
   */
  private async fetchAndCacheProblems(): Promise<NormalizedCFProblem[]> {
    const now = Date.now();

    // Return in-memory cache if valid
    if (this.problemsCache && now - this.problemsCache.timestamp < this.PROBLEMS_CACHE_TTL_MS) {
      return this.problemsCache.data;
    }

    try {
      logger.info('Fetching fresh Codeforces problems from official API...');
      const response = await fetch('https://codeforces.com/api/problemset.problems', {
        headers: { 'User-Agent': 'NexoraAI-CareerPlatform/2.0' },
      });

      if (!response.ok) {
        throw new Error(`Codeforces API HTTP ${response.status}`);
      }

      const json: any = await response.json();
      if (json.status !== 'OK' || !json.result || !json.result.problems) {
        throw new Error(`Codeforces API returned error status: ${json.status}`);
      }

      const rawProblems: any[] = json.result.problems;
      const rawStats: any[] = json.result.problemStatistics || [];

      // Create stats lookup map by `contestId_index`
      const statsMap = new Map<string, number>();
      rawStats.forEach((stat) => {
        if (stat.contestId && stat.index) {
          statsMap.set(`${stat.contestId}_${stat.index}`, stat.solvedCount || 0);
        }
      });

      // Normalize problems
      const normalized: NormalizedCFProblem[] = rawProblems.map((p) => {
        const key = `${p.contestId}_${p.index}`;
        const solvedCount = statsMap.get(key) || null;
        const officialUrl = `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`;

        return {
          id: `cf_${p.contestId}_${p.index}`,
          contestId: p.contestId,
          index: p.index,
          name: p.name,
          type: p.type || 'PROGRAMMING',
          rating: p.rating || null,
          points: p.points || null,
          tags: p.tags || [],
          solvedCount,
          officialUrl,
          source: 'CODEFORCES',
        };
      });

      // Update in-memory cache
      this.problemsCache = { data: normalized, timestamp: now };

      // Async background DB sync (non-blocking)
      this.syncProblemsToDatabase(normalized).catch((err) => {
        logger.warn(`Background Codeforces DB sync warning: ${err.message}`);
      });

      return normalized;
    } catch (err: any) {
      logger.warn(`Failed to fetch from Codeforces API (${err.message}). Attempting DB fallback...`);
      return this.getProblemsFromDatabase();
    }
  }

  /**
   * Fetch Codeforces contests from official API or fallback to DB
   */
  private async fetchAndCacheContests(): Promise<NormalizedCFContest[]> {
    const now = Date.now();

    if (this.contestsCache && now - this.contestsCache.timestamp < this.CONTESTS_CACHE_TTL_MS) {
      return this.contestsCache.data;
    }

    try {
      logger.info('Fetching Codeforces contest list from official API...');
      const response = await fetch('https://codeforces.com/api/contest.list?gym=false', {
        headers: { 'User-Agent': 'NexoraAI-CareerPlatform/2.0' },
      });

      if (!response.ok) {
        throw new Error(`Codeforces API HTTP ${response.status}`);
      }

      const json: any = await response.json();
      if (json.status !== 'OK' || !Array.isArray(json.result)) {
        throw new Error(`Codeforces API contest list status: ${json.status}`);
      }

      const rawContests: any[] = json.result;
      const normalized: NormalizedCFContest[] = rawContests.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type || 'CF',
        phase: c.phase,
        durationSeconds: c.durationSeconds,
        startTimeSeconds: c.startTimeSeconds || null,
        relativeTimeSeconds: c.relativeTimeSeconds || null,
        officialUrl: `https://codeforces.com/contest/${c.id}`,
      }));

      this.contestsCache = { data: normalized, timestamp: now };

      // Background DB sync
      this.syncContestsToDatabase(normalized).catch((err) => {
        logger.warn(`Background Codeforces Contests DB sync warning: ${err.message}`);
      });

      return normalized;
    } catch (err: any) {
      logger.warn(`Failed to fetch Codeforces contests (${err.message}). Attempting DB fallback...`);
      return this.getContestsFromDatabase();
    }
  }

  /**
   * Persist Codeforces problems into DB for offline resilience
   */
  private async syncProblemsToDatabase(problems: NormalizedCFProblem[]): Promise<void> {
    const subset = problems.slice(0, 300);
    for (const p of subset) {
      await prisma.codeforcesProblem.upsert({
        where: {
          contestId_index: {
            contestId: p.contestId,
            index: p.index,
          },
        },
        update: {
          name: p.name,
          rating: p.rating,
          points: p.points,
          tags: p.tags,
          solvedCount: p.solvedCount,
          officialUrl: p.officialUrl,
        },
        create: {
          contestId: p.contestId,
          index: p.index,
          name: p.name,
          type: p.type,
          rating: p.rating,
          points: p.points,
          tags: p.tags,
          solvedCount: p.solvedCount,
          officialUrl: p.officialUrl,
        },
      });
    }
  }

  /**
   * Persist Codeforces contests into DB
   */
  private async syncContestsToDatabase(contests: NormalizedCFContest[]): Promise<void> {
    const upcoming = contests.filter((c) => c.phase === 'BEFORE' || c.phase === 'CODING');
    for (const c of upcoming) {
      await prisma.codeforcesContest.upsert({
        where: { id: c.id },
        update: {
          name: c.name,
          phase: c.phase,
          durationSeconds: c.durationSeconds,
          startTimeSeconds: c.startTimeSeconds,
          relativeTimeSeconds: c.relativeTimeSeconds,
          officialUrl: c.officialUrl,
        },
        create: {
          id: c.id,
          name: c.name,
          type: c.type,
          phase: c.phase,
          durationSeconds: c.durationSeconds,
          startTimeSeconds: c.startTimeSeconds,
          relativeTimeSeconds: c.relativeTimeSeconds,
          officialUrl: c.officialUrl,
        },
      });
    }
  }

  /**
   * Fallback: Get problems from database if Codeforces API is unreachable
   */
  private async getProblemsFromDatabase(): Promise<NormalizedCFProblem[]> {
    try {
      const dbProblems = await prisma.codeforcesProblem.findMany({
        orderBy: { contestId: 'desc' },
        take: 100,
      });

      return dbProblems.map((p) => ({
        id: `cf_${p.contestId}_${p.index}`,
        contestId: p.contestId,
        index: p.index,
        name: p.name,
        type: p.type,
        rating: p.rating,
        points: p.points,
        tags: p.tags,
        solvedCount: p.solvedCount,
        officialUrl: p.officialUrl,
        source: 'CODEFORCES',
      }));
    } catch (err: any) {
      logger.error(`Database fallback for Codeforces problems failed: ${err.message}`);
      return [];
    }
  }

  /**
   * Fallback: Get contests from database
   */
  private async getContestsFromDatabase(): Promise<NormalizedCFContest[]> {
    try {
      const dbContests = await prisma.codeforcesContest.findMany({
        orderBy: { startTimeSeconds: 'asc' },
      });

      return dbContests.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        phase: c.phase,
        durationSeconds: c.durationSeconds,
        startTimeSeconds: c.startTimeSeconds,
        relativeTimeSeconds: c.relativeTimeSeconds,
        officialUrl: c.officialUrl,
      }));
    } catch (err: any) {
      logger.error(`Database fallback for Codeforces contests failed: ${err.message}`);
      return [];
    }
  }
}

export const codeforcesService = new CodeforcesService();
