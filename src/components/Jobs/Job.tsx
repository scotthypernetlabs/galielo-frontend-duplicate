import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {IStore} from '../../business/objects/store';
import {EJobStatus, Job as JobModel, JobStatus, EJobRunningStatus} from '../../business/objects/job';
import {Dictionary} from '../../business/objects/dictionary';
import Skeleton from 'react-loading-skeleton';
import { User } from '../../business/objects/user';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import { Machine } from '../../business/objects/machine';

type Props = {
  job: JobModel;
  isSentJob: boolean;
  users: Dictionary<User>;
  machines: Dictionary<Machine>;
}

type State = {
  counter: number;
  timer: string;
}

class Job extends React.Component<Props,State> {
  context!: MyContext;
  clockTimer: any;
  constructor(props: Props){
    super(props);
    this.jobOptionsMenu = this.jobOptionsMenu.bind(this);
    this.startJob = this.startJob.bind(this);
    this.stopJob = this.stopJob.bind(this);
    this.pauseJob = this.pauseJob.bind(this);
    this.openProcessLog = this.openProcessLog.bind(this);
    this.openStdoutLog = this.openStdoutLog.bind(this);
    this.handleDownloadResults = this.handleDownloadResults.bind(this);
    this.state = {
      timer: 'off',
      counter: 0,
    }
  }
  componentDidMount() {
    this.clockTimer = setInterval(() => {
      if(this.props.job.status === EJobStatus.running){
        this.setState(prevState => { return { counter: prevState.counter + 1, timer: 'on' } })
      }
    }, 1000);
  }
  componentWillUnmount(){
    clearInterval(this.clockTimer);
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
  startJob(){
    if(this.props.isSentJob){
      this.context.jobService.startJob(this.props.job.id);
    }
  }
  stopJob(){
    if(this.props.isSentJob){
      this.context.jobService.stopJob(this.props.job.id)
    }
  }
  pauseJob(){
    if(this.props.isSentJob){
      this.context.jobService.pauseJob(this.props.job.id);
    }
  }
  openProcessLog(){
    this.context.jobService.getProcessInfo(this.props.job.id);
  }
  openStdoutLog(){
    this.context.jobService.getLogInfo(this.props.job.id);
  }
  handleDownloadResults(){
    this.context.jobService.getJobResults(this.props.job.id);
  }
  jobOptionsMenu(){
    console.log(this.props);
    if(this.props.job.status === EJobStatus.completed){
      if(this.props.isSentJob){
        return(
          <div className="job-icons-container">
            <i title="Download" className="fas fa-download fa-2x" onClick={this.handleDownloadResults}></i>
          </div>
        )
      }else{
        return;
      }
    }
    return(
      <div className="job-icons-container">
        {
          this.props.job.job_state === EJobRunningStatus.running ? (
            <>
              <i title="pause" className="fas fa-pause-circle fa-2x" key={`${this.props.job.id}pause`} onClick={this.pauseJob}>
              </i>
              <i title="stop" className="fas fa-stop-circle fa-2x" key={`${this.props.job.id}stop`} onClick={this.stopJob}>
              </i>
            </>
          ) : (
            <i title="Start" className="fas fa-play-circle fa-2x" key={`${this.props.job.id}start`} onClick={this.startJob}>
            </i>
          )
        }
        <i title="Process Logs" className="fas fa-info-circle fa-2x" key={`${this.props.job.id}viewProcessLogs`} onClick={this.openProcessLog}>
        </i>
        <i title="Std Output" className="fas fa-clipboard-list fa-2x" key={`${this.props.job.id}viewStdout`} onClick={this.openStdoutLog}>
        </i>
      </div>
    )
  }
  render(){
    const { job } = this.props;
    let timer = job.run_time;
    if(job.status === EJobStatus.running){
      timer = Math.floor(Math.floor(Date.now() * 1000) - job.last_updated) + job.run_time;
    }
    let time = this.parseTime(timer);
    let launchPad = this.props.users[job.launch_pad] ? this.props.users[job.launch_pad].username : job.launch_pad;
    let landingZone = this.props.machines[job.landing_zone] ? this.props.machines[job.landing_zone].machine_name : job.landing_zone;
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
                {
                  this.jobOptionsMenu()
                }
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

Job.contextType = context;

const mapStateToProps = (state:IStore) => ({
  users: state.users.users,
  machines: state.machines.machines
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Job);
