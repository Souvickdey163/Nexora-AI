import { prisma } from '../config/database';

export class PlacementService {
  async getPlacementReadiness(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        resumes: {
          include: {
            versions: {
              include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } },
              orderBy: { versionNumber: 'desc' },
              take: 1,
            },
          },
        },
        codingProgress: { where: { isSolved: true }, include: { problem: true } },
        interviews: {
          where: { status: 'COMPLETED' },
          include: { report: true },
          orderBy: { completedAt: 'desc' },
        },
        assessments: { orderBy: { completedAt: 'desc' } },
        githubAnalyses: { orderBy: { createdAt: 'desc' } },
        githubSkillEvidences: true,
        roadmaps: { where: { status: 'ACTIVE' }, include: { milestones: true } },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const targetRole = user.profile?.targetRole || 'Software Engineer';

    // 1. Resume Dimension
    const latestAnalysis = user.resumes[0]?.versions[0]?.analyses[0];
    const resumeScore = latestAnalysis?.overallScore ?? null;
    const resumeStatus =
      resumeScore === null
        ? 'UNANALYZED'
        : resumeScore >= 80
        ? 'INTERVIEW_READY'
        : resumeScore >= 60
        ? 'MODERATE'
        : 'NEEDS_REVISION';

    // 2. Coding Dimension
    const solvedCount = user.codingProgress.length;
    const codingStatus =
      solvedCount >= 50
        ? 'ADVANCED'
        : solvedCount >= 15
        ? 'INTERMEDIATE'
        : solvedCount > 0
        ? 'FOUNDATIONAL'
        : 'UNATTEMPTED';

    // 3. Interview Dimension
    const completedInterviews = user.interviews;
    const avgInterviewScore =
      completedInterviews.length > 0
        ? Math.round(
            completedInterviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) /
              completedInterviews.length
          )
        : null;

    // 4. Assessment Dimension
    const assessments = user.assessments;
    const avgAssessmentAccuracy =
      assessments.length > 0
        ? Math.round(
            assessments.reduce((acc, a) => acc + a.accuracyPct, 0) / assessments.length
          )
        : null;

    // 5. GitHub Evidence Dimension
    const githubRepoCount = user.githubAnalyses.length;
    const evidencesCount = user.githubSkillEvidences.length;

    // 6. Roadmap Dimension
    const activeRoadmap = user.roadmaps[0];
    const roadmapProgressPct = activeRoadmap?.progressPct ?? 0;

    // Aggregate Strengths & Identified Gaps
    const strengths: string[] = [];
    const gaps: string[] = [];
    const priorityActions: string[] = [];

    if (resumeScore && resumeScore >= 75) {
      strengths.push('ATS-optimized resume with strong impact metrics');
    } else {
      gaps.push('Resume ATS formatting and keyword optimization needed');
      priorityActions.push('Upload and analyze resume version in Resume Intelligence');
    }

    if (solvedCount >= 15) {
      strengths.push(`Proven algorithmic problem solving (${solvedCount} problems solved)`);
    } else {
      gaps.push('Coding Arena problem solving coverage is below target threshold');
      priorityActions.push('Solve at least 15 Two Pointer and Sliding Window DSA problems');
    }

    if (avgInterviewScore && avgInterviewScore >= 75) {
      strengths.push('Strong communication and technical interview presentation');
    } else {
      gaps.push('Limited interview practice under timed pressure');
      priorityActions.push('Complete 1 Live AI Voice Interview session');
    }

    if (githubRepoCount > 0) {
      strengths.push(`Verified GitHub engineering evidence across ${githubRepoCount} repositories`);
    } else {
      gaps.push('No verified public repository code analysis');
      priorityActions.push('Connect GitHub account and analyze a primary repository');
    }

    return {
      targetRole,
      dimensions: [
        {
          name: 'Resume ATS Alignment',
          score: resumeScore ?? 0,
          status: resumeStatus,
          evidence: resumeScore ? `ATS Score: ${resumeScore}%` : 'No resume analysis conducted yet',
        },
        {
          name: 'Coding & Algorithmic Proficiency',
          score: Math.min(100, solvedCount * 4),
          status: codingStatus,
          evidence: `${solvedCount} coding problems solved`,
        },
        {
          name: 'Interview Communication & Clarity',
          score: avgInterviewScore ?? 0,
          status: avgInterviewScore ? (avgInterviewScore >= 75 ? 'HIGH' : 'MODERATE') : 'UNATTEMPTED',
          evidence: avgInterviewScore ? `Avg Evaluation: ${avgInterviewScore}%` : 'No interview sessions completed',
        },
        {
          name: 'Technical Skill Verification',
          score: avgAssessmentAccuracy ?? 0,
          status: avgAssessmentAccuracy ? (avgAssessmentAccuracy >= 75 ? 'VERIFIED' : 'PARTIAL') : 'UNTESTED',
          evidence: avgAssessmentAccuracy ? `Assessment Accuracy: ${avgAssessmentAccuracy}%` : 'No assessments completed',
        },
        {
          name: 'GitHub Project Evidence',
          score: Math.min(100, githubRepoCount * 35),
          status: githubRepoCount > 0 ? 'EVIDENCE_DETECTED' : 'NO_EVIDENCE',
          evidence: `${githubRepoCount} repos analyzed, ${evidencesCount} skill signals detected`,
        },
        {
          name: 'Roadmap Execution',
          score: roadmapProgressPct,
          status: roadmapProgressPct >= 50 ? 'ON_TRACK' : 'IN_PROGRESS',
          evidence: `${roadmapProgressPct}% milestone completion`,
        },
      ],
      strengths,
      gaps,
      priorityActions,
    };
  }
}

export const placementService = new PlacementService();
