export interface IMachine {
  name: string;
  userid: string;
  status: string;
  id: string;
  gpu: string;
  cpu: string;
  os: string;
  arch: string;
  memory: string; 
  jobs_in_queue: number;
  running_jobs_limit: number;
  running_jobs: number;
}
