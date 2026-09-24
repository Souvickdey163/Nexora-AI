import { prisma } from '../config/database';
import { creditService } from './credit.service';
import { CREDIT_COSTS } from '../config/creditCosts';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';

export class RoadmapService {
  /**
   * Generate a personalized career roadmap for the user.
   * Deducts 2 credits atomically.
   */
  async generateRoadmap(userId: string, targetRoleInput?: string, experienceLevelInput?: string) {
    // 1. Atomic Credit Deduction (2 credits)
    await creditService.deductCredits(
      userId,
      CREDIT_COSTS.ROADMAP_GENERATION,
      'ROADMAP_AI',
      'Career Roadmap Pathway Generation'
    );

    // 2. Fetch User Context Data
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
        githubAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        githubSkillEvidences: true,
        codingProgress: { where: { isSolved: true } },
        interviews: { where: { status: 'COMPLETED' }, orderBy: { completedAt: 'desc' }, take: 3 },
        assessments: { orderBy: { completedAt: 'desc' }, take: 3 },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const targetRole = targetRoleInput || user.profile?.targetRole || 'Software Engineer';
    const experienceLevel = experienceLevelInput || 'Entry Level';

    // Extract Skills & Gaps from Resume & GitHub
    const resumeAnalysis = user.resumes[0]?.versions[0]?.analyses[0];
    const resumeSkills = resumeAnalysis?.missingSkills || [];
    const githubSkills = user.githubSkillEvidences.map((e) => e.skill);

    const currentSkills = Array.from(
      new Set([
        ...(user.profile?.skills || []),
        ...githubSkills,
        ...(resumeAnalysis?.strengths || ['Problem Solving']),
      ])
    );

    const skillGaps = Array.from(
      new Set([
        ...resumeSkills,
        'System Design',
        'Distributed Caching',
        'Database Optimization',
      ])
    );

    // Archive existing active roadmaps
    await prisma.careerRoadmap.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'ARCHIVED' },
    });

    // Create New Career Roadmap
    const roadmap = await prisma.careerRoadmap.create({
      data: {
        userId,
        targetRole,
        experienceLevel,
        currentSkills,
        skillGaps,
        prioritySkills: skillGaps.slice(0, 5),
        weeklySchedule: '6 Weeks Schedule',
        progressPct: 0,
        status: 'ACTIVE',
        weeklyPlan: [
          { week: 1, focus: 'TypeScript & Core Software Engineering Architecture' },
          { week: 2, focus: 'Data Structures, Two Pointer & Sliding Window Patterns' },
          { week: 3, focus: 'PostgreSQL, Database Normalization & Prisma ORM' },
          { week: 4, focus: 'System Design & Scalable Microservices Architecture' },
          { week: 5, focus: 'Full-Stack Project Building & GitHub Evidence Polish' },
          { week: 6, focus: 'AI Mock Interview Practice & STAR Method Presentation' },
        ],
        milestones: {
          create: [
            {
              stage: 'Foundation',
              title: 'TypeScript & Modern JavaScript Mastery',
              description: 'Master Generics, Union Types, Async/Await concurrency, and Event Loop internals.',
              difficulty: 'Beginner',
              estimatedTime: '1 Week',
              order: 1,
            },
            {
              stage: 'DSA',
              title: 'Arrays, Strings & Two Pointer Algorithmic Patterns',
              description: `Solve 20 sliding window and two pointer problems in Nexora Coding Arena. Current solved: ${user.codingProgress.length}.`,
              difficulty: 'Intermediate',
              estimatedTime: '1.5 Weeks',
              order: 2,
            },
            {
              stage: 'Core CS',
              title: 'PostgreSQL, Indexing & Database Performance',
              description: 'Master ACID properties, B-Tree indexes, query execution plans, and Prisma ORM migrations.',
              difficulty: 'Intermediate',
              estimatedTime: '1.5 Weeks',
              order: 3,
            },
            {
              stage: 'Projects',
              title: 'Production Full-Stack Project & Deployment',
              description: 'Build & deploy Next.js + Express + PostgreSQL production app with GitHub Intelligence integration.',
              difficulty: 'Advanced',
              estimatedTime: '2 Weeks',
              order: 4,
            },
            {
              stage: 'Interview',
              title: 'System Design & AI Mock Interview Panels',
              description: 'Complete 3 AI mock interview sessions focusing on rate limiters, caching, and STAR behavioral questions.',
              difficulty: 'Advanced',
              estimatedTime: '1 Week',
              order: 5,
            },
          ],
        },
      },
      include: {
        milestones: { orderBy: { order: 'asc' } },
      },
    });

    // Log Activity & Create Notification
    await activityService.logActivity(
      userId,
      'ROADMAP_GENERATED',
      `Generated career roadmap for ${targetRole}`,
      { roadmapId: roadmap.id, targetRole }
    );

    await notificationService.createNotification(
      userId,
      'Roadmap Generated',
      `Your personalized career roadmap for ${targetRole} is ready!`,
      'ROADMAP',
      '/features/roadmap'
    );

    return roadmap;
  }

  /**
   * Get current active roadmap for user.
   */
  async getActiveRoadmap(userId: string) {
    let roadmap = await prisma.careerRoadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        milestones: { orderBy: { order: 'asc' } },
      },
    });

    // If no active roadmap, generate initial default roadmap without charging extra credits
    if (!roadmap) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const targetRole = user?.profile?.targetRole || 'Software Engineer';
      roadmap = await prisma.careerRoadmap.create({
        data: {
          userId,
          targetRole,
          experienceLevel: 'Entry Level',
          currentSkills: ['Problem Solving', 'JavaScript'],
          skillGaps: ['System Design', 'PostgreSQL Optimization'],
          prioritySkills: ['System Design', 'PostgreSQL Optimization'],
          weeklySchedule: '6 Weeks Schedule',
          progressPct: 0,
          status: 'ACTIVE',
          weeklyPlan: [
            { week: 1, focus: 'Core Software Engineering Architecture' },
            { week: 2, focus: 'Data Structures & Algorithms Practice' },
            { week: 3, focus: 'PostgreSQL, Database Normalization & Prisma ORM' },
            { week: 4, focus: 'System Design & Scalable Microservices Architecture' },
            { week: 5, focus: 'Full-Stack Project Building & GitHub Evidence Polish' },
            { week: 6, focus: 'AI Mock Interview Practice & STAR Method Presentation' },
          ],
          milestones: {
            create: [
              {
                stage: 'Foundation',
                title: 'TypeScript & ES6+ Advanced Mastery',
                description: 'Master Generics, Union Types, Utility Types, Async/Await concurrency, and Event Loop internals.',
                difficulty: 'Beginner',
                estimatedTime: '1 Week',
                completed: true,
                order: 1,
              },
              {
                stage: 'DSA',
                title: 'Arrays, Strings & Two Pointer Patterns',
                description: 'Solve 25 sliding window, two pointer, and prefix sum challenges in Coding Arena.',
                difficulty: 'Intermediate',
                estimatedTime: '2 Weeks',
                completed: true,
                order: 2,
              },
              {
                stage: 'Core CS',
                title: 'PostgreSQL & Database Normalization',
                description: 'Study ACID properties, B-Tree indexes, query execution plans, and Prisma ORM migrations.',
                difficulty: 'Intermediate',
                estimatedTime: '1.5 Weeks',
                completed: false,
                order: 3,
              },
              {
                stage: 'Projects',
                title: 'Full-Stack AI Project Deployment',
                description: 'Build & deploy Next.js + Express + PostgreSQL production app with GitHub Intelligence integration.',
                difficulty: 'Advanced',
                estimatedTime: '2 Weeks',
                completed: false,
                order: 4,
              },
              {
                stage: 'Interview',
                title: 'System Design & Mock Interview Panels',
                description: 'Complete 3 AI mock interview sessions focusing on rate limiters, caching, and STAR behavioral answers.',
                difficulty: 'Advanced',
                estimatedTime: '1 Week',
                completed: false,
                order: 5,
              },
            ],
          },
        },
        include: {
          milestones: { orderBy: { order: 'asc' } },
        },
      });

      // Recalculate progress for initialized default
      const completedCount = roadmap.milestones.filter((m) => m.completed).length;
      const progressPct = Math.round((completedCount / roadmap.milestones.length) * 100);
      roadmap = await prisma.careerRoadmap.update({
        where: { id: roadmap.id },
        data: { progressPct },
        include: { milestones: { orderBy: { order: 'asc' } } },
      });
    }

    return roadmap;
  }

  /**
   * Toggle completion state of a milestone.
   */
  async toggleMilestone(userId: string, milestoneId: string) {
    const milestone = await prisma.roadmapMilestone.findUnique({
      where: { id: milestoneId },
      include: { roadmap: true },
    });

    if (!milestone || milestone.roadmap.userId !== userId) {
      throw new Error('Milestone not found or unauthorized.');
    }

    const newCompleted = !milestone.completed;
    await prisma.roadmapMilestone.update({
      where: { id: milestoneId },
      data: {
        completed: newCompleted,
        completedAt: newCompleted ? new Date() : null,
      },
    });

    // Update overall roadmap progress
    const allMilestones = await prisma.roadmapMilestone.findMany({
      where: { roadmapId: milestone.roadmapId },
    });

    const completedCount = allMilestones.filter((m) => m.completed).length;
    const progressPct = Math.round((completedCount / allMilestones.length) * 100);

    const updatedRoadmap = await prisma.careerRoadmap.update({
      where: { id: milestone.roadmapId },
      data: { progressPct },
      include: { milestones: { orderBy: { order: 'asc' } } },
    });

    if (newCompleted) {
      await activityService.logActivity(
        userId,
        'ROADMAP_TASK_COMPLETED',
        `Completed milestone: ${milestone.title}`,
        { milestoneId, title: milestone.title }
      );
    }

    return updatedRoadmap;
  }
}

export const roadmapService = new RoadmapService();
