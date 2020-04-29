import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Dictionary } from '../../business/objects/dictionary';
import { IJob } from '../../business/objects/job';
import Job from './Job';

type Props = {
  sentJobs: Dictionary<IJob>;
  receivedJobs: Dictionary<IJob>;
}
// True = sent jobs
type State = {
  mode: boolean;
}

class Jobs extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      mode: true
    }
    this.toggleMode = this.toggleMode.bind(this);
  }
  toggleMode(){
    this.setState(prevState =>({
      mode: !prevState.mode
    }));
  }
  generateJobList(jobs:IJob[]){
    if(jobs.length > 0){
      let jobs_reversed:IJob[] = jobs.sort((a:IJob, b:IJob) => {
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
                  sentJob={this.state.mode}
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
    const { sentJobs, receivedJobs } = this.props;
    let jobs:Dictionary<IJob> = {};

    if(mode){
      jobs = {...sentJobs};
    }else{
      jobs = {...receivedJobs};
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

const mapStateToProps = (state:IStore) => ({
  sentJobs: state.jobs.sentJobs,
  receivedJobs: state.jobs.receivedJobs
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Jobs);
