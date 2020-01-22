import { Job, JobStatus, GetJobFilters } from "../../business/objects/job";
import { GetUploadUrlResponse } from "../implementations/jobRepository";

export interface IJobRepository {
  getJobs(filterOptions: GetJobFilters): Promise<Job[]>;
  getSentJobs(): Promise<Job[]>;
  getReceivedJobs(): Promise<Job[]>;
  stopJob(job_id: string): Promise<Job>;
  startJob(job_id: string): Promise<Job>;
  pauseJob(job_id: string): Promise<Job>;
  hideJob(job_id: string): void;
  getProcessInfo(job_id: string): Promise<boolean>;
  getLogInfo(job_id: string): Promise<boolean>;
  getDownloadDirectory(job: Job, file_path: string): void;
  getUploadUrl(mid: string, mid_friend: string, job_to_share: string): Promise<GetUploadUrlResponse>;
  uploadFiles(url: string, files: any[], dest_mid: string): Promise<any>;
  sendUploadCompleted(mid: string, mid_friend: string, job_to_share: string, stationid: string): Promise<Job>;
  beginJob(job_id: string, job_name: string, mid: string): Promise<Job>;
}
