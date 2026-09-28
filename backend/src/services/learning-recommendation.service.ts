import { prisma } from '../config/database';
import { LearningResource, RecommendationResult } from '../types/learning.types';

export class LearningRecommendationService {
  /**
   * Retrieves user's missing skills, target role, and calculates recommendation relevance scores for resources.
   */
  async getPersonalizedRecommendations(
    userId: string,
    resources: LearningResource[]
  ): Promise<{
    userSkills: string[];
    missingSkills: string[];
    targetRole: string | null;
    scoredResources: LearningResource[];
    recommendedForGaps: LearningResource[];
  }> {
    // 1. Fetch user's profile, latest resume analysis, active roadmap, and weak mock tests
    const [profile, latestAnalysis, activeRoadmap, weakMockTests] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.resumeAnalysis.findFirst({
        where: { resumeVersion: { resume: { userId } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.careerRoadmap.findFirst({
        where: { userId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quizMockTest.findMany({
        where: { userId, completed: true, accuracyPct: { lt: 60 } },
        select: { category: true },
      }),
    ]);

    const targetRole = profile?.targetRole || latestAnalysis?.targetRole || activeRoadmap?.targetRole || null;

    // Collect user known skills
    const userSkillSet = new Set<string>();
    if (profile?.skills) {
      profile.skills.forEach((s) => userSkillSet.add(s.trim().toLowerCase()));
    }

    // Collect user missing skills / skill gaps from Resume analysis, Career Roadmap, and Weak Mock Tests
    const missingSkillSet = new Set<string>();
    if (latestAnalysis?.missingSkills) {
      latestAnalysis.missingSkills.forEach((s) => missingSkillSet.add(s.trim().toLowerCase()));
    }
    if (activeRoadmap?.skillGaps) {
      activeRoadmap.skillGaps.forEach((s) => missingSkillSet.add(s.trim().toLowerCase()));
    }
    if (activeRoadmap?.prioritySkills) {
      activeRoadmap.prioritySkills.forEach((s) => missingSkillSet.add(s.trim().toLowerCase()));
    }
    if (weakMockTests && weakMockTests.length > 0) {
      weakMockTests.forEach((t) => missingSkillSet.add(t.category.trim().toLowerCase()));
    }

    // Default missing skills fallback if user has no resume/roadmap analyzed yet
    const missingSkillsList = Array.from(missingSkillSet);

    // 2. Score resources based on missing skills, user skills, and target role relevance
    const scoredResources: LearningResource[] = resources.map((res) => {
      let score = 10; // Base score
      const matchedMissing: string[] = [];

      const resSkillsLower = res.skills.map((s) => s.toLowerCase());
      const titleLower = res.title.toLowerCase();
      const catLower = res.category.toLowerCase();
      const descLower = (res.description || '').toLowerCase();

      // Missing skill match calculation
      missingSkillSet.forEach((gap) => {
        const isMatch =
          resSkillsLower.some((s) => s.includes(gap) || gap.includes(s)) ||
          titleLower.includes(gap) ||
          catLower.includes(gap) ||
          descLower.includes(gap);

        if (isMatch) {
          score += 50;
          matchedMissing.push(gap);
        }
      });

      // Target role relevance boost
      if (targetRole) {
        const roleLower = targetRole.toLowerCase();
        if (
          (roleLower.includes('frontend') && catLower.includes('frontend')) ||
          (roleLower.includes('backend') && catLower.includes('backend')) ||
          (roleLower.includes('data') && catLower.includes('data')) ||
          (roleLower.includes('ai') && catLower.includes('ai')) ||
          (roleLower.includes('database') && catLower.includes('database'))
        ) {
          score += 20;
        }
      }

      // User known skills boost (to deepen expertise)
      userSkillSet.forEach((knownSkill) => {
        if (resSkillsLower.some((s) => s.includes(knownSkill))) {
          score += 10;
        }
      });

      return {
        ...res,
        relevanceScore: score,
        matchedMissingSkills: matchedMissing,
      };
    });

    // Sort resources by relevance score descending
    scoredResources.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Filter resources that directly match skill gaps
    const recommendedForGaps = scoredResources.filter(
      (r) => r.matchedMissingSkills && r.matchedMissingSkills.length > 0
    );

    return {
      userSkills: Array.from(userSkillSet),
      missingSkills: missingSkillsList,
      targetRole,
      scoredResources,
      recommendedForGaps,
    };
  }
}

export const learningRecommendationService = new LearningRecommendationService();
