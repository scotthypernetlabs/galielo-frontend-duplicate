import {Job, GetJobFilters} from "../objects/job";

export interface IJobService {
  getJobs(filterOptions?: GetJobFilters): Promise<void>;
  getSentJobs(): Promise<void>;
  getReceivedJobs(): Promise<void>;
  updateReceivedJob(job: Job): void;
  updateSentJob(job: Job): void;
  sendJob(mid: string, fileList: any[], directoryName:string, stationid: string): Promise<boolean>;
  beginJob(job_id: string, job_name: string, mid: string, stationid: string): Promise<Job>;
  startJob(job_id: string): Promise<Job>;
  stopJob(job_id: string): Promise<Job>;
  pauseJob(job_id: string): Promise<Job>;
  getProcessInfo(job_id: string): void;
  getLogInfo(job_id: string): void;
  getJobResults(job_id: string): void;
  sendStationJob(stationid: string, fileList: any[], directoryName: string): Promise<boolean>;
}
