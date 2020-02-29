import { Dictionary } from './dictionary';
import store from '../../store/store';
import { updateStationUploadProgress, updateMachineUploadProgress } from '../../actions/progressActions';
// import DateTimeFormat = Intl.DateTimeFormat;

export class Job {
  constructor(
    public container: string,
    public id: string,
    public last_updated: number, // timestamp of last entry in status history
    public name: string,
    public oaid: string,
    public pay_interval: number,
    public pay_status: EPaymentStatus,
    public landing_zone: string,
    public launch_pad: string,
    public job_state: EJobRunningStatus,
    public station_id: string,
    public status: EJobStatus,
    public status_history: JobStatus[],
    public upload_time: number,
    public run_time: number,
  ) {}
}

export class JobStatus {
  constructor(
    public jobid: string,
    public jobstatusid: string,
    public status: EJobStatus,
    public timestamp: number
  ){

  }
}

export enum EJobStatus {
  uploaded = "uploaded",
  submitted = "submitted",
  downloaded = "downloaded",
  building_image = "building_image",
  building_container = "building_container",
  start_requested = "start_requested",
  running = "running",
  pause_requested = "pause_requested",
  paused = "paused",
  stop_requested = "stop_requested",
  stopped = "stopped",
  exited = "exited",
  collecting_results = "collecting_results",
  posting_results = "posting_results",
  results_posted = "results_posted",
  terminated = "terminated",
  completed = "completed",
  removed_by_host = "removed_by_host",
  unknown = "unknown",
  post_processing = "post_processing",
  started = "started"
}

export enum EJobRunningStatus {
  not_running = "not_running",
  running = "running"
}

export enum EPaymentStatus {
  current = "current",
  payment_due = "payment_due",
  delinquent = "delinquent",
  missing_offer = "missing_offer"
}

export class GetJobFilters {
  constructor(
    public jobids?: string[],
    public receiverids?: string[],
    public userids?: string[],
    public stationids?: string[],
    public statuses?: string[],
    public page?: number,
    public items?: number
  ){

  }
}

export class DockerLog {
  constructor(
    public Processes: string[],
    public Titles: string[]
  ){

  }
}

export class UploadQueue {
  public queue: Function[] = [];
  public totalQueued: number = 0;
  public totalFinished: number = 0;
  public running: boolean = false;
  public componentsToUpdate: Dictionary<React.Component> = {};
  constructor(
  ){
  }
  // Components that need to re-render based on changes in the Queue
  bindComponent(component: React.Component, identity: string){
    this.componentsToUpdate[identity] = component;
  }
  // Function to call the re-render on the components that need to be updated.
  updateComponents(finalUpload?: boolean){
    Object.keys(this.componentsToUpdate).forEach((identity: string) => {
      if(finalUpload){
        this.componentsToUpdate[identity].setState({fileUploadText:"Browse or drop directory"})
      }else{
        this.componentsToUpdate[identity].forceUpdate();
      }
    })
  }
  // Component that was listening for updates to the queue will unmount
  removeComponent(identity: string){
    delete this.componentsToUpdate[identity]
  }
  addToQueue(callback: Function){
    this.queue.push(callback);
    this.totalQueued += 1;
    this.updateComponents();
  }
  startQueue(){
    if(!this.running){
      this.running = true;
      this.startNext();
    }
    window.onbeforeunload = function(){ return true }
  }
  async startNext(){
    if(this.length() > 0){
      let next = this.queue.shift();
      await next();
      this.totalFinished += 1;
      this.startNext();
      this.updateComponents();
    }else{
      setTimeout(() => {
        this.totalQueued = 0;
        this.totalFinished = 0;
        this.running = false;
        this.updateComponents(true);
        window.onbeforeunload = null;
      }, 3000);
    }
  }
  length(){
    return this.queue.length;
  }
}

export class UploadObjectContainer {
  constructor(
    public project_id: string,
    public uploadingFiles: UploadObject[],
    public totalUploadSize: number,
    public completedUploadSize: number,
    public station_id?: string,
    public machine_id?: string
  ){
  }
  addUploadingFile(uploadObject: UploadObject){
    this.uploadingFiles.push(uploadObject);
    this.totalUploadSize += uploadObject.total;
  }
  updateProgress(uploadObject: UploadObject){
    this.completedUploadSize = this.completedUploadSize + uploadObject.loaded - uploadObject.previousLoaded;
    uploadObject.previousLoaded = uploadObject.loaded;
    if(this.station_id){
      store.dispatch(updateStationUploadProgress(this));
    }
    if(this.machine_id){
      store.dispatch(updateMachineUploadProgress(this));
    }
  }
  addEventListeners(type: EventListenerTypes, eventListener: Function){
    this.uploadingFiles.forEach((uploadObject: UploadObject) => {
      uploadObject.xhrObject.upload.addEventListener(type, (e: ProgressEvent) => eventListener(e));
    })
  }
  cancelAllUploads(){
    this.uploadingFiles.forEach((uploadObject: UploadObject) => {
      console.log("Aborting");
      uploadObject.xhrObject.abort();
    })
  }
}

export class UploadObject {
  constructor(
    public xhrObject: XMLHttpRequest,
    public previousLoaded: number,
    public loaded: number,
    public total: number
  ){
  }

}

export enum EventListenerTypes {
  abort = "abort",
  error = "error",
  load = "load",
  loadend = "loadend",
  loadstart = "loadstart",
  progress = "progress",
  timeout = "timeout"
}
type MyMapLikeType = Record<string, string>;

export const JobStatusDecode: MyMapLikeType = {
  uploaded: "Queued",
  submitted: "Job Uploading",
  downloaded: "Job Uploading",
  building_image: "Building Image",
  built_image: "Building Image",
  building_container: "Building Container",
  built_container: "Built Container",
  start_requested: "Job In Progress",
  started: "Job In Progress",
  running: "Job In Progress",
  pause_requested: "Job Paused",
  paused: "Job Paused",
  stop_requested: "Job Cancelled",
  stopped: "Job Cancelled",
  terminated: "Job Cancelled",
  collecting_results: "Collecting Results",
  post_processing: "Collecting Results",
  posting_results: "Collecting Results",
  results_posted: "Results Received",
  exit_error: "Exit Error",
  completed: "Completed",
  build_error: "Build Error",
  docker_error: "Docker Error",
  unknown: "Error",
  queued: "Queued"
};

// export function getEnumKeyByEnumValue<T>(myEnum: any, enumValue: string|number):T {
//     let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
//     return keys.length > 0 ? keys[0] : null;
// }
