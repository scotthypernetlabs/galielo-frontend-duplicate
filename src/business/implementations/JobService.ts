import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { IJob, IJobStatusHistory } from "../objects/job";
import { Logger } from "../../components/Logger";

export class JobService implements IJobService {
  constructor(
    protected jobRepository: IJobRepository,
    protected logService: Logger
  ){

  }

  getSentJobs(){
    return this.jobRepository.getSentJobs()
      .then((jobs: IJob[]) => {

      })
      .catch((err: Error) => {
        this.logService.log(err);
      })
  }
  getReceivedJobs(){
    return this.jobRepository.getReceivedJobs()
      .then((jobs: IJob[]) => {

      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
  getJobStatusHistory(job_id: string){
    return this.jobRepository.getJobStatusHistory(job_id)
      .then((status_history: IJobStatusHistory) => {

      })
      .catch((err: Error) => {
        this.logService.log(err);
      })
  }
}
