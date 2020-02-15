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
import {Grid, TableCell, TableRow, Tooltip, Fab} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faArrowDown, faClipboard, faFileAlt,
  faInfo, faPause,
  faPlay, faTimes
} from "@fortawesome/free-solid-svg-icons";
import {linkBlue, red} from "../theme";
import {JobStatusDecode} from '../../business/objects/job'

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
      return this.parseTime(seconds_elapsed - Math.floor((hours * 3600)),`${hours_string}`, false);
    }else{
      let minutes = 0;
      let seconds = seconds_elapsed;
      let minutes_string = minutes.toString();
      let seconds_string = seconds.toString();
      if(seconds_elapsed >= 60){
        minutes = Math.floor(seconds_elapsed / 60);
        minutes_string = minutes.toString();
        seconds = seconds_elapsed - Math.floor((minutes * 60));
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
  async openProcessLog(){
    let result = await this.context.jobService.getProcessInfo(this.props.job.id);
    console.log(result);
  }
  async openStdoutLog(){
    let result = await this.context.jobService.getLogInfo(this.props.job.id);
    console.log(result);
  }
  handleDownloadResults(){
    this.context.jobService.getJobResults(this.props.job.id);
  }
  jobOptionsMenu(){
    if(this.props.job.status === EJobStatus.completed){
      if(this.props.isSentJob){
        return(
          <Grid container style={{minWidth: 200}}>
            <Grid item xs={12}>
              <Tooltip disableFocusListener title="Download results" >
                <Fab
                  size="small"
                  onClick={this.handleDownloadResults}
                  style={{backgroundColor: linkBlue.background}}
                  className="add-cursor"
                >
                 <FontAwesomeIcon
                   icon={faArrowDown}
                   size="lg"
                   key={`${this.props.job.id}download`}
                   style={{color: linkBlue.main}}
                 />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        )
      }else{
        return;
      }
    }

    return(
      <Grid container style={{minWidth: 200}}>
        {this.props.job.status === EJobStatus.running ? (
          <>
          <Grid item xs={3}>
            <Tooltip disableFocusListener title="Pause job">
              <Fab
                size="small"
                onClick={this.pauseJob}
                style={{backgroundColor: linkBlue.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faPause}
                  size="sm"
                  key={`${this.props.job.id}pause`}
                  style={{color: linkBlue.main}}
                />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip disableFocusListener title="Cancel job">
              <Fab
                size="small"
                onClick={this.stopJob}
                style={{backgroundColor: red.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  key={`${this.props.job.id}stop`}
                  style={{color: red.main}}
                />
              </Fab>
            </Tooltip>
          </Grid>
            <Grid item xs={3}>
              <Tooltip disableFocusListener title="Process logs">
                <Fab
                  size="small"
                  onClick={this.openProcessLog}
                  style={{backgroundColor: linkBlue.background}}
                  className="add-cursor"
                >
                  <FontAwesomeIcon
                    icon={faInfo}
                    size="lg"
                    key={`${this.props.job.id}viewProcessLogs`}
                    style={{color: linkBlue.main}}
                  />
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={3}>
              <Tooltip disableFocusListener title="Standard logs">
                <Fab
                  size="small"
                  onClick={this.openStdoutLog}
                  style={{backgroundColor: linkBlue.background}}
                  className="add-cursor"
                >
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    size="lg"
                    key={`${this.props.job.id}viewStdout`}
                    style={{color: linkBlue.main}}
                  />
                </Fab>
              </Tooltip>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Tooltip disableFocusListener title="Start job">
              <Fab
                size="small"
                onClick={this.startJob}
                style={{backgroundColor: linkBlue.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faPlay}
                  size="sm"
                  key={`${this.props.job.id}start`}
                  onClick={this.startJob}
                  style={{color: linkBlue.main}}
                />
              </Fab>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    )
  }
  render(){
    const { job } = this.props;
    let timer = job.run_time;
    if(job.status === EJobStatus.running){
      timer = Math.floor(Math.floor(Date.now() / 1000) - job.last_updated) + job.run_time;
    }
    let time = this.parseTime(Math.floor(timer));
    let launchPad = this.props.users[job.launch_pad] ? this.props.users[job.launch_pad].username : job.launch_pad;
    let landingZone = this.props.machines[job.landing_zone] ? this.props.machines[job.landing_zone].machine_name : job.landing_zone;
    let date = new Date(job.upload_time * 1000).toString();
    let finalDate = date.slice(0, date.indexOf('GMT'));
    return(
      job &&
      <TableRow>
        <TableCell component="th" scope="row">
          <Grid container direction="column">
            <Grid item style={{color: "gray"}}>
              {finalDate}
            </Grid>
            <Grid item>
              {landingZone}
            </Grid>
          </Grid>
        </TableCell>
        <TableCell>{launchPad}</TableCell>
        <TableCell>{job.name}</TableCell>
        <TableCell align="center">{time.indexOf('.') < 0 ? time : time.substring(0, time.indexOf('.'))}</TableCell>
        <TableCell align="center">{JobStatusDecode[job.status.toString()]}</TableCell>
        <TableCell align="center">{this.jobOptionsMenu()}</TableCell>
      </TableRow>
    )
  }
}

Job.contextType = context;

const mapStateToProps = (state:IStore) => ({
  users: state.users.users,
  machines: state.machines.machines
});

const mapDispatchToProps = (dispatch:Dispatch) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(Job);
