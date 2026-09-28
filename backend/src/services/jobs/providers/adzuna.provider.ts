import { env } from '../../../config/env';
import { JobOpportunity, JobQueryParams } from '../../../types/job.types';
import { JobProvider } from './job-provider.interface';

const SKILL_DICTIONARY = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'Python',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'MongoDB',
  'SQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'Azure',
  'GraphQL',
  'REST API',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'Git',
  'Linux',
  'CI/CD',
  'System Design',
  'Data Structures',
  'Algorithms',
  'TensorFlow',
  'Pandas',
  'Microservices',
];

export class AdzunaProvider implements JobProvider {
  public readonly name = 'Adzuna';

  async fetchJobs(params: JobQueryParams): Promise<JobOpportunity[]> {
    const appId = env.ADZUNA_APP_ID || '7648c839';
    const appKey = env.ADZUNA_APP_KEY || '9b6f83468b35f2844ded09aaa14ddf5d';
    const country = 'in';
    const page = 1;

    const query = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: (params.limit || 20).toString(),
      what: params.q || 'Software Engineer',
    });

    if (params.location && params.location.trim() !== '') {
      query.append('where', params.location.trim());
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${query.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Adzuna HTTP error status ${res.status}`);
      }

      const json: any = await res.json();
      if (!json || !Array.isArray(json.results)) {
        return [];
      }

      return json.results.map((item: any, index: number) =>
        this.transformAdzunaItem(item, index)
      );
    } catch (err) {
      clearTimeout(timeoutId);
      return [];
    }
  }

  private transformAdzunaItem(item: any, index: number): JobOpportunity {
    const title = item.title || 'Software Engineer';
    const desc = item.description || '';
    const fullText = `${title} ${desc}`.toLowerCase();

    // Extract relevant skills present in job text
    const extractedSkills = SKILL_DICTIONARY.filter((skill) =>
      fullText.includes(skill.toLowerCase())
    );

    // Default skills if none extracted from excerpt
    const skills =
      extractedSkills.length > 0
        ? extractedSkills
        : ['Software Engineering', 'Problem Solving', 'Git', 'REST API'];

    const isRemote = fullText.includes('remote') || fullText.includes('work from home');
    const isHybrid = fullText.includes('hybrid');
    const remoteType = isRemote ? 'Remote' : isHybrid ? 'Hybrid' : 'On-site';

    const empType =
      item.contract_time === 'full_time'
        ? 'Full-time'
        : item.contract_time === 'part_time'
        ? 'Part-time'
        : 'Full-time';

    return {
      id: item.id ? `adzuna-${item.id}` : `adzuna-${Date.now()}-${index}`,
      title,
      company: item.company?.display_name || 'Tech Organization',
      location: item.location?.display_name || 'Bengaluru, India',
      employmentType: empType,
      remoteType,
      description: desc,
      skills,
      postedAt: item.created || new Date().toISOString(),
      salary: item.salary_min
        ? {
            min: Math.round(item.salary_min),
            max: item.salary_max ? Math.round(item.salary_max) : undefined,
            currency: 'INR',
          }
        : undefined,
      applyUrl: item.redirect_url || 'https://www.adzuna.in',
      source: 'Adzuna',
    };
  }
}

export const adzunaProvider = new AdzunaProvider();
