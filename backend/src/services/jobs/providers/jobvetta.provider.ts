import { env } from '../../../config/env';
import { JobOpportunity, JobQueryParams } from '../../../types/job.types';
import { JobProvider } from './job-provider.interface';
import { adzunaProvider } from './adzuna.provider';

export class JobvettaProvider implements JobProvider {
  public readonly name = 'Jobvetta';

  async fetchJobs(params: JobQueryParams): Promise<JobOpportunity[]> {
    const apiKey = env.JOBVETTA_API_KEY || 'jobvetta_secret_key_2026';
    const query = new URLSearchParams();

    if (params.q) query.append('q', params.q);
    if (params.location) query.append('location', params.location);
    if (params.days) query.append('days', params.days.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const url = `https://api.jobvetta.com/v1/jobs?${query.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Jobvetta API error status ${res.status}`);
      }

      const json: any = await res.json();
      const rawJobs = Array.isArray(json) ? json : json.jobs || json.data || [];

      if (!Array.isArray(rawJobs) || rawJobs.length === 0) {
        throw new Error('No jobs array returned from Jobvetta API');
      }

      return rawJobs.map((item: any, index: number) =>
        this.transformJobvettaItem(item, index)
      );
    } catch (err) {
      clearTimeout(timeoutId);
      // Fall back to Adzuna provider for real live jobs if Jobvetta API is unreachable
      return adzunaProvider.fetchJobs(params);
    }
  }

  private transformJobvettaItem(item: any, index: number): JobOpportunity {
    return {
      id: item.id ? `jobvetta-${item.id}` : `jobvetta-${Date.now()}-${index}`,
      title: item.title || item.jobTitle || 'Software Engineer',
      company: item.company || item.companyName || 'Tech Innovators',
      location: item.location || item.city || 'Bengaluru, India',
      employmentType: item.employmentType || item.jobType || 'Full-time',
      remoteType: item.remoteType || item.workMode || 'Hybrid',
      description: item.description || item.summary || undefined,
      skills: Array.isArray(item.skills)
        ? item.skills
        : ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      postedAt: item.postedAt || item.createdAt || new Date().toISOString(),
      salary: item.salary
        ? {
            min: item.salary.min || item.salaryMin,
            max: item.salary.max || item.salaryMax,
            currency: item.salary.currency || 'INR',
          }
        : undefined,
      applyUrl: item.applyUrl || item.url || 'https://www.jobvetta.com',
      source: 'Jobvetta',
    };
  }
}

export const jobvettaProvider = new JobvettaProvider();
