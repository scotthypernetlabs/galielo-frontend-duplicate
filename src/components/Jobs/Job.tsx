import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { IJob, IJobStatus } from '../../business/objects/job';
import { Dictionary } from '../../business/objects/dictionary';

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
      let history = status_history[job.id];
    }
    let time = this.parseTime(timer);
    let launchPad = job.launch_pad;
    let date = new Date(job.upload_time * 1000).toString();
    let finalDate = date.slice(0, date.indexOf('GMT'));
    return(
      <>
      </>
    )
  }
}

const mapStateToProps = (state:IStore) => ({

})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Job);
