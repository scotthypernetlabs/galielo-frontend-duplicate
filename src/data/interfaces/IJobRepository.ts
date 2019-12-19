import { IJob, IJobStatusHistory } from "../../business/objects/job";

export interface IJobRepository {
  getSentJobs(): Promise<IJob[]>;
  getReceivedJobs(): Promise<IJob[]>;
  getJobStatusHistory(job_id: string): Promise<IJobStatusHistory>;
}
