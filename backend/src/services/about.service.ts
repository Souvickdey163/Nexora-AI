import { prisma } from '../config/database';

export interface PlatformModuleInfo {
  name: string;
  description: string;
  route: string;
}

export interface PlatformOverviewResponse {
  platform: {
    name: string;
    tagline: string;
    description: string;
    version: string;
    status: string;
    updatedAt: Date;
  };
  modules: PlatformModuleInfo[];
  techStack: string[];
  securityFeatures: string[];
}

export interface UserCareerSummaryResponse {
  user: {
    name: string;
    email: string;
    avatar: string | null;
    credits: number;
    profileCompleted: boolean;
  };
  careerStats: {
    resumesUploaded: number;
    codingProblemsSolved: number;
    mockTestsCompleted: number;
    githubConnected: boolean;
    roadmapsCreated: number;
    placementAssessmentsCompleted: number;
  };
}

export class AboutService {
  /**
   * Returns system platform metadata (fetched/seeded from PostgreSQL)
   */
  async getPlatformInfo(): Promise<PlatformOverviewResponse> {
    let platformRecord = await prisma.platformInfo.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!platformRecord) {
      platformRecord = await prisma.platformInfo.create({
        data: {
          name: 'Nexora AI',
          tagline: 'AI Career Copilot',
          description:
            'Nexora AI brings resume intelligence, coding practice, AI-powered mock interviews, career guidance, GitHub analysis, and placement intelligence into one unified platform.',
          version: '2.4.0',
          status: 'operational',
        },
      });
    }

    const modules: PlatformModuleInfo[] = [
      {
        name: 'Resume Intelligence',
        description: 'ATS scoring, AI keyword feedback, and automated skill extraction.',
        route: '/features/resume',
      },
      {
        name: 'AI Mock Interview',
        description: 'Technical QuizAPI MCQs, written STAR answers, and live video sessions.',
        route: '/features/interview',
      },
      {
        name: 'Coding Arena',
        description: 'Algorithmic problem challenges with multi-language execution.',
        route: '/features/coding',
      },
      {
        name: 'AI Career Mentor',
        description: 'Interactive copilot advice, learning roadmaps, and career guidance.',
        route: '/features/mentor',
      },
      {
        name: 'GitHub Intelligence',
        description: 'Repository quality analysis, stack detection, and contribution insights.',
        route: '/features/github',
      },
      {
        name: 'Placement Intelligence',
        description: 'Readiness scoring, skill gap identification, and action plans.',
        route: '/features/placement',
      },
      {
        name: 'Job Discovery',
        description: 'Real-time job opportunities and skill-based role matching via Jobvetta.',
        route: '/features/analytics',
      },
    ];

    const techStack = [
      'Next.js 16 (App Router & Turbopack)',
      'React 19 & TypeScript',
      'Tailwind CSS & Glassmorphism Design System',
      'Node.js & Express REST API Engine',
      'PostgreSQL Database & Prisma ORM',
      'QuizAPI Integration (Technical MCQs)',
      'freeCodeCamp GraphQL API (Learning Hub)',
      'Jobvetta Jobs API (Vacancy Discovery)',
      'JWT Authentication & Security Middleware',
    ];

    const securityFeatures = [
      'JWT Session Authentication & Password Hashing',
      'Server-Side API Key Isolation (Zero client exposure)',
      'Zod Request Payload Validation',
      'Express Rate Limiting & Helmet Security Headers',
      'PostgreSQL Database Access Controls & Cascading Deletes',
    ];

    return {
      platform: {
        name: platformRecord.name,
        tagline: platformRecord.tagline,
        description: platformRecord.description,
        version: platformRecord.version,
        status: platformRecord.status,
        updatedAt: platformRecord.updatedAt,
      },
      modules,
      techStack,
      securityFeatures,
    };
  }

  /**
   * Returns authenticated user's actual database activity stats
   */
  async getUserCareerSummary(userId: string): Promise<UserCareerSummaryResponse> {
    const [
      user,
      profile,
      resumesCount,
      codingSolvedCount,
      quizMockCount,
      interviewCount,
      githubAccount,
      roadmapsCount,
      placementCount,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true, avatar: true, credits: true },
      }),
      prisma.userProfile.findUnique({
        where: { userId },
        select: { id: true, targetRole: true },
      }),
      prisma.resume.count({ where: { userId } }),
      prisma.codingProgress.count({ where: { userId, isSolved: true } }),
      prisma.quizMockTest.count({ where: { userId, completed: true } }),
      prisma.interview.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.gitHubAccount.findUnique({ where: { userId } }),
      prisma.careerRoadmap.count({ where: { userId } }),
      prisma.placementAssessment.count({ where: { userId } }),
    ]);

    const name = user ? `${user.firstName} ${user.lastName}`.trim() : 'Developer';

    return {
      user: {
        name: name || 'Nexora User',
        email: user?.email || '',
        avatar: user?.avatar || null,
        credits: user?.credits || 0,
        profileCompleted: !!profile?.targetRole,
      },
      careerStats: {
        resumesUploaded: resumesCount,
        codingProblemsSolved: codingSolvedCount,
        mockTestsCompleted: quizMockCount + interviewCount,
        githubConnected: !!githubAccount,
        roadmapsCreated: roadmapsCount,
        placementAssessmentsCompleted: placementCount,
      },
    };
  }
}

export const aboutService = new AboutService();
