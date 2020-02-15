import { Dictionary } from './dictionary';
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

type MyMapLikeType = Record<string, string>;

export const JobStatusDecode: MyMapLikeType = {
  uploaded: "Job Uploaded",
  submitted: "Job Uploaded",
  downloaded: "Job Uploaded",
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
