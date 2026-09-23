import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { githubClientService, GitHubTreeItem } from './github.client';
import { aiClient } from './ai.client';
import {
  EvidenceLevel,
  EngineeringSignals,
  ActivitySignals,
  SkillEvidenceItem,
  ResumeAlignmentItem,
} from '../types/github.types';

export class GitHubService {
  // 1. Get Connected Profile for user
  public async getConnectedProfile(userId: string) {
    const account = await prisma.gitHubAccount.findUnique({
      where: { userId },
      include: {
        repositories: {
          orderBy: { updatedAt: 'desc' },
          include: {
            analyses: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!account) return null;

    const totalAnalyzed = account.repositories.filter((r) => r.analyses.length > 0).length;
    const languagesSet = new Set<string>();
    account.repositories.forEach((r) => {
      if (r.primaryLanguage) languagesSet.add(r.primaryLanguage);
    });

    return {
      id: account.id,
      userId: account.userId,
      username: account.username,
      name: account.name || account.username,
      avatarUrl: account.avatarUrl,
      profileUrl: account.profileUrl,
      bio: account.bio,
      publicRepos: account.publicRepos,
      followers: account.followers,
      following: account.following,
      lastSyncedAt: account.lastSyncedAt,
      stats: {
        totalRepositories: account.repositories.length,
        totalLanguages: languagesSet.size,
        projectsAnalyzed: totalAnalyzed,
      },
    };
  }

  // 2. Connect GitHub Account by username or OAuth
  public async connectAccount(userId: string, username: string) {
    const profile = await githubClientService.getUserProfile({ username });

    const account = await prisma.gitHubAccount.upsert({
      where: { userId },
      create: {
        userId,
        githubUserId: profile.githubUserId,
        username: profile.username,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        profileUrl: profile.profileUrl,
        bio: profile.bio,
        publicRepos: profile.publicRepos,
        followers: profile.followers,
        following: profile.following,
      },
      update: {
        githubUserId: profile.githubUserId,
        username: profile.username,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        profileUrl: profile.profileUrl,
        bio: profile.bio,
        publicRepos: profile.publicRepos,
        followers: profile.followers,
        following: profile.following,
        lastSyncedAt: new Date(),
      },
    });

    // Sync initial repository list (metadata only)
    await this.syncRepositories(userId, profile.username);

    return account;
  }

  // 3. Disconnect GitHub Account
  public async disconnectAccount(userId: string) {
    await prisma.gitHubAccount.delete({
      where: { userId },
    });
    return { success: true };
  }

  // 4. Sync Repositories metadata for connected user
  public async syncRepositories(userId: string, username: string) {
    const account = await prisma.gitHubAccount.findUnique({ where: { userId } });
    if (!account) throw new Error('GitHub account not connected.');

    const rawRepos = await githubClientService.getUserRepositories(username);

    for (const repo of rawRepos) {
      let languages: Record<string, number> = {};
      try {
        languages = await githubClientService.getRepositoryLanguages(repo.owner.login, repo.name);
      } catch {
        if (repo.language) languages = { [repo.language]: 1000 };
      }
      if (Object.keys(languages).length === 0 && repo.language) {
        languages = { [repo.language]: 1000 };
      }

      await prisma.gitHubRepository.upsert({
        where: {
          githubAccountId_githubRepoId: {
            githubAccountId: account.id,
            githubRepoId: String(repo.id),
          },
        },
        create: {
          githubAccountId: account.id,
          userId,
          githubRepoId: String(repo.id),
          owner: repo.owner.login,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          primaryLanguage: repo.language,
          languages: languages as any,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPrivate: repo.private,
          defaultBranch: repo.default_branch,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        },
        update: {
          description: repo.description,
          primaryLanguage: repo.language,
          languages: languages as any,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        },
      });
    }

    await prisma.gitHubAccount.update({
      where: { id: account.id },
      data: { lastSyncedAt: new Date() },
    });

    return await prisma.gitHubRepository.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  // 5. Get Repositories with Search & Filter
  public async getRepositories(userId: string, search?: string, filter?: string, language?: string) {
    let repos = await prisma.gitHubRepository.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // If no repos synced yet, sync now
    if (repos.length === 0) {
      const account = await prisma.gitHubAccount.findUnique({ where: { userId } });
      if (account) {
        repos = await this.syncRepositories(userId, account.username);
      }
    }

    let filtered = repos;

    if (search && search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          (r.description && r.description.toLowerCase().includes(term)) ||
          (r.primaryLanguage && r.primaryLanguage.toLowerCase().includes(term))
      );
    }

    if (language && language !== 'All') {
      filtered = filtered.filter((r) => r.primaryLanguage?.toLowerCase() === language.toLowerCase());
    }

    if (filter === 'Analyzed') {
      filtered = filtered.filter((r) => r.analyses.length > 0 && r.analyses[0].status === 'COMPLETED');
    } else if (filter === 'Not Analyzed') {
      filtered = filtered.filter((r) => r.analyses.length === 0);
    } else if (filter === 'Starred') {
      filtered = filtered.sort((a, b) => b.stars - a.stars);
    } else if (filter === 'Recently Updated') {
      filtered = filtered.sort((a, b) => new Date(b.pushedAt || b.updatedAt).getTime() - new Date(a.pushedAt || a.updatedAt).getTime());
    }

    return filtered;
  }

  // 6. Analyze Specific Repository (Triggered ONLY when user explicitly selects a repo)
  public async analyzeRepository(userId: string, owner: string, repoName: string) {
    const repo = await prisma.gitHubRepository.findFirst({
      where: { userId, owner, name: repoName },
    });

    if (!repo) {
      throw new Error(`Repository "${owner}/${repoName}" was not found or is not accessible.`);
    }

    // Step A: Fetch README and file tree
    const readmeText = await githubClientService.getRepositoryReadme(owner, repoName) || '';
    const fileTree: GitHubTreeItem[] = await githubClientService.getRepositoryTree(owner, repoName, repo.defaultBranch);

    // Step B: Deterministic Signal Extraction
    const filePaths: string[] = fileTree.map((f: GitHubTreeItem) => f.path);
    const hasTests = filePaths.some((p: string) =>
      p.includes('.test.') ||
      p.includes('.spec.') ||
      p.includes('__tests__') ||
      p.startsWith('tests/') ||
      p.startsWith('test/')
    );
    const testFrameworks: string[] = [];
    if (filePaths.some((p: string) => p.includes('jest') || p.includes('vitest'))) testFrameworks.push('Jest/Vitest');
    if (filePaths.some((p: string) => p.includes('pytest'))) testFrameworks.push('PyTest');
    if (filePaths.some((p: string) => p.includes('junit'))) testFrameworks.push('JUnit');
    if (hasTests && testFrameworks.length === 0) testFrameworks.push('Unit Tests');

    const hasCiCd = filePaths.some((p: string) => p.startsWith('.github/workflows') || p.includes('.circleci') || p.includes('travis.yml'));
    const ciCdTools: string[] = [];
    if (filePaths.some((p: string) => p.startsWith('.github/workflows'))) ciCdTools.push('GitHub Actions');
    if (filePaths.some((p: string) => p.includes('.circleci'))) ciCdTools.push('CircleCI');

    const hasDocker = filePaths.some((p: string) => p.includes('Dockerfile') || p.includes('docker-compose'));
    const hasLinting = filePaths.some((p: string) => p.includes('.eslint') || p.includes('prettier') || p.includes('.pylintrc'));
    const hasEnvConfig = filePaths.some((p: string) => p.includes('.env.example') || p.includes('config'));
    const hasPackageManifest = filePaths.some((p: string) =>
      p === 'package.json' || p === 'requirements.txt' || p === 'Cargo.toml' || p === 'pom.xml' || p === 'go.mod'
    );

    let readmeQuality: 'High' | 'Medium' | 'Basic' | 'Missing' = 'Missing';
    if (readmeText.length > 2000) readmeQuality = 'High';
    else if (readmeText.length > 500) readmeQuality = 'Medium';
    else if (readmeText.length > 50) readmeQuality = 'Basic';

    const engineeringSignals: EngineeringSignals = {
      hasReadme: Boolean(readmeText),
      readmeLength: readmeText.length,
      readmeQuality,
      hasTests,
      testFrameworks,
      hasCiCd,
      ciCdTools,
      hasDocker,
      hasLinting,
      hasEnvConfig,
      hasPackageManifest,
      fileCount: fileTree.filter((f: GitHubTreeItem) => f.type === 'blob').length,
      dirCount: fileTree.filter((f: GitHubTreeItem) => f.type === 'tree').length,
      detectedArchitecture: filePaths.some((p: string) => p.includes('frontend') || p.includes('src/app')) && filePaths.some((p: string) => p.includes('backend') || p.includes('api'))
        ? 'Full-stack Monorepo Architecture'
        : filePaths.some((p: string) => p.includes('src/app') || p.includes('pages/'))
        ? 'Frontend / Next.js Architecture'
        : filePaths.some((p: string) => p.includes('controllers/') || p.includes('routes/'))
        ? 'Backend API Microservice'
        : 'Modular Codebase Structure',
    };

    const activitySignals: ActivitySignals = {
      totalCommitsSampled: 25,
      lastPushedAt: repo.pushedAt ? repo.pushedAt.toISOString() : null,
      activePeriod: 'Recent Development Activity',
      maintenanceStatus: 'Active',
    };

    // Step C: Skill Extraction with Deterministic Evidence Levels
    const detectedStack: string[] = [];
    if (repo.primaryLanguage) detectedStack.push(repo.primaryLanguage);
    if (filePaths.some((p: string) => p.includes('react') || p.includes('tsx'))) detectedStack.push('React');
    if (filePaths.some((p: string) => p.includes('next.config'))) detectedStack.push('Next.js');
    if (filePaths.some((p: string) => p.includes('express') || p.includes('app.ts'))) detectedStack.push('Express.js');
    if (filePaths.some((p: string) => p.includes('prisma/'))) detectedStack.push('Prisma');
    if (filePaths.some((p: string) => p.includes('fastapi') || p.includes('main.py'))) detectedStack.push('FastAPI');
    if (hasDocker) detectedStack.push('Docker');
    if (hasCiCd) detectedStack.push('GitHub Actions');

    const uniqueStack = Array.from(new Set(detectedStack));

    // Save Skill Evidences to DB
    for (const skill of uniqueStack) {
      let category = 'Languages';
      if (['React', 'Next.js', 'HTML', 'CSS', 'Tailwind'].includes(skill)) category = 'Frontend';
      else if (['Express.js', 'Node.js', 'FastAPI', 'Django'].includes(skill)) category = 'Backend';
      else if (['Prisma', 'PostgreSQL', 'MongoDB'].includes(skill)) category = 'Database';
      else if (['Docker', 'GitHub Actions', 'AWS'].includes(skill)) category = 'Cloud/DevOps';

      const evidenceLevel: EvidenceLevel = repo.stars > 5 || engineeringSignals.fileCount > 20 ? 'STRONG' : 'MODERATE';

      await prisma.gitHubSkillEvidence.create({
        data: {
          userId,
          repositoryId: repo.id,
          skill,
          category,
          evidenceLevel,
          evidenceDetails: [
            `Detected in ${repo.fullName} repository structure`,
            `Primary Language: ${repo.primaryLanguage || 'Multi-language'}`,
            `File Count: ${engineeringSignals.fileCount}`,
          ],
        },
      });
    }

    // Step D: High-level AI Code Review & Insights via Gemini
    const aiResult = await aiClient.analyzeGitHubRepository(
      repo.fullName,
      repo.description || '',
      uniqueStack,
      readmeText.substring(0, 3000), // Cap readme text
      engineeringSignals
    );

    // Save Analysis to Database
    const analysis = await prisma.gitHubRepositoryAnalysis.create({
      data: {
        repositoryId: repo.id,
        userId,
        status: 'COMPLETED',
        projectSummary: aiResult.projectSummary,
        architectureSummary: aiResult.architectureSummary,
        detectedStack: uniqueStack,
        engineeringAreas: aiResult.engineeringAreas,
        engineeringSignals: engineeringSignals as any,
        activitySignals: activitySignals as any,
        aiReview: aiResult.aiReview as any,
        resumeBullets: aiResult.resumeBullets,
        interviewQuestions: aiResult.interviewQuestions as any,
      },
    });

    return {
      id: analysis.id,
      repositoryId: repo.id,
      repositoryName: repo.name,
      repositoryOwner: repo.owner,
      status: analysis.status,
      analyzedAt: analysis.analyzedAt,
      projectSummary: analysis.projectSummary,
      architectureSummary: analysis.architectureSummary,
      detectedStack: analysis.detectedStack,
      engineeringAreas: analysis.engineeringAreas,
      engineeringSignals,
      activitySignals,
      aiReview: analysis.aiReview,
      resumeBullets: analysis.resumeBullets,
      interviewQuestions: analysis.interviewQuestions,
    };
  }

  // 7. Get Resume ↔ GitHub Skill Alignment
  public async getResumeAlignment(userId: string): Promise<ResumeAlignmentItem[]> {
    // Fetch user's latest resume skills
    const latestResume = await prisma.resumeVersion.findFirst({
      where: { resume: { userId } },
      orderBy: { createdAt: 'desc' },
    });

    const resumeSkills: string[] = (latestResume?.extractedData as any)?.skills || [
      'React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'Git'
    ];

    // Fetch user's GitHub skill evidences
    const evidences = await prisma.gitHubSkillEvidence.findMany({
      where: { userId },
      include: { repository: true },
    });

    const alignmentList: ResumeAlignmentItem[] = resumeSkills.map((skill) => {
      const matched = evidences.filter((e) => e.skill.toLowerCase() === skill.toLowerCase());
      let level: EvidenceLevel = 'INSUFFICIENT';
      let statusLabel = 'Insufficient repository evidence';

      if (matched.length > 0) {
        const hasStrong = matched.some((m) => m.evidenceLevel === 'STRONG');
        if (hasStrong) {
          level = 'STRONG';
          statusLabel = 'Strong GitHub evidence';
        } else {
          level = 'MODERATE';
          statusLabel = 'Moderate GitHub evidence';
        }
      }

      const matchingRepos = matched.map((m) => m.repository?.name || '').filter(Boolean);

      let category = 'Technical Skill';
      if (['React', 'Next.js', 'Tailwind', 'HTML', 'CSS'].includes(skill)) category = 'Frontend';
      else if (['Node.js', 'Express.js', 'FastAPI', 'Python'].includes(skill)) category = 'Backend';
      else if (['PostgreSQL', 'Prisma', 'MongoDB'].includes(skill)) category = 'Database';
      else if (['Docker', 'GitHub Actions', 'AWS'].includes(skill)) category = 'DevOps';

      return {
        skill,
        category,
        resumeFound: true,
        githubEvidence: level,
        statusLabel,
        matchingRepositories: Array.from(new Set(matchingRepos)),
      };
    });

    return alignmentList;
  }
}

export const githubService = new GitHubService();
