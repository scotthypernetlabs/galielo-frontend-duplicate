import { Dictionary } from './dictionary';

export class Machine {
  readonly arch: string;
  readonly cpu: string;
  readonly gpu: string;
  readonly jobs_in_queue: number;
  readonly machine_name: string;
  readonly memory: string;
  readonly mid: string;
  readonly os: string;
  readonly owner: string;
  readonly running_jobs: number;
  readonly running_jobs_limit: number;
  readonly status: string;
}
