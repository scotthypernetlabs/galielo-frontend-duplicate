import { Dictionary } from './dictionary';

export interface IJob {
  readonly path: string;
  readonly name: string;
  readonly launch_pad: string;
  readonly landing_zone: string;
  readonly id: string;
  readonly run_time: number;
  readonly upload_time: number;
  readonly status: string;
}

export interface IJobStatusHistory {
  readonly status_history: Dictionary<IJobStatus[]>
}

export interface IJobStatus {
  readonly status: string;
  readonly timestamp: number;
}

export interface IJobState {
  readonly receivedJobs: Dictionary<IJob>;
  readonly sentJobs: Dictionary<IJob>;
}
