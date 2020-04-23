import { Dictionary } from "../business/objects/dictionary";
import { IJobState } from "../business/objects/store";
import {
  JOBS_SELECTED,
  JOBS_UNSELECTED,
  JobActions,
  RECEIVE_JOBS,
  RECEIVE_RECEIVED_JOBS,
  RECEIVE_SEARCHED_RECEIVED_JOBS,
  RECEIVE_SEARCHED_SENT_JOBS,
  RECEIVE_SENT_JOBS,
  RECEIVE_STATION_JOB,
  RECEIVE_STATION_JOBS
} from "../actions/jobActions";
import { Job, JobStatus } from "../business/objects/job";
import { Reducer } from "redux";

class JobState implements IJobState {
  constructor(
    public jobsSelected: boolean = false,
    public receivedJobs: Job[] = [],
    public sentJobs: Job[] = [],
    public status_history: Dictionary<JobStatus[]> = {},
    public stationJobs: Dictionary<Dictionary<Job>> = {},
    public jobs: Job[] = [],
    public searchedSentJobs: Dictionary<Job> = {},
    public searchedReceivedJobs: Dictionary<Job> = {}
  ) {}
}

const jobReducer: Reducer<JobState, JobActions> = (
  state = new JobState(),
  action: JobActions
) => {
  switch (action.type) {
    case JOBS_SELECTED:
      return Object.assign({}, state, { jobsSelected: true });
    case JOBS_UNSELECTED:
      return Object.assign({}, state, { jobsSelected: false });
    case RECEIVE_SENT_JOBS:
      return Object.assign({}, state, {
        sentJobs: action.jobs
      });
    case RECEIVE_RECEIVED_JOBS:
      return Object.assign({}, state, {
        receivedJobs: action.jobs
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
      return Object.assign({}, state, { jobs: action.jobs });
    // const jobObj: Dictionary<Job> = {};
    // action.jobs.forEach(job => {
    //   jobObj[job.id] = job;
    // });
    // return Object.assign({}, state, { jobs: jobObj });
    case RECEIVE_SEARCHED_SENT_JOBS:
      return Object.assign({}, state, { searchedSentJobs: action.jobs });
    case RECEIVE_SEARCHED_RECEIVED_JOBS:
      return Object.assign({}, state, { searchedReceivedJobs: action.jobs });
    default:
      return state;
  }
};

export default jobReducer;
