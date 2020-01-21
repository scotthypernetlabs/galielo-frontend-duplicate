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
  uploaded,
  submitted,
  downloaded,
  building_image,
  building_container,
  start_requested,
  running,
  pause_requested,
  paused,
  stop_requested,
  stopped,
  exited,
  collecting_results,
  posting_results,
  terminated,
  completed,
  removed_by_host,
  unknown,
  post_processing,
  started
}

export enum EJobRunningStatus {
  not_running,
  running
}

export enum EPaymentStatus {
  current,
  payment_due,
  delinquent,
  missing_offer
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
