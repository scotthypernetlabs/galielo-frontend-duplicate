import {Job, GetJobFilters} from "../objects/job";

export interface IJobService {
  getJobs(filterOptions?: GetJobFilters): Promise<void>;
  getSentJobs(): Promise<void>;
  getReceivedJobs(): Promise<void>;
  updateReceivedJob(job: Job): void;
  updateSentJob(job: Job): void;
  sendJob(mid: string, midFriend: string, fileList: any[], directoryName:string, stationid: string): void;
  beginJob(job_id: string, job_name: string, mid: string, stationid: string): void;
  startJob(job_id: string): void;
  stopJob(job_id: string): void;
  pauseJob(job_id: string): void;
  getProcessInfo(job_id: string): void;
  getLogInfo(job_id: string): void;
}
