import { IJobRepository } from "../interfaces/IJobRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { Job } from "../../business/objects/job";

export class JobRepository implements IJobRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ){
    this.backend = `${this.settings.getSettings().backend}/v0/marketplace`
  }
  getSentJobs(){
    return this.requestRepository.requestWithAuth(`${this.backend}/sent_jobs`, "GET")
  }
  getReceivedJobs(){
    return this.requestRepository.requestWithAuth(`${this.backend}/recvd_jobs`, "GET")
  }
  getJobStatusHistory(job_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}`, "GET")
  }
  // Probably a service? Talks to myself now...
  // sendJob(path: string, landing_zone_id: string, station_id: string){
  //
  // }
  stopJob(job: Job, type: number){
    // Stops a currently running job
  }
  startJob(job: Job, type: number){

  }
  pauseJob(job: Job, type: number){

  }
  hideJob(job_id: string){

  }
  getProcessInfo(job: Job){
    // job_top
  }
  getLogInfo(job: Job){
    // get log info
  }
  getDownloadDirectory(job: Job, file_path: string){
    // job_download
  }
}
