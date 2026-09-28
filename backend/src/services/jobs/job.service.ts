import { prisma } from '../../config/database';
import { JobOpportunity, JobQueryParams, RecommendedJobsResponse } from '../../types/job.types';
import { JobProvider } from './providers/job-provider.interface';
import { jobvettaProvider } from './providers/jobvetta.provider';
import { adzunaProvider } from './providers/adzuna.provider';

export class JobService {
  private providers: Map<string, JobProvider> = new Map();

  constructor() {
    this.registerProvider(jobvettaProvider);
    this.registerProvider(adzunaProvider);
  }

  public registerProvider(provider: JobProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  public getProvider(providerName: string): JobProvider | undefined {
    return this.providers.get(providerName.toLowerCase());
  }

  /**
   * Fetches raw or filtered jobs from the active job provider (Jobvetta).
   */
  async getJobs(params: JobQueryParams = {}, providerName: string = 'jobvetta'): Promise<JobOpportunity[]> {
    const provider = this.getProvider(providerName) || jobvettaProvider;
    let jobs = await provider.fetchJobs(params);

    // Apply secondary filters (remoteType, employmentType, search)
    if (params.remote && params.remote.toLowerCase() !== 'all') {
      const modeLower = params.remote.toLowerCase();
      jobs = jobs.filter((j) => (j.remoteType || '').toLowerCase().includes(modeLower));
    }

    if (params.employmentType && params.employmentType.toLowerCase() !== 'all') {
      const typeLower = params.employmentType.toLowerCase();
      jobs = jobs.filter((j) => (j.employmentType || '').toLowerCase().includes(typeLower));
    }

    return jobs;
  }

  /**
   * Calculates personalized match score using user's resume, skills, and target role.
   */
  async getRecommendedJobs(
    userId: string,
    params: JobQueryParams = {}
  ): Promise<RecommendedJobsResponse> {
    // 1. Fetch user skills & target role from Profile, ResumeAnalysis, and CareerRoadmap
    const [profile, latestAnalysis, activeRoadmap] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.resumeAnalysis.findFirst({
        where: { resumeVersion: { resume: { userId } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.careerRoadmap.findFirst({
        where: { userId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const targetRole =
      profile?.targetRole || latestAnalysis?.targetRole || activeRoadmap?.targetRole || 'Software Engineer';

    // Collect all user known skills
    const userSkillSet = new Set<string>();
    if (profile?.skills) {
      profile.skills.forEach((s) => userSkillSet.add(s.trim().toLowerCase()));
    }

    if (latestAnalysis?.extractedData && typeof latestAnalysis.extractedData === 'object') {
      const data: any = latestAnalysis.extractedData;
      if (Array.isArray(data.skills)) {
        data.skills.forEach((s: any) => {
          if (typeof s === 'string') userSkillSet.add(s.trim().toLowerCase());
          else if (s?.name) userSkillSet.add(s.name.trim().toLowerCase());
        });
      }
    }

    if (activeRoadmap?.currentSkills) {
      activeRoadmap.currentSkills.forEach((s) => userSkillSet.add(s.trim().toLowerCase()));
    }

    // Default fallback skills if user has no uploaded resume or profile skills yet
    if (userSkillSet.size === 0) {
      ['javascript', 'typescript', 'react', 'node.js', 'sql', 'python', 'java', 'git'].forEach((s) =>
        userSkillSet.add(s)
      );
    }

    const userSkillsList = Array.from(userSkillSet);

    // 2. Fetch jobs for the user's target role or search query
    const searchParams: JobQueryParams = {
      q: params.q || targetRole,
      location: params.location,
      limit: params.limit || 25,
    };

    const allJobs = await this.getJobs(searchParams);

    // 3. Score each job against user's skills & target role
    const missingSkillsFrequencyMap = new Map<string, number>();

    const scoredJobs: JobOpportunity[] = allJobs.map((job) => {
      const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
      const titleLower = job.title.toLowerCase();
      const descLower = (job.description || '').toLowerCase();

      // Determine matching vs missing skills
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];

      jobSkillsLower.forEach((skill) => {
        const isMatched = Array.from(userSkillSet).some(
          (uSkill) => uSkill.includes(skill) || skill.includes(uSkill)
        );
        if (isMatched) {
          matchedSkills.push(this.capitalizeSkill(skill));
        } else {
          missingSkills.push(this.capitalizeSkill(skill));
          const count = missingSkillsFrequencyMap.get(skill) || 0;
          missingSkillsFrequencyMap.set(skill, count + 1);
        }
      });

      // Role relevance bonus
      let score = 30; // Base score
      const roleLower = targetRole.toLowerCase();

      if (
        (roleLower.includes('software') && titleLower.includes('software')) ||
        (roleLower.includes('frontend') && (titleLower.includes('frontend') || titleLower.includes('react'))) ||
        (roleLower.includes('backend') && (titleLower.includes('backend') || titleLower.includes('node') || titleLower.includes('java'))) ||
        (roleLower.includes('full') && titleLower.includes('full')) ||
        (roleLower.includes('data') && titleLower.includes('data'))
      ) {
        score += 30;
      } else {
        score += 15;
      }

      // Skill match percentage ratio
      if (jobSkillsLower.length > 0) {
        const matchRatio = matchedSkills.length / jobSkillsLower.length;
        score += Math.round(matchRatio * 35);
      } else {
        score += 25;
      }

      // Clamp score between 60% and 98%
      const finalScore = Math.min(98, Math.max(60, score));

      return {
        ...job,
        matchScore: finalScore,
        matchedSkills,
        missingSkills,
      };
    });

    // Sort jobs by matchScore descending
    scoredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // Top recommended jobs (match score >= 75%)
    const recommendedJobs = scoredJobs.filter((j) => (j.matchScore || 0) >= 75);

    // Aggregate top missing skills for the Learning Hub connection
    const sortedMissingSkills = Array.from(missingSkillsFrequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill]) => this.capitalizeSkill(skill));

    return {
      success: true,
      count: scoredJobs.length,
      targetRole,
      userSkills: userSkillsList.map(this.capitalizeSkill),
      recommendedJobs: recommendedJobs.length > 0 ? recommendedJobs : scoredJobs.slice(0, 10),
      allJobs: scoredJobs,
      topMissingSkills: sortedMissingSkills.length > 0 ? sortedMissingSkills : ['Kubernetes', 'AWS', 'Docker', 'System Design', 'PostgreSQL'],
    };
  }

  /**
   * Helper to format skill strings cleanly
   */
  private capitalizeSkill(skill: string): string {
    if (!skill) return '';
    if (skill.toLowerCase() === 'sql') return 'SQL';
    if (skill.toLowerCase() === 'aws') return 'AWS';
    if (skill.toLowerCase() === 'gcp') return 'GCP';
    if (skill.toLowerCase() === 'dsa') return 'DSA';
    if (skill.toLowerCase() === 'css3') return 'CSS3';
    if (skill.toLowerCase() === 'html5') return 'HTML5';
    return skill.charAt(0).toUpperCase() + skill.slice(1);
  }
}

export const jobService = new JobService();
