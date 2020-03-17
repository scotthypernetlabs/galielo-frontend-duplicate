import { GetJobFilters, Job, JobStatus } from "../../business/objects/job";
import { GetUploadUrlResponse } from "../implementations/jobRepository";

export interface IJobRepository {
  getJobs(filterOptions: GetJobFilters): Promise<Job[]>;
  getSentJobs(): Promise<Job[]>;
  getReceivedJobs(): Promise<Job[]>;
  stopJob(job_id: string): Promise<Job>;
  startJob(job_id: string): Promise<Job>;
  pauseJob(job_id: string): Promise<Job>;
  archiveJob(job_id: string, isArchived: boolean): Promise<Job>;
  hideJob(job_id: string): void;
  getProcessInfo(job_id: string): Promise<boolean>;
  getLogInfo(job_id: string): Promise<boolean>;
  getUploadUrl(
    mid: string,
    mid_friend: string,
    job_to_share: string
  ): Promise<GetUploadUrlResponse>;
  sendUploadCompleted(
    mid: string,
    mid_friend: string,
    job_to_share: string,
    stationid: string
  ): Promise<Job>;
  beginJob(job_id: string, job_name: string, mid: string): Promise<Job>;
  getJobResults(job_id: string): Promise<GetUploadUrlResponse>;
  downloadJobResult(
    job_id: string,
    filename: string,
    path: string,
    nonce: string
  ): any;
  sendJobDownComplete(
    job_id: string,
    results_to_share: string
  ): Promise<boolean>;
}
