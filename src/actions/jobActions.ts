import { Action } from 'redux';
import { IJob, IJobStatusHistory } from '../business/objects/job';

export const RECEIVE_SENT_JOBS = "RECEIVE_SENT_JOBS";
export type RECEIVE_SENT_JOBS = typeof RECEIVE_SENT_JOBS;
export const RECEIVE_RECEIVED_JOBS = "RECEIVE_RECEIVED_JOBS";
export type RECEIVE_RECEIVED_JOBS = typeof RECEIVE_RECEIVED_JOBS;
export const RECEIVE_JOB_STATUS_HISTORY = "RECEIVE_JOB_STATUS_HISTORY";
export type RECEIVE_JOB_STATUS_HISTORY = typeof RECEIVE_JOB_STATUS_HISTORY;

export interface IReceiveSentJobs extends Action {
  type: RECEIVE_SENT_JOBS;
  jobs: IJob[];
}

export interface IReceiveReceivedJobs extends Action {
  type: RECEIVE_RECEIVED_JOBS;
  jobs: IJob[];
}

export interface IReceiveJobStatusHistory extends Action {
  type: RECEIVE_JOB_STATUS_HISTORY;
  job_status: IJobStatusHistory;
  job_id: string;
}

export type JobActions = IReceiveSentJobs | IReceiveReceivedJobs | IReceiveJobStatusHistory;

export const receiveSentJobs = (jobs: IJob[]):IReceiveSentJobs => {
  return { type: RECEIVE_SENT_JOBS, jobs }
}

export const receiveReceivedJobs = (jobs: IJob[]):IReceiveReceivedJobs => {
  return { type: RECEIVE_RECEIVED_JOBS, jobs }
}

export const receiveJobStatusHistory = (job_id:string, job_status:IJobStatusHistory):IReceiveJobStatusHistory => {
  return { type: RECEIVE_JOB_STATUS_HISTORY, job_status, job_id }
}
