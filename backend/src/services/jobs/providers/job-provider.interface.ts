import { JobOpportunity, JobQueryParams } from '../../../types/job.types';

export interface JobProvider {
  name: string;
  fetchJobs(params: JobQueryParams): Promise<JobOpportunity[]>;
}
