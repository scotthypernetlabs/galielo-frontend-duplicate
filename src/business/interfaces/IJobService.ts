export interface IJobService {
  getSentJobs(): Promise<void>;
  getReceivedJobs(): Promise<void>;
  getJobStatusHistory(job_id: string): Promise<void>;
}
