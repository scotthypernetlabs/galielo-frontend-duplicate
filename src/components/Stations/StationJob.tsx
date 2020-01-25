import React from 'react';
import { connect } from 'react-redux';
import { EJobRunningStatus } from '../../business/objects/job';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Dictionary } from '../../business/objects/dictionary';
import { User } from '../../business/objects/user';
import { Machine } from '../../business/objects/machine';

type Props = {
  job: any;
  users: Dictionary<User>;
  machines: Dictionary<Machine>;
}
type State = {
}

class StationJob extends React.Component<Props, State>{
  clockTimer: any;
  constructor(props: Props){
    super(props);
  }
  public parseTime(seconds_elapsed:number, timeString:string = "", shortDuration:boolean = true):string{
    if(seconds_elapsed >= 3600){
      let hours:number = Math.floor(seconds_elapsed / 3600);
      let hours_string: string = hours.toString();
      if(hours < 10){
        hours_string = '0' + hours;
      }
      return this.parseTime(seconds_elapsed - (hours * 3600),`${hours_string}`, false);
    }else{
      let minutes = 0;
      let seconds = seconds_elapsed;
      let minutes_string = minutes.toString();
      let seconds_string = seconds.toString();
      if(seconds_elapsed >= 60){
        minutes = Math.floor(seconds_elapsed / 60);
        minutes_string = minutes.toString();
        seconds = seconds_elapsed - (minutes * 60);
        seconds_string = seconds.toString();
      }
      if(seconds < 10){
        seconds_string = '0' + seconds;
      }
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
    const { job } = this.props;
    let timer = job.run_time;
    if(job.job_state === EJobRunningStatus.running){
      timer = Math.floor(Math.floor(Date.now() / 1000) - job.last_updated) + job.run_time;
    }
    let time = this.parseTime(timer);
    let launchPad = this.props.users[job.launch_pad] ? this.props.users[job.launch_pad].username : job.launch_pad;
    let landingZone = this.props.machines[job.landing_zone] ? this.props.machines[job.landing_zone].machine_name : job.landing_zone;
    return(
      <>
        <div className="log-column">
          <div className="station-job-info">
                <div className="submitted-by">{landingZone}</div>
                <div className="submitted-by">{launchPad}</div>
                <div className="project-name">{job.name}</div>
                <div className="job-time-taken">{time}</div>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  users: state.users.users,
  machines: state.machines.machines
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StationJob);
