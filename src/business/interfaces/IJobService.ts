import {Job} from "../objects/job";

export interface IJobService {
  getSentJobs(): Promise<void>;
  getReceivedJobs(): Promise<void>;
  getJobStatusHistory(job_id: string): Promise<void>;
  updateReceivedJob(job: Job): void;
  updateSentJob(job: Job): void;
  sendJob(mid: string, midFriend: string, fileList: FileList): void;
}
