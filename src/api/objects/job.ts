import { EPaymentStatus, EJobRunningStatus, EJobStatus } from "../../business/objects/job";
// import DateTimeFormat = Intl.DateTimeFormat;

export interface IJob {
  container: string;
  jobid: string;
  last_updated: number;
  name: string;
  oaid: string; // offer accept id
  pay_interval: number;
  pay_status: EPaymentStatus;
  receiverid: string;
  userid: string; // sender of job
  state: EJobRunningStatus;
  stationid: string;
  status: EJobStatus;
  status_history: IJobStatusHistory[];
  time_created: number;
  total_runtime: number;
  senderid: string; // machine right now
  archived: boolean;
}

export interface IJobStatusHistory {
  jobid: string;
  jobstatusid: string;
  status: EJobStatus;
  timestamp: number;
}
