import { codeforcesService } from '../services/codeforces/codeforces.service';

describe('Codeforces Integration Tests', () => {
  it('should fetch or fallback Codeforces problems cleanly', async () => {
    const result = await codeforcesService.getProblems({ page: 1, limit: 10 });
    expect(result).toBeDefined();
    expect(Array.isArray(result.problems)).toBe(true);
    expect(result.problems.length).toBeGreaterThanOrEqual(0);

    if (result.problems.length > 0) {
      const p = result.problems[0];
      expect(p.source).toBe('CODEFORCES');
      expect(p.officialUrl).toContain('codeforces.com/problemset/problem');
    }
  });

  it('should generate stable Daily Challenge for the same user and date', async () => {
    const date = '2026-09-25';
    const userId = 'user_test_123';

    const challenge1 = await codeforcesService.getDailyChallenge(userId, date);
    const challenge2 = await codeforcesService.getDailyChallenge(userId, date);

    expect(challenge1.date).toBe(date);
    expect(challenge1.problem.id).toBe(challenge2.problem.id);
    expect(challenge1.problem.officialUrl).toBe(challenge2.problem.officialUrl);
  });

  it('should fetch upcoming contests cleanly', async () => {
    const result = await codeforcesService.getUpcomingContests();
    expect(result).toBeDefined();
    expect(Array.isArray(result.contests)).toBe(true);
  });
});
