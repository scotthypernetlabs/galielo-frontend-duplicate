import { Dictionary } from './dictionary';
import DateTimeFormat = Intl.DateTimeFormat;

export class Job {
  constructor(
    readonly path: string,
    readonly name: string,
    readonly launch_pad: string,
    readonly landing_zone: string,
    readonly id: string,
    readonly run_time: number,
    readonly upload_time: DateTimeFormat,
    readonly status: EJobStatus,
  ) {}
}

export class JobStatusHistory {
  readonly status_history: Dictionary<JobStatus[]>;
}

export class JobStatus {
  readonly status: string;
  readonly timestamp: number;
  readonly jobstatusid?: string;
  readonly jobid?: string;
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
