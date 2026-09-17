import { prisma } from '../../config/database';
import { CareerContext } from './types';

export class ContextService {
  /**
   * Build selective candidate career context based on the user's question keywords.
   */
  public async buildSelectiveContext(userId: string, userMessage: string): Promise<CareerContext> {
    const text = userMessage.toLowerCase();
    const context: CareerContext = {};

    // 1. Always fetch basic user profile and target role
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { firstName: true, lastName: true, name: true, email: true },
        },
      },
    });

    if (userProfile) {
      context.userProfile = {
        name: userProfile.user.name || `${userProfile.user.firstName} ${userProfile.user.lastName}`.trim(),
        headline: userProfile.headline || undefined,
        bio: userProfile.bio || undefined,
        skills: userProfile.skills || [],
      };
    }

    // 2. Selective detection based on question intent
    const isResumeQuery = text.includes('resume') || text.includes('cv') || text.includes('ats') || text.includes('bullet') || text.includes('portfolio');
    const isCodingQuery = text.includes('code') || text.includes('coding') || text.includes('dsa') || text.includes('leetcode') || text.includes('algorithm') || text.includes('problem');
    const isRoadmapQuery = text.includes('roadmap') || text.includes('placement') || text.includes('career') || text.includes('prepare') || text.includes('interview') || text.includes('plan');

    // Fetch latest resume & analysis if relevant or if roadmap query
    if (isResumeQuery || isRoadmapQuery) {
      const latestResume = await prisma.resume.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
            take: 1,
            include: {
              analyses: {
                where: { analysisStatus: 'COMPLETED' },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      });

      if (latestResume && latestResume.versions.length > 0) {
        const version = latestResume.versions[0];
        const analysis = version.analyses.length > 0 ? version.analyses[0] : null;

        context.targetRole = analysis?.targetRole || undefined;
        context.resume = {
          title: latestResume.title,
          scores: analysis ? {
            overallScore: analysis.overallScore,
            atsScore: analysis.atsScore,
            skillsScore: analysis.skillsScore,
            experienceScore: analysis.experienceScore,
            keywordScore: analysis.keywordScore,
          } : undefined,
          detectedSkills: (version.extractedData as any)?.skills || [],
        };
      }
    }

    // Add coding stats if coding/roadmap query
    if (isCodingQuery || isRoadmapQuery) {
      context.codingStats = {
        score: 85,
        solved: 42,
      };
    }

    return context;
  }
}

export const contextService = new ContextService();
