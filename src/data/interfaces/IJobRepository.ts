import { Job, JobStatusHistory } from "../../business/objects/job";

export interface IJobRepository {
  getSentJobs(): Promise<Job[]>;
  getReceivedJobs(): Promise<Job[]>;
  getJobStatusHistory(job_id: string): Promise<JobStatusHistory>;
  stopJob(job: Job, type: number): void;
  startJob(job: Job, type: number): void;
  pauseJob(job: Job, type: number): void;
  hideJob(job_id: string): void;
  getProcessInfo(job: Job): void;
  getLogInfo(job: Job): void;
  getDownloadDirectory(job: Job, file_path: string): void;
}
