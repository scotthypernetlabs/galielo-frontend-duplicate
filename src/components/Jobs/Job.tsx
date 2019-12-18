import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { IJob, IJobStatus } from '../../business/objects/job';
import { Dictionary } from '../../business/objects/dictionary';
import Skeleton from 'react-loading-skeleton';

type Props = {
  job: IJob;
  sentJob: boolean;
  status_history: Dictionary<IJobStatus>;
}

type State = {

}

class Job extends React.Component<Props,State> {
  constructor(props: Props){
    super(props);
  }
  public parseTime(seconds_elapsed:number, timeString:string = "", shortDuration:boolean = true):string{
    if(seconds_elapsed >= 3600){
      let hours = Math.floor(seconds_elapsed / 3600);
      let hours_string:string;
      if(hours < 10){
        hours_string = '0' + hours;
      }
      return this.parseTime(seconds_elapsed - (hours * 3600),`${hours_string}`, false);
    }else{
      let minutes = 0;
      let seconds = seconds_elapsed;
      if(seconds_elapsed >= 60){
        minutes = Math.floor(seconds_elapsed / 60);
        seconds = seconds_elapsed - (minutes * 60);
      }
      let seconds_string:string;
      if(seconds < 10){
        seconds_string = '0' + seconds;
      }
      let minutes_string:string;
      if(minutes < 10){
        minutes_string = '0' + minutes;
      }
      if(shortDuration){
        return `00:${minutes_string}:${seconds_string}`;
      }else{
        return timeString + `:${minutes_string}:${seconds_string}`;
      }
    }
  }
  render(){
    const { job, status_history } = this.props;
    let timer = job.run_time;
    if(job.status === 'Running'){
      let history:IJobStatus = status_history[job.id];
      // let final_status = history[history.length - 1];
    }
    let time = this.parseTime(timer);
    let launchPad = job.launch_pad;
    let landingZone = job.landing_zone;
    let date = new Date(job.upload_time * 1000).toString();
    let finalDate = date.slice(0, date.indexOf('GMT'));
    return(
        <div className="log-column">
          <div className="job-info">
          {
            job ? (
              <>
                <div className="ellipsis-text">{landingZone}</div>
                <div className="ellipsis-text">{launchPad}</div>
                <div className="ellipsis-text">{job.name}</div>
                <div className="job-time-taken">
                  <span className="job-time-text">{time}</span>
                  <span className="job-time-hover-text">{finalDate}</span>
                </div>
                <div className="ellipsis-text">{job.status}</div>
              </>
            ) : (
              <>
                <div className="job-icon-badge">
                  <Skeleton circle height="20px" width="20px" />
                </div>
                <div className="job-icon-badge">
                  <Skeleton circle height="20px" width="20px" />
                </div>
                <div className="ellipsis-text">
                  <Skeleton count={1} width={50} height="20px" />
                </div>
                <div className="job-time-taken">
                  <Skeleton count={1} width={50} height="20px" />
                </div>
                <div className="ellipsis-text">
                  <Skeleton count={1} width={50} height="20px" />
                </div>
                <div>
                  <Skeleton circle height="20px" width="20px" />
                </div>
              </>
            )
          }
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  status_history: state.jobs.status_history
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Job);
