import React from 'react';
import { connect } from 'react-redux';

type Props = {
  job: any;
}
type State = {
  counter: number;
  showDropdown: boolean;
  showContent: boolean;
  timer: boolean;
  currentlyDownloading: boolean;
}

class StationJob extends React.Component<Props, State>{
  clockTimer: any;
  constructor(props: Props){
    super(props);
    this.state = {
      counter: 0,
      showDropdown: false,
      showContent: false,
      timer: false,
      currentlyDownloading: false
    }
  }
  public componentDidMount() {
    this.clockTimer = setInterval(() => {
      this.setState(prevState => { return { counter: prevState.counter + 1, timer: true } })
    }, 1000);
    let time_elapsed = this.props.job.run_time;
    // let storedTime;
    // storedTime = this.props.stationJobTimer[this.props.job.id];
    // if(storedTime && storedTime > time_elapsed){
      // time_elapsed = storedTime;
    // }
    this.setState({
      counter: time_elapsed
    })
  }
  public componentWillUnmount(){
    clearInterval(this.clockTimer);
    // this.props.stationJobTimer(this.props.job.id, this.state.counter);
  }
  public startTimer(){
    if(this.state.timer){
      return;
    }
    this.setState({
      counter: this.props.job.run_time
    })
  }
  public stopTimer(){
    clearInterval(this.clockTimer);
    this.setState({ timer: false, counter: this.props.job.run_time })
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
    let landingZone = job.landing_zone;
    let launchPad = job.launch_pad;
    let elapsedTime;
    let uploadTime = Math.floor(job.upload_time);
    let currentTime = Math.floor(new Date().getTime() / 1000);
    if(job.status === 'Running'){
      elapsedTime = currentTime - uploadTime;
    }else{
      elapsedTime = job.run_time;
    }
    if(this.state.counter > elapsedTime){
      elapsedTime = this.state.counter;
    }
    return(
      <>
        <div className="log-column">
          <div className="station-job-info">
                <div className="submitted-by">{landingZone}</div>
                <div className="submitted-by">{launchPad}</div>
                <div className="project-name">{job.name}</div>
                <div className="job-time-taken">{this.parseTime(elapsedTime)}</div>
          </div>
        </div>
      </>
    )
  }
}

export default StationJob;
