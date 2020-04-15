import { Action } from "redux";
import { Dictionary } from "../business/objects/dictionary";
import { Job, JobStatus } from "../business/objects/job";
import { User } from "../business/objects/user";

export const RECEIVE_SENT_JOBS = "RECEIVE_SENT_JOBS";
export type RECEIVE_SENT_JOBS = typeof RECEIVE_SENT_JOBS;
export const RECEIVE_RECEIVED_JOBS = "RECEIVE_RECEIVED_JOBS";
export type RECEIVE_RECEIVED_JOBS = typeof RECEIVE_RECEIVED_JOBS;
export const RECEIVE_STATION_JOBS = "RECEIVE_STATION_JOBS";
export type RECEIVE_STATION_JOBS = typeof RECEIVE_STATION_JOBS;
export const UPDATE_SENT_JOB = "UPDATE_SENT_JOB";
export type UPDATE_SENT_JOB = typeof UPDATE_SENT_JOB;
export const UPDATE_RECEIVED_JOB = "UPDATE_RECEIVED_JOB";
export type UPDATE_RECEIVED_JOB = typeof UPDATE_RECEIVED_JOB;
export const RECEIVE_JOBS = "RECEIVE_JOBS";
export type RECEIVE_JOBS = typeof RECEIVE_JOBS;
export const RECEIVE_STATION_JOB = "RECEIVE_STATION_JOB";
export type RECEIVE_STATION_JOB = typeof RECEIVE_STATION_JOB;
export const JOBS_SELECTED = "JOBS_SELECTED";
export type JOBS_SELECTED = typeof JOBS_SELECTED;
export const JOBS_UNSELECTED = "JOBS_UNSELECTED";
export type JOBS_UNSELECTED = typeof JOBS_UNSELECTED;
export const RECEIVE_SEARCHED_SENT_JOBS = "RECEIVE_SEARCHED_SENT_JOBS";
export type RECEIVE_SEARCHED_SENT_JOBS = typeof RECEIVE_SEARCHED_SENT_JOBS;
export const RECEIVE_SEARCHED_RECEIVED_JOBS = "RECEIVE_SEARCHED_RECEIVED_JOBS";
export type RECEIVE_SEARCHED_RECEIVED_JOBS = typeof RECEIVE_SEARCHED_RECEIVED_JOBS;

export interface IReceiveSentJobs extends Action {
  type: RECEIVE_SENT_JOBS;
  jobs: Dictionary<Job>;
}

export interface IReceiveReceivedJobs extends Action {
  type: RECEIVE_RECEIVED_JOBS;
  jobs: Dictionary<Job>;
}

export interface IReceiveStationJobs extends Action {
  type: RECEIVE_STATION_JOBS;
  station_id: string;
  jobs: Job[];
}

export interface IUpdateSentJob extends Action {
  type: UPDATE_SENT_JOB;
  job: Job;
}

export interface IUpdateReceivedJob extends Action {
  type: UPDATE_RECEIVED_JOB;
  job: Job;
}

export interface IReceiveJobs extends Action {
  type: RECEIVE_JOBS;
  jobs: Job[];
  current_user: User;
}
export interface IReceiveStationJob extends Action {
  type: RECEIVE_STATION_JOB;
  job: Job;
  station_id: string;
}

export interface IJobsSelected extends Action {
  type: JOBS_SELECTED;
  jobsSelected: boolean;
}

export interface IJobsUnSelected extends Action {
  type: JOBS_UNSELECTED;
  jobsSelected: boolean;
}

export interface IReceiveSearchedSentJobs extends Action {
  type: RECEIVE_SEARCHED_SENT_JOBS;
  jobs: Dictionary<Job>;
}

export interface IReceiveSearchedReceivedJobs extends Action {
  type: RECEIVE_SEARCHED_RECEIVED_JOBS;
  jobs: Dictionary<Job>;
}

export type JobActions =
  | IReceiveSentJobs
  | IReceiveReceivedJobs
  | IReceiveStationJobs
  | IUpdateSentJob
  | IUpdateReceivedJob
  | IReceiveJobs
  | IReceiveStationJob
  | IJobsSelected
  | IJobsUnSelected
  | IReceiveSearchedSentJobs
  | IReceiveSearchedReceivedJobs;

export const receiveSentJobs = (jobs: Dictionary<Job>): IReceiveSentJobs => {
  return { type: RECEIVE_SENT_JOBS, jobs };
};

export const receiveReceivedJobs = (
  jobs: Dictionary<Job>
): IReceiveReceivedJobs => {
  return { type: RECEIVE_RECEIVED_JOBS, jobs };
};

export const receiveStationJobs = (station_id: string, jobs: Job[]) => {
  return { type: RECEIVE_STATION_JOBS, station_id, jobs };
};

export const receiveStationJob = (station_id: string, job: Job) => {
  return { type: RECEIVE_STATION_JOB, station_id, job };
};

export const updateSentJob = (job: Job) => {
  return { type: UPDATE_SENT_JOB, job };
};

export const updateReceivedJob = (job: Job) => {
  return { type: UPDATE_RECEIVED_JOB, job };
};

export const receiveJobs = (jobs: Job[], current_user: User) => {
  return { type: RECEIVE_JOBS, jobs, current_user };
};
export const jobsSelected = (jobsSelected: boolean) => {
  return { type: JOBS_SELECTED, jobsSelected };
};

export const jobsUnSelected = (jobsUnSelected: boolean) => {
  return { type: JOBS_UNSELECTED, jobsUnSelected };
};

export const receiveSearchedSentJobs = (jobs: Dictionary<Job>) => {
  return { type: RECEIVE_SEARCHED_SENT_JOBS, jobs };
};

export const receiveSearchedReceivedJobs = (jobs: Dictionary<Job>) => {
  return { type: RECEIVE_SEARCHED_RECEIVED_JOBS, jobs };
};
