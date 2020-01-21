import { Job, JobStatus } from "../business/objects/job";
import { Dictionary } from "../business/objects/dictionary";
import { JobActions, RECEIVE_SENT_JOBS, RECEIVE_RECEIVED_JOBS, RECEIVE_STATION_JOBS } from "../actions/jobActions";
import { Reducer } from "redux";
import { IJobState } from "../business/objects/store";

class JobState implements IJobState {
  constructor(
    public receivedJobs: Dictionary<Job> = {},
    public sentJobs: Dictionary<Job> = {},
    public status_history: Dictionary<JobStatus[]> = {},
    public stationJobs: Dictionary<Dictionary<Job>> = {}
  ){

  }
}

const jobReducer: Reducer<JobState, JobActions> = (state = new JobState(), action:JobActions) => {
  switch(action.type){
    case RECEIVE_SENT_JOBS:
      return Object.assign({}, state, { sentJobs: Object.assign({}, state.sentJobs, action.jobs) })
    case RECEIVE_RECEIVED_JOBS:
      return Object.assign({}, state, { receivedJobs: Object.assign({}, state.receivedJobs, action.jobs) })
    case RECEIVE_STATION_JOBS:
      let jobObject:Dictionary<Job> = {};
      action.jobs.forEach(job => {
        jobObject[job.id] = job
      })
      return Object.assign({}, state, { stationJobs: Object.assign({}, state.stationJobs, {[action.station_id]: jobObject})})
    default:
      return state;
  }
}

export default jobReducer;
