import { IJob, IJobStatusHistory } from "../../business/objects/job";

export interface IJobRepository {
  getSentJobs(): Promise<IJob[]>;
  getReceivedJobs(): Promise<IJob[]>;
  getJobStatusHistory(job_id: string): Promise<IJobStatusHistory>;
  stopJob(job: IJob, type: number): void;
  startJob(job: IJob, type: number): void;
  pauseJob(job: IJob, type: number): void; 
  hideJob(job_id: string): void;
  getProcessInfo(job: IJob): void;
  getLogInfo(job: IJob): void;
  getDownloadDirectory(job: IJob, file_path: string): void;
}
