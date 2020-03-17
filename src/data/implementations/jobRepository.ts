import {
  EJobRunningStatus,
  EJobStatus,
  EPaymentStatus,
  GetJobFilters,
  Job,
  JobStatus
} from "../../business/objects/job";
import { IJob } from "../../api/objects/job";
import { IJobRepository } from "../interfaces/IJobRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { TypedEvent } from "../../business/objects/TypedEvent";

export interface GetUploadUrlResponse {
  // location: string; // url
  // filename: string;
  files: UploadUrl[];
}

export interface UploadUrl {
  filename: string;
  path: string;
  nonce: string;
}

export interface SendUploadCompletedResponse {
  job: IJob;
}

export interface GetJobResponse {
  jobs: IJob[];
}

function generateJobUrl(backend_url: string, filterOptions: GetJobFilters) {
  const baseUrl = `${backend_url}/jobs`;
  // only keys that are set
  const keys = Object.keys(filterOptions).filter(
    (key: keyof GetJobFilters) => filterOptions[key]
  );
  if (keys.length === 0) {
    return baseUrl;
  } else {
    let appendedUrl: string = "?";
    keys.forEach((key: keyof GetJobFilters, idx) => {
      if (idx > 0) {
        appendedUrl += "&";
      }
      switch (key) {
        case "page":
          appendedUrl += `${key}=${filterOptions[key]}`;
          break;
        case "items":
          appendedUrl += `${key}=${filterOptions[key]}`;
          break;
        default:
          // handles all instances where the key is a string[]
          filterOptions[key].forEach((value, idx) => {
            if (idx > 0) {
              appendedUrl += "&";
            }
            appendedUrl += `${key}=${value}`;
          });
          break;
      }
    });
    return baseUrl + appendedUrl;
  }
}

export function convertToBusinessJob(job: IJob) {
  const statusHistory = job.status_history.map(status_history => {
    return new JobStatus(
      status_history.jobid,
      status_history.jobstatusid,
      status_history.status,
      status_history.timestamp
    );
  });
  return new Job(
    job.container,
    job.jobid,
    job.last_updated,
    job.name,
    job.oaid,
    job.pay_interval,
    job.pay_status,
    job.receiverid,
    job.userid,
    job.state,
    job.stationid,
    job.status,
    statusHistory,
    job.time_created,
    job.total_runtime,
    job.archived
  );
}

export class JobRepository implements IJobRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }
  async getJobs(filterOptions?: GetJobFilters) {
    const url = generateJobUrl(this.backend, filterOptions);
    const response: GetJobResponse = await this.requestRepository.requestWithAuth(
      url,
      "GET"
    );
    return response.jobs.map(job => {
      return convertToBusinessJob(job);
    });
    // return jobs;
  }
  getSentJobs() {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/sent_jobs`,
      "GET"
    );
  }
  getReceivedJobs() {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/recvd_jobs`,
      "GET"
    );
  }
  // Probably a service? Talks to myself now...
  // sendJob(path: string, landing_zone_id: string, station_id: string){
  //
  // }
  async stopJob(job_id: string) {
    // Stops a currently running job
    const response: {
      job: IJob;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/stop`,
      "PUT"
    );
    return convertToBusinessJob(response.job);
  }
  async startJob(job_id: string) {
    const response: {
      job: IJob;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/start`,
      "PUT"
    );
    return convertToBusinessJob(response.job);
  }
  async pauseJob(job_id: string) {
    const response: {
      job: IJob;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/pause`,
      "PUT"
    );
    return convertToBusinessJob(response.job);
  }
  async archiveJob(job_id: string, isArchived: boolean) {
    const response: {
      job: IJob;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}`,
      "PUT",
      { archived: isArchived }
    );
    return convertToBusinessJob(response.job);
  }
  async killJob(job_id: string) {
    const response: {
      job: IJob;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/kill`,
      "PUT"
    );
    return convertToBusinessJob(response.job);
  }
  getProcessInfo(job_id: string) {
    // job_top
    return this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/top`,
      "GET"
    );
  }
  getLogInfo(job_id: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/logs`,
      "GET"
    );
  }
  async getUploadUrl(
    mid: string,
    mid_friend: string,
    job_to_share: string
  ): Promise<GetUploadUrlResponse> {
    const object: GetUploadUrlResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/job/upload_request`,
      "GET"
    );
    return object;
  }
  async sendUploadCompleted(
    mid: string,
    mid_friend: string,
    filename: string,
    stationid: string
  ) {
    const response: SendUploadCompletedResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs`,
      "POST",
      { destination_mid: mid_friend, filename, stationid }
    );
    return convertToBusinessJob(response.job);
  }
  async beginJob(job_id: string, job_name: string, mid: string) {
    const response: SendUploadCompletedResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/run`,
      "PUT",
      { job_id, job_name, mid }
    );
    return convertToBusinessJob(response.job);
  }
  async getJobResults(job_id: string) {
    const response: GetUploadUrlResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/results`,
      "GET"
    );
    // let response = await this.requestRepository.requestWithAuth(`${this.backend}/dummy/jobs/${job_id}/results`, 'GET')
    return response;
  }
  async downloadJobResult(
    job_id: string,
    filename: string,
    path: string,
    nonce: string
  ) {
    let url = `${this.backend}/jobs/${job_id}/results`;
    if (filename.length > 0 || path.length > 0) {
      url += "?";
      if (filename.length > 0) {
        url += `filename=${filename}`;
      }
      if (path.length > 0) {
        url += `path=${path}`;
      }
      if (nonce.length > 0) {
        url += `&nonce=${nonce}`;
      }
    }
    if (url.includes("nonce")) {
      const element = document.createElement("a");
      element.href = url;
      element.download = filename;
      element.click();
    } else {
      throw Error("Failed to download results");
    }
    // let response:any = await this.requestRepository.downloadResultFromServer(url, 'GET',filename)
    // let response :any = await this.requestRepository.requestWithAuth(url, 'GET')
    // return response;
  }
  async sendJobDownComplete(job_id: string, results_to_share: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/${job_id}/results/download_complete`,
      "PUT",
      { results_to_share }
    );
  }
}
