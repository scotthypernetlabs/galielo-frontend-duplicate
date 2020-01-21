import { Dictionary } from './dictionary';

export class Machine {
  constructor(
    public machine_name: string,
    public owner: string,
    public status: string,
    public mid: string,
    public gpu: string,
    public cpu: string,
    public os: string,
    public arch: string,
    public memory: string,
    public jobs_in_queue: number,
    public running_jobs_limit: number,
    public running_jobs: number
  ){

  }
}

export class GetMachinesFilter {
  constructor(
    public mids?: string[],
    public userids?: string[]
  ){

  }
}
