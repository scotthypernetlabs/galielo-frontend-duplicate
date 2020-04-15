import { GetJobFilters, Job } from "../objects/job";
import { ProjectType } from "./IProjectService";

export interface IJobService {
  getJobs(filterOptions?: GetJobFilters): Promise<void>;
  searchJobName(filter: GetJobFilters): Promise<void>;
  getSentJobs(): Promise<void>;
  getReceivedJobs(): Promise<void>;
  updateReceivedJob(job: Job): void;
  updateSentJob(job: Job): void;
  sendJob(
    mid: string,
    fileList: any[],
    directoryName: string,
    stationid: string,
    projectType?: ProjectType
  ): Promise<boolean>;
  beginJob(
    job_id: string,
    job_name: string,
    mid: string,
    stationid: string
  ): Promise<Job>;
  startJob(job_id: string, sentJob: boolean): Promise<Job>;
  stopJob(job_id: string, sentJob: boolean): Promise<Job>;
  pauseJob(job_id: string, sentJob: boolean): Promise<Job>;
  archiveJob(
    job_id: string,
    sentJob: boolean,
    isArchived: boolean
  ): Promise<Job>;
  killJob(job_id: string, sentJob: boolean): Promise<Job>;
  getProcessInfo(job_id: string): void;
  getLogInfo(job_id: string): void;
  getJobResults(job_id: string): void;
  sendStationJob(
    stationid: string,
    fileList: any[],
    directoryName: string,
    projectType?: ProjectType
  ): Promise<boolean>;
}
