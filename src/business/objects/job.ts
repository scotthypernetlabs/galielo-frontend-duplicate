import { Dictionary } from './dictionary';

export class Job {
  readonly path: string;
  readonly name: string;
  readonly launch_pad: string;
  readonly landing_zone: string;
  readonly id: string;
  readonly run_time: number;
  readonly upload_time: number;
  readonly status: string;
}

export class JobStatusHistory {
  readonly status_history: Dictionary<JobStatus[]>;
}

export class JobStatus {
  readonly status: string;
  readonly timestamp: number;
}
