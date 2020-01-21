import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Dictionary } from '../../business/objects/dictionary';
import { Job as JobModel, GetJobFilters } from '../../business/objects/job';
import Job from './Job';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import { User } from '../../business/objects/user';

type Props = {
  sentJobs: Dictionary<JobModel>;
  receivedJobs: Dictionary<JobModel>;
  currentUser: User;
}
// True = sent jobs
type State = {
  mode: boolean;
}

class Jobs extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      mode: true
    }
    this.toggleMode = this.toggleMode.bind(this);
  }
  componentDidMount(){
    if(this.props.currentUser.user_id !== 'meme'){
      let filters = new GetJobFilters(null, null, [this.props.currentUser.user_id], null, null, null, null);
      this.context.jobService.getJobs(filters);
    }
  }
  toggleMode(){
    this.setState(prevState =>({
      mode: !prevState.mode
    }));
  }
  generateJobList(jobs:JobModel[]){
    if(jobs.length > 0){
      let jobs_reversed:JobModel[] = jobs.sort((a:JobModel, b:JobModel) => {
        if(a.upload_time < b.upload_time) return 1;
        if(a.upload_time > b.upload_time) return -1;
        return 0;
      })
      return(
        <div className="job-list">
          {
            jobs_reversed.map((job, idx) => {
              return (
                <Job
                  key={job.id}
                  job={job}
                  isSentJob={this.state.mode}
                  />
              )
            })
          }
        </div>
      )
    }else{
      return(
        <h3>No jobs</h3>
      )
    }
  }
  render(){
    const { mode } = this.state;
    let jobs:Dictionary<JobModel> = {};
    if(mode){
      jobs = Object.assign({}, this.props.sentJobs);
    }else{
      jobs = Object.assign({}, this.props.receivedJobs);
    }
    return(
      <div className="jobs-container">
        <div className="jobs-container-header">
          <button className={`generic-button ${mode ? 'active' : ''} tab`} onClick={this.toggleMode}>Sent</button>
          <button className={`generic-button ${mode ? '' : 'active'} tab`} onClick={this.toggleMode}>Received</button>
        </div>
        <div className="job-log-container">
        {
          Object.keys(jobs).length > 0 &&
          <div className="job-log-columns">
            <div>SENT TO</div>
            <div>SENT BY</div>
            <div>NAME OF PROJECT</div>
            <div>TIME TAKEN</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>
        }
        { this.generateJobList(Object.keys(jobs).map(job_id => jobs[job_id]))}
        </div>
      </div>
    )
  }
}

Jobs.contextType = context;

const mapStateToProps = (state:IStore) => ({
  sentJobs: state.jobs.sentJobs,
  receivedJobs: state.jobs.receivedJobs,
  currentUser: state.users.currentUser
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Jobs);
