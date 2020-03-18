import { Dictionary } from "../business/objects/dictionary";
import { IJobState } from "../business/objects/store";
import { Job, JobStatus } from "../business/objects/job";
import {
  JobActions,
  RECEIVE_JOBS,
  RECEIVE_RECEIVED_JOBS,
  RECEIVE_SENT_JOBS,
  RECEIVE_STATION_JOB,
  RECEIVE_STATION_JOBS
} from "../actions/jobActions";
import { Reducer } from "redux";

class JobState implements IJobState {
  constructor(
    public receivedJobs: Dictionary<Job> = {},
    public sentJobs: Dictionary<Job> = {},
    public status_history: Dictionary<JobStatus[]> = {},
    public stationJobs: Dictionary<Dictionary<Job>> = {},
    public jobs: Dictionary<Job> = {}
  ) {}
}

const jobReducer: Reducer<JobState, JobActions> = (
  state = new JobState(),
  action: JobActions
) => {
  switch (action.type) {
    case RECEIVE_SENT_JOBS:
      return Object.assign({}, state, {
        sentJobs: Object.assign({}, state.sentJobs, action.jobs)
      });
    case RECEIVE_RECEIVED_JOBS:
      return Object.assign({}, state, {
        receivedJobs: Object.assign({}, state.receivedJobs, action.jobs)
      });
    case RECEIVE_STATION_JOBS:
      const jobObject: Dictionary<Job> = {};
      action.jobs.forEach(job => {
        jobObject[job.id] = job;
      });
      return Object.assign({}, state, {
        stationJobs: Object.assign({}, state.stationJobs, {
          [action.station_id]: jobObject
        })
      });
    case RECEIVE_STATION_JOB:
      return Object.assign({}, state, {
        stationJobs: Object.assign({}, state.stationJobs, {
          [action.station_id]: Object.assign(
            {},
            state.stationJobs[action.station_id],
            { [action.job.id]: action.job }
          )
        })
      });
    case RECEIVE_JOBS:
      const jobObj: Dictionary<Job> = {};
      action.jobs.forEach(job => {
        jobObj[job.id] = job;
      });
      return Object.assign({}, state, { jobs: jobObj });
    default:
      return state;
  }
};

export default jobReducer;
