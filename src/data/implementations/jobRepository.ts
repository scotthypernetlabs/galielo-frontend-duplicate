import { IJobRepository } from "../interfaces/IJobRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";

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
      .then((response: any) => {
        return response;
      })
  }
  getReceivedJobs(){
    return this.requestRepository.requestWithAuth(`${this.backend}/recvd_jobs`, "GET")
      .then((response: any) => {
        return response;
      })
  }
  getJobStatusHistory(job_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/jobs/${job_id}`, "GET")
      .then((response: any) => {
        return response;
      })
  }
}
