import { IJobState, IJob } from "../business/objects/job";
import { Dictionary } from "../business/objects/dictionary";
import { JobActions, RECEIVE_SENT_JOBS, RECEIVE_RECEIVED_JOBS, RECEIVE_JOB_STATUS_HISTORY } from "../actions/jobActions";
import { Reducer } from "redux";

class JobState implements IJobState {
  constructor(
    public receivedJobs: Dictionary<IJob> = {},
    public sentJobs: Dictionary<IJob> = {}
  ){

  }
}

const jobReducer: Reducer<JobState, JobActions> = (state = new JobState(), action:JobActions) => {
  switch(action.type){
    case RECEIVE_SENT_JOBS:
      let updatedSentJobs:Dictionary<IJob> = {};
      action.jobs.forEach(job => {
        updatedSentJobs[job.id] = job;
      })
      return Object.assign({}, state, { sentJobs: updatedSentJobs })
    case RECEIVE_RECEIVED_JOBS:
      let updatedReceivedJobs:Dictionary<IJob> = {};
        action.jobs.forEach(job => {
          updatedReceivedJobs[job.id] = job;
        })
      return Object.assign({}, state, { receivedJobs: updatedReceivedJobs})
    case RECEIVE_JOB_STATUS_HISTORY:
      return state;
    default:
      return state;
  }
}

export default jobReducer;
