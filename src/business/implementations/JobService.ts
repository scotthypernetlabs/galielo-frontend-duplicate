import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { Job, JobStatusHistory } from "../objects/job";
import { Logger } from "../../components/Logger";

export class JobService implements IJobService {
  constructor(
    protected jobRepository: IJobRepository,
    protected logService: Logger
  ){

  }

  getSentJobs(){
    return this.jobRepository.getSentJobs()
      .then((jobs: Job[]) => {

      })
      .catch((err: Error) => {
        this.logService.log(err);
      })
  }
  getReceivedJobs(){
    return this.jobRepository.getReceivedJobs()
      .then((jobs: Job[]) => {

      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
  getJobStatusHistory(job_id: string){
    return this.jobRepository.getJobStatusHistory(job_id)
      .then((status_history: JobStatusHistory) => {

      })
      .catch((err: Error) => {
        this.logService.log(err);
      })
  }
}
