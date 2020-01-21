import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { Job, JobStatus, GetJobFilters } from "../objects/job";
import { Logger } from "../../components/Logger";
import store from "../../store/store";
import {receiveReceivedJobs, receiveSentJobs, updateSentJob, receiveJobs} from "../../actions/jobActions";
// @ts-ignore
import * as Tar from 'tarts';
import { openNotificationModal } from "../../actions/modalActions";
import { Dictionary } from "../objects/dictionary";
import { UserFilterOptions, User } from "../objects/user";
import { IUserRepository } from "../../data/interfaces/IUserRepository";
import { receiveUsers } from "../../actions/userActions";


export class JobService implements IJobService {
  constructor(
    protected jobRepository: IJobRepository,
    protected userRepository: IUserRepository,
    protected logService: Logger
  ){}

  handleError(err:Error){
    store.dispatch(openNotificationModal("Notifications", err.message));
  }
  getJobs(filterOptions?: GetJobFilters){
    return this.jobRepository.getJobs(filterOptions)
              .then(async(jobs: Job[]) => {
                let current_user = store.getState().users.currentUser;
                let receivedJobs:Dictionary<Job> = {};
                let sentJobs:Dictionary<Job> = {};
                let usersList:Dictionary<boolean> = {};
                jobs.forEach(job => {
                  if(job.launch_pad === current_user.user_id){
                    sentJobs[job.id] = job;
                  }
                  if(current_user.mids.indexOf(job.landing_zone) >= 0){
                    receivedJobs[job.id] = job;
                    usersList[job.launch_pad] = true;
                  }
                })
                if(Object.keys(usersList).length > 0){
                  let users:User[] = await this.userRepository.getUsers(new UserFilterOptions(Object.keys(usersList)));
                  store.dispatch(receiveUsers(users));
                }
                store.dispatch(receiveSentJobs(sentJobs));
                store.dispatch(receiveReceivedJobs(receivedJobs));
              })
              .catch((err: Error) => {
                this.logService.log(err);
              })
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

  updateReceivedJob(job: Job) {
    store.dispatch(receiveReceivedJobs({[job.id]: job}));
  }

  updateSentJob(job: Job) {
    store.dispatch(receiveSentJobs({[job.id]: job}));
  }

  protected getUploadUrl(mid: string, midFriend: string, jobName: string) {
    return this.jobRepository.getUploadUrl(mid, midFriend, jobName)
              .catch((err:Error) => {
                this.handleError(err);
              })
  }

  protected uploadFile(url: string, files: any[]) {
    return this.jobRepository.uploadFiles(url, files)
              .catch((err:Error) => {
                this.handleError(err);
              })
  }

  protected sendUploadCompleted(mid: string, midFriend: string, jobName: string, stationid: string) {
    return this.jobRepository.sendUploadCompleted(mid, midFriend, jobName, stationid)
              .catch((err:Error) => {
                this.handleError(err);
              })
  }

  protected checkForDockerfile(fileList:any[]): boolean {
    fileList.forEach( (fileObject: any) => {
      if(fileObject.name === 'Dockerfile'){
        return true;
      }
    })
    return false;
  }

  async sendJob(mid: string, midFriend: string, fileList: any[], directoryName:string, stationid: string): Promise<void> {
    console.log('directoryName', directoryName);
    // Check directory for Dockerfile
    this.checkForDockerfile(fileList);
    // Send request to get a URL
    const url = await this.getUploadUrl(mid, midFriend, directoryName);
    console.log('upload URL', url);
    if(url){
      // Send folder
      await this.uploadFile(url.location, fileList);
      // Tell server we're done
      let jobObject = await this.sendUploadCompleted(mid, midFriend, url.filename, stationid);
      console.log(jobObject);
      if(jobObject){
        store.dispatch(updateSentJob(jobObject));
        let startedJob = await this.beginJob(jobObject.id, jobObject.name, mid);
        if(startedJob){
          store.dispatch(updateSentJob(startedJob));
        }
      }
    }
  }
  beginJob(job_id: string, job_name: string, mid: string){
    return this.jobRepository.beginJob(job_id, job_name, mid)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  startJob(job_id: string){
    console.log("Starting job");
    return this.jobRepository.startJob(job_id)
      .then((job: Job) => {
        store.dispatch(receiveSentJobs({[job.id]: job}))
      })
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  stopJob(job_id: string){
    console.log("Stopping job");
    return this.jobRepository.stopJob(job_id)
      .then((job: Job) => {
        store.dispatch(receiveSentJobs({[job.id]: job}))
      })
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  pauseJob(job_id: string){
    console.log("Pausing job");
    return this.jobRepository.pauseJob(job_id)
      .then((job: Job) => {
        store.dispatch(receiveSentJobs({[job.id]: job}))
      })
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  getProcessInfo(job_id: string){
    return this.jobRepository.getProcessInfo(job_id)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  getLogInfo(job_id: string){
    return this.jobRepository.getLogInfo(job_id)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
}

interface FileObject {
  name: string;
  content: ArrayBuffer | string
}
