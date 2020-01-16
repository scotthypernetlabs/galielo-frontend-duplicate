import { Action } from 'redux';
import { Job, JobStatusHistory } from '../business/objects/job';

export const RECEIVE_SENT_JOBS = "RECEIVE_SENT_JOBS";
export type RECEIVE_SENT_JOBS = typeof RECEIVE_SENT_JOBS;
export const RECEIVE_RECEIVED_JOBS = "RECEIVE_RECEIVED_JOBS";
export type RECEIVE_RECEIVED_JOBS = typeof RECEIVE_RECEIVED_JOBS;
export const RECEIVE_JOB_STATUS_HISTORY = "RECEIVE_JOB_STATUS_HISTORY";
export type RECEIVE_JOB_STATUS_HISTORY = typeof RECEIVE_JOB_STATUS_HISTORY;
export const RECEIVE_STATION_JOBS = "RECEIVE_STATION_JOBS";
export type RECEIVE_STATION_JOBS = typeof RECEIVE_STATION_JOBS;

export interface IReceiveSentJobs extends Action {
  type: RECEIVE_SENT_JOBS;
  jobs: Job[];
}

export interface IReceiveReceivedJobs extends Action {
  type: RECEIVE_RECEIVED_JOBS;
  jobs: Job[];
}

export interface IReceiveJobStatusHistory extends Action {
  type: RECEIVE_JOB_STATUS_HISTORY;
  job_status: JobStatusHistory;
  job_id: string;
}

export interface IReceiveStationJobs extends Action {
  type: RECEIVE_STATION_JOBS;
  station_id: string;
  jobs: Job[];
}

export type JobActions = IReceiveSentJobs | IReceiveReceivedJobs | IReceiveJobStatusHistory | IReceiveStationJobs;

export const receiveSentJobs = (jobs: Job[]):IReceiveSentJobs => {
  return { type: RECEIVE_SENT_JOBS, jobs }
}

export const receiveReceivedJobs = (jobs: Job[]):IReceiveReceivedJobs => {
  return { type: RECEIVE_RECEIVED_JOBS, jobs }
}

export const receiveJobStatusHistory = (job_id:string, job_status:JobStatusHistory):IReceiveJobStatusHistory => {
  return { type: RECEIVE_JOB_STATUS_HISTORY, job_status, job_id }
}

export const receiveStationJobs = (station_id: string, jobs: Job[]) => {
  return { type: RECEIVE_STATION_JOBS, station_id, jobs }
}
