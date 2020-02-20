import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import { EJobRunningStatus, EJobStatus } from "../../business/objects/job";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import React from "react";

type Props = {
  job: any;
  users: Dictionary<User>;
  machines: Dictionary<Machine>;
};
type State = {};

class StationJob extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public parseTime(
    secondsElapsed: number,
    timeString: string = "",
    shortDuration: boolean = true
  ): string {
    if (secondsElapsed >= 3600) {
      const hours: number = Math.floor(secondsElapsed / 3600);
      let hoursString: string = hours.toString();
      if (hours < 10) {
        hoursString = "0" + hours;
      }
      return this.parseTime(
        secondsElapsed - hours * 3600,
        `${hoursString}`,
        false
      );
    } else {
      let minutes = 0;
      let seconds = secondsElapsed;
      let minutesString = minutes.toString();
      let secondsString = seconds.toString();
      if (secondsElapsed >= 60) {
        minutes = Math.floor(secondsElapsed / 60);
        minutesString = minutes.toString();
        seconds = secondsElapsed - minutes * 60;
        secondsString = seconds.toString();
      }
      if (seconds < 10) {
        secondsString = "0" + seconds;
      }
      if (minutes < 10) {
        minutesString = "0" + minutes;
      }
      if (shortDuration) {
        return `00:${minutesString}:${secondsString}`;
      } else {
        return timeString + `:${minutesString}:${secondsString}`;
      }
    }
  }

  render() {
    const { job } = this.props;
    let timer = job.run_time;
    if (job.job_state === EJobRunningStatus.running) {
      timer =
        Math.floor(Math.floor(Date.now() / 1000) - job.last_updated) +
        job.run_time;
    }
    let time = this.parseTime(Math.floor(timer));
    let launchPad = this.props.users[job.launch_pad] ? this.props.users[job.launch_pad].username : job.launch_pad;
    let landingZone = this.props.machines[job.landing_zone] ? this.props.machines[job.landing_zone].machine_name : job.landing_zone;
    if(job.status !== EJobStatus.running){
      return(
        <>
        </>
      )
    }
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
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  users: state.users.users,
  machines: state.machines.machines
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StationJob);
