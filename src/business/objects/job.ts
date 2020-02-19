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
