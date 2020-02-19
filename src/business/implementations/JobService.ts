import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { Job, JobStatus, GetJobFilters, UploadObjectContainer } from "../objects/job";
import { Logger } from "../../components/Logger";
import store from "../../store/store";
import {receiveReceivedJobs, receiveSentJobs, updateSentJob, receiveJobs} from "../../actions/jobActions";
import { openNotificationModal, openDockerWizard } from "../../actions/modalActions";
import { Dictionary } from "../objects/dictionary";
import { UserFilterOptions, User } from "../objects/user";
import { IUserRepository } from "../../data/interfaces/IUserRepository";
import { receiveUsers } from "../../actions/userActions";
import { GetMachinesFilter, Machine } from "../objects/machine";
import { IMachineRepository } from "../../data/interfaces/IMachineRepository";
import { receiveMachines } from "../../actions/machineActions";
import { IRequestRepository } from "../../data/interfaces/IRequestRepository";
import { GetUploadUrlResponse, UploadUrl } from "../../data/implementations/jobRepository";
import { IProjectRepository } from "../../data/interfaces/IProjectRepository";
import { PackagedFile } from "../objects/packagedFile";
import { updateMachineUploadProgress } from "../../actions/progressActions";


export class JobService implements IJobService {
  constructor(
    protected jobRepository: IJobRepository,
    protected userRepository: IUserRepository,
    protected machineRepository: IMachineRepository,
    protected requestRepository: IRequestRepository,
    protected projectRepository: IProjectRepository,
    protected logService: Logger
  ){}

  handleError(err:Error){
    store.dispatch(openNotificationModal("Notifications", 'An error has occurred'));
    // store.dispatch(openNotificationModal("Notifications", err.message));
  }
  getJobs(filterOptions?: GetJobFilters){
    return this.jobRepository.getJobs(filterOptions)
              .then(async(jobs: Job[]) => {
                let current_user = store.getState().users.currentUser;
                let receivedJobs:Dictionary<Job> = {};
                let sentJobs:Dictionary<Job> = {};
                let usersList:Dictionary<boolean> = {};
                let machinesList:Dictionary<boolean> = {};
                console.log("jobs in service", jobs);
                jobs.forEach(job => {
                  if(job.launch_pad === current_user.user_id){
                    sentJobs[job.id] = job;
                    machinesList[job.landing_zone] = true;
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
                if(Object.keys(machinesList).length > 0){
                  let machines:Machine[] = await this.machineRepository.getMachines(new GetMachinesFilter(Object.keys(machinesList)));
                  store.dispatch(receiveMachines(machines));
                }
                console.log("Sent jobs", sentJobs);
                console.log("Received jobs", receivedJobs);
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

  protected sendUploadCompleted(mid: string, midFriend: string, jobName: string, stationid: string) {
    return this.jobRepository.sendUploadCompleted(mid, midFriend, jobName, stationid)
              .catch((err:Error) => {
                this.handleError(err);
              })
  }

  protected checkForDockerfile(fileList:any[]): boolean {
    for(let i = 0; i < fileList.length; i++){
      if(fileList[i].fileObject.name === 'Dockerfile'){
        return true;
      }
    }
    return false;
  }

  async sendJob(mid: string, fileList: PackagedFile[], directoryName:string, stationid: string): Promise<boolean> {
    console.log('directoryName', directoryName);
    console.log("fileList", fileList);
    // Check directory for Dockerfile
    if(!this.checkForDockerfile(fileList)){
      store.dispatch(openDockerWizard(directoryName, fileList))
      return;
    }
    // Create Project
    let project = await this.projectRepository.createProject(directoryName, '');
    console.log("Project made", project);
    if(project){
      // Upload files
      let uploadContainer = new UploadObjectContainer(project.id, [], 0, 0, null, mid)
      let uploadedFiles = await this.projectRepository.uploadFiles(mid, project.id, fileList, uploadContainer);
      console.log("Files uploaded", uploadedFiles);

      // Start Job
      let job = await this.projectRepository.startJob(project.id, stationid, mid, directoryName);
      console.log("job started");
      if(job){
        store.dispatch(updateSentJob(job));
        return Promise.resolve(true);
      }

    }
    console.log("Dispatching failure");
    store.dispatch(openNotificationModal('Notifications', "Failed to send job"))
    return Promise.resolve(false);
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
  getJobResults(job_id: string){
    return this.jobRepository.getJobResults(job_id)
            .then((urlObject: GetUploadUrlResponse) => {
              console.log("Job results urlobject",urlObject);
              if(urlObject.files.length === 0){
                this.handleError({message: 'Unable to download results.'} as Error);
                return;
              }
              urlObject.files.forEach( (uploadObject: UploadUrl) => {
                this.jobRepository.downloadJobResult(job_id, uploadObject.filename, uploadObject.path);
              })
            })
            .catch((err:Error) => {
              this.handleError(err);
            })
  }
}

interface FileObject {
  name: string;
  content: ArrayBuffer | string
}
