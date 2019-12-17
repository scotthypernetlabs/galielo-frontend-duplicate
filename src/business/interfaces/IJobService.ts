export interface IJobService {
  getSentJobs(): void;
  getReceivedJobs(): void;
  getJobStatusHistory(job_id: string): void;
}
