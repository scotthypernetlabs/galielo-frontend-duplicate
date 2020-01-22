import { IJobRepository } from "../interfaces/IJobRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { Job, JobStatus, GetJobFilters } from "../../business/objects/job";
import { IJob } from "../../api/objects/job";

export interface GetUploadUrlResponse {
  location: string; // url
  filename: string;
}

export interface SendUploadCompletedResponse {
  job: IJob;
}

export interface GetJobResponse {
  jobs: IJob[];
}

function generateJobUrl(backend_url: string, filterOptions: GetJobFilters){
  let baseUrl = `${backend_url}/jobs`;
  // only keys that are set
  let keys = Object.keys(filterOptions).filter( (key:keyof GetJobFilters) => filterOptions[key]);
  if(keys.length === 0){
    return baseUrl;
  }else{
    let appendedUrl:string ='?';
    keys.forEach((key:keyof GetJobFilters, idx) => {
      if(idx > 0){
        appendedUrl += '&';
      }
      switch(key){
        case 'page':
          appendedUrl += `${key}=${filterOptions[key]}`;
          break;
        case 'items':
          appendedUrl += `${key}=${filterOptions[key]}`;
          break;
        default:
        // handles all instances where the key is a string[]
          filterOptions[key].forEach((value, idx) => {
            if(idx > 0){
              appendedUrl += '&';
            }
            appendedUrl += `${key}=${value}`;
          })
          break;
      }
    })
    return baseUrl + appendedUrl;
  }

}

export function convertToBusinessJob(job: IJob){
  let statusHistory = job.status_history.map(status_history => {
    return new JobStatus(status_history.jobid, status_history.jobstatusid, status_history.status, status_history.timestamp);
  })
  return new Job(job.container,
    job.jobid, job.last_updated, job.name, job.oaid, job.pay_interval,
    job.pay_status, job.receiverid, job.userid, job.state, job.stationid,
    job.status, statusHistory, job.time_created, job.total_runtime)
}

export class JobRepository implements IJobRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ){
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`
  }
  async getJobs(filterOptions?: GetJobFilters){
    let url = generateJobUrl(this.backend, filterOptions);
    console.log(url);
    let response:GetJobResponse = await this.requestRepository.requestWithAuth(url,"GET")
    return response.jobs.map(job => {
      return convertToBusinessJob(job);
    })
    // return jobs;
  }
  getSentJobs(){
    return this.requestRepository.requestWithAuth(`${this.backend}/sent_jobs`, "GET")
  }
  getReceivedJobs(){
    return this.requestRepository.requestWithAuth(`${this.backend}/recvd_jobs`, "GET")
  }
  // Probably a service? Talks to myself now...
  // sendJob(path: string, landing_zone_id: string, station_id: string){
  //
  // }
  async stopJob(job_id: string){
    // Stops a currently running job
    let response:{job: IJob} = await this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}/stop`, 'PUT')
    return convertToBusinessJob(response.job);
  }
  async startJob(job_id: string){
    let response:{job: IJob} = await this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}/start`, 'PUT')
    return convertToBusinessJob(response.job);
  }
  async pauseJob(job_id: string){
    let response:{job: IJob} = await this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}/pause`, 'PUT')
    return convertToBusinessJob(response.job);
  }
  hideJob(job_id: string){

  }
  getProcessInfo(job_id: string){
    // job_top
    return this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}/top`, 'GET')
  }
  getLogInfo(job_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}/logs`, 'GET')
  }
  getDownloadDirectory(job: Job, file_path: string){
    // job_download
  }
  async getUploadUrl(mid: string, mid_friend: string, job_to_share: string): Promise<GetUploadUrlResponse> {
    console.log(`mid=${mid}, mid_friend =${mid_friend}, job_to_share=${job_to_share}`);
    let object:GetUploadUrlResponse = await this.requestRepository.requestWithAuth(`${this.backend}/job/upload_request`, "GET");
    return object;
  }
  async uploadFiles(url: string, files: any[]) {
    console.log("Sending request to", url);
    const fileReader = new FileReader();
    let promiseArray = files.map( async(file) => {
      // console.log("File to send www", file.fileObject);
      //
      // fileReader.onload = () => {
        // return this.requestRepository.requestGoogle(url, "PUT", fileReader.result);
        return this.requestRepository.requestGoogle(url, "PUT", file);
      // }

      // fileReader.readAsText(file.fileObject);
    })
    return Promise.all(promiseArray);
  }
  async sendUploadCompleted(mid: string, mid_friend: string, filename: string, stationid: string) {
    let response:SendUploadCompletedResponse = await this.requestRepository.requestWithAuth(`${this.backend}/jobs`, "POST", {destination_mid: mid_friend, filename, stationid});
    return convertToBusinessJob(response.job);
  }
  async beginJob(job_id: string, job_name: string, mid: string){
    let response:SendUploadCompletedResponse = await this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}/run`, 'PUT', {job_id, job_name, mid});
    return convertToBusinessJob(response.job);
  }
}
