import {
  Box,
  Dialog,
  Fab,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  EJobStatus,
  Job as JobModel,
  JobStatus
} from "../../business/objects/job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStore } from "../../business/objects/store";
import { JobStatusDecode } from "../../business/objects/job";
import { JobsLog, JobsTop } from "../../api/interfaces/IGalileoApi";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import {
  faArrowDown,
  faFileAlt,
  faInfo,
  faPause,
  faPlay,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { linkBlue, red } from "../theme";
import ArchiveOutlineIcon from "@material-ui/icons/Archive";
import Base, { Subscription } from "../Base/Base";
import LogModalView from "../Modals/LogModal/LogModalView";
import React from "react";
import StatusHistoryModal from "../Modals/StatusHistoryModal";
import TopModalView from "../Modals/TopModal/TopModalView";
import UnarchiveIcon from "@material-ui/icons/Unarchive";

type Props = {
  job: JobModel;
  isSentJob: boolean;
  users: Dictionary<User>;
  machines: Dictionary<Machine>;
};

type State = {
  counter: number;
  timer: string;
  isTopModalOpen: boolean;
  isLogModalOpen: boolean;
  isHistoryModalOpen: boolean;
  topLogs: any;
  logs: any;
  isMenuOpen: boolean;
  archived: boolean;
};

class Job extends Base<Props, State> {
  context!: MyContext;
  clockTimer: any;
  constructor(props: Props) {
    super(props);
    this.jobOptionsMenu = this.jobOptionsMenu.bind(this);
    this.startJob = this.startJob.bind(this);
    this.stopJob = this.stopJob.bind(this);
    this.pauseJob = this.pauseJob.bind(this);
    this.archiveJob = this.archiveJob.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.openProcessLog = this.openProcessLog.bind(this);
    this.openStdoutLog = this.openStdoutLog.bind(this);
    this.handleDownloadResults = this.handleDownloadResults.bind(this);
    this.handleTopClose = this.handleTopClose.bind(this);
    this.handleLogClose = this.handleLogClose.bind(this);
    this.openStatusHistoryDialog = this.openStatusHistoryDialog.bind(this);
    this.handleStatusHistoryClose = this.handleStatusHistoryClose.bind(this);
    this.state = {
      timer: "off",
      counter: 0,
      isTopModalOpen: false,
      isLogModalOpen: false,
      isHistoryModalOpen: false,
      topLogs: undefined,
      logs: undefined,
      isMenuOpen: false,
      archived: this.props.job.archived
    };
  }
  componentDidMount() {
    const { job } = this.props;
    this.clockTimer = setInterval(() => {
      if (job.status === EJobStatus.running) {
        this.setState(prevState => {
          console.log("in the cdm", this.state.archived);
          return { counter: prevState.counter + 1, timer: "on" };
        });
      }
    }, 1000);

    this.subscribe(
      new Subscription(
        this.context.galileoAPI.onJobsTop,
        (jobsTop: JobsTop) => {
          if (job.id !== jobsTop.jobs.jobid) return;
          this.setState({ topLogs: jobsTop.logs });
        }
      )
    );

    this.subscribe(
      new Subscription(
        this.context.galileoAPI.onJobsLog,
        (jobsLog: JobsLog) => {
          if (job.id !== jobsLog.jobs.jobid) return;
          this.setState({ logs: jobsLog.logs });
        }
      )
    );
  }
  componentWillUnmount() {
    clearInterval(this.clockTimer);
  }
  public parseTime(
    seconds_elapsed: number,
    timeString: string = "",
    shortDuration: boolean = true
  ): string {
    if (seconds_elapsed >= 3600) {
      const hours: number = Math.floor(seconds_elapsed / 3600);
      let hours_string: string = hours.toString();
      if (hours < 10) {
        hours_string = "0" + hours;
      }
      return this.parseTime(
        seconds_elapsed - hours * 3600,
        `${hours_string}`,
        false
      );
    } else {
      let minutes = 0;
      let seconds = seconds_elapsed;
      let minutes_string = minutes.toString();
      let seconds_string = seconds.toString();
      if (seconds_elapsed >= 60) {
        minutes = Math.floor(seconds_elapsed / 60);
        minutes_string = minutes.toString();
        seconds = seconds_elapsed - minutes * 60;
        seconds_string = seconds.toString();
      }
      if (seconds < 10) {
        seconds_string = "0" + seconds;
      }
      if (minutes < 10) {
        minutes_string = "0" + minutes;
      }
      if (shortDuration) {
        return `00:${minutes_string}:${seconds_string}`;
      } else {
        return timeString + `:${minutes_string}:${seconds_string}`;
      }
    }
  }
  startJob() {
    this.context.jobService.startJob(this.props.job.id, this.props.isSentJob);
  }
  stopJob() {
    this.context.jobService.stopJob(this.props.job.id, this.props.isSentJob);
  }
  pauseJob() {
    this.context.jobService.pauseJob(this.props.job.id, this.props.isSentJob);
  }
  archiveJob() {
    this.toggleArchiveStatus();
    this.context.jobService.archiveJob(
      this.props.job.id,
      this.props.isSentJob,
      !this.state.archived
    );
  }

  toggleArchiveStatus() {
    this.setState(prevState => {
      return { archived: !prevState.archived };
    });
  }

  async openProcessLog() {
    let toplogs = await this.context.jobService.getProcessInfo(this.props.job.id);
    console.log(toplogs);
    this.setState({ isTopModalOpen: true , topLogs: toplogs});
  }
  async openStdoutLog() {
    let logs = await this.context.jobService.getLogInfo(this.props.job.id);
    console.log(logs);
    this.setState({ isLogModalOpen: true, logs: logs});
  }
  openStatusHistoryDialog() {
    this.setState({ isHistoryModalOpen: true });
  }
  handleDownloadResults() {
    this.context.jobService.getJobResults(this.props.job.id);
  }
  containsResults(job_status_history: JobStatus[]) {
    for (let i = 0; i < job_status_history.length; i++) {
      if (job_status_history[i].status === EJobStatus.results_posted) {
        return true;
      }
    }
    return false;
  }
  handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ isMenuOpen: true });
  }
  handleClose() {
    this.setState({ isMenuOpen: false });
  }
  jobOptionsMenu() {
    const { job } = this.props;

    if (this.props.isSentJob) {
      if (this.containsResults(job.status_history)) {
        return (
          <Box display="flex" alignItems="center">
            <Box>
              <Tooltip disableFocusListener title="Download results">
                <Fab
                  size="small"
                  onClick={this.handleDownloadResults}
                  style={{ backgroundColor: linkBlue.background }}
                  className="add-cursor"
                >
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    size="lg"
                    key={`${this.props.job.id}download`}
                    style={{ color: linkBlue.main }}
                  />
                </Fab>
              </Tooltip>
            </Box>
            <Tooltip
              disableFocusListener
              title={this.state.archived ? "Unarchive" : "Archive"}
            >
              <Box ml={2} display="flex" alignItems="center">
                <IconButton aria-label="archive" onMouseUp={this.archiveJob}>
                  {!this.props.job.archived && (
                    <>
                      {" "}
                      <ArchiveOutlineIcon fontSize="small" />{" "}
                    </>
                  )}
                  {this.props.job.archived && (
                    <>
                      {" "}
                      <UnarchiveIcon fontSize="small" />{" "}
                    </>
                  )}
                </IconButton>
              </Box>
            </Tooltip>
          </Box>
        );
      }
    }

    if (JobStatusDecode[job.status.toString()].status == "Job In Progress") {
      return (
        <Box
          display="flex"
          flexWrap="nowrap"
          p={1}
          m={1}
          bgcolor="background.paper"
          css={{ maxWidth: 300 }}
        >
          <Box mr={1}>
            <Tooltip disableFocusListener title="Pause job">
              <Fab
                size="small"
                onClick={this.pauseJob}
                style={{ backgroundColor: linkBlue.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faPause}
                  size="sm"
                  key={`${this.props.job.id}pause`}
                  style={{ color: linkBlue.main }}
                />
              </Fab>
            </Tooltip>
          </Box>
          <Box mr={1}>
            <Tooltip disableFocusListener title="Cancel job">
              <Fab
                size="small"
                onClick={this.stopJob}
                style={{ backgroundColor: red.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  key={`${this.props.job.id}stop`}
                  style={{ color: red.main }}
                />
              </Fab>
            </Tooltip>
          </Box>
          <Box mr={1}>
            <Tooltip disableFocusListener title="Process logs">
              <Fab
                size="small"
                onClick={this.openProcessLog}
                style={{ backgroundColor: linkBlue.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faInfo}
                  size="lg"
                  key={`${this.props.job.id}viewProcessLogs`}
                  style={{ color: linkBlue.main }}
                />
              </Fab>
            </Tooltip>
          </Box>
          <Box mr={1}>
            <Tooltip disableFocusListener title="Standard logs">
              <Fab
                size="small"
                onClick={this.openStdoutLog}
                style={{ backgroundColor: linkBlue.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  size="lg"
                  key={`${this.props.job.id}viewStdout`}
                  style={{ color: linkBlue.main }}
                />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
      );
    }

    if (JobStatusDecode[job.status.toString()].status == "Job Paused") {
      return (
        <Grid container style={{ minWidth: 200 }}>
          <Grid item xs={3}>
            <Tooltip disableFocusListener title="Start job">
              <Fab
                size="small"
                onClick={this.startJob}
                style={{ backgroundColor: linkBlue.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faPlay}
                  size="sm"
                  key={`${this.props.job.id}start`}
                  onClick={this.startJob}
                  style={{ color: linkBlue.main }}
                />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip disableFocusListener title="Cancel job">
              <Fab
                size="small"
                onClick={this.stopJob}
                style={{ backgroundColor: red.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  key={`${this.props.job.id}stop`}
                  style={{ color: red.main }}
                />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip disableFocusListener title="Process logs">
              <Fab
                size="small"
                onClick={this.openProcessLog}
                style={{ backgroundColor: linkBlue.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faInfo}
                  size="lg"
                  key={`${this.props.job.id}viewProcessLogs`}
                  style={{ color: linkBlue.main }}
                />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip disableFocusListener title="Standard logs">
              <Fab
                size="small"
                onClick={this.openStdoutLog}
                style={{ backgroundColor: linkBlue.background }}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  size="lg"
                  key={`${this.props.job.id}viewStdout`}
                  style={{ color: linkBlue.main }}
                />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      );
    }
  }
  calculateRuntime(job: JobModel): number {
    if (job.status_history.length === 0) {
      return 0;
    }
    const status_history = job.status_history.sort(
      (a: JobStatus, b: JobStatus) => {
        return a.timestamp - b.timestamp;
      }
    );
    let total_runtime = 0;
    let running = false;
    let last_history: JobStatus = null;
    let time_start = 0;
    let segment_seconds = 0;
    status_history.forEach((history: JobStatus) => {
      last_history = history;
      if (!running && history.status === EJobStatus.running) {
        time_start = history.timestamp;
        running = true;
      } else if (
        (running && history.status === EJobStatus.paused) ||
        history.status === EJobStatus.stopped ||
        history.status === EJobStatus.exited ||
        history.status === EJobStatus.terminated ||
        history.status === EJobStatus.completed
      ) {
        segment_seconds = history.timestamp - time_start;
        total_runtime += segment_seconds;
        running = false;
      }
    });
    if (running) {
      segment_seconds = Math.floor(Date.now() / 1000) - last_history.timestamp;
      total_runtime += segment_seconds;
    }
    return total_runtime;
  }

  handleTopClose() {
    this.setState({ isTopModalOpen: false });
  }

  handleLogClose() {
    this.setState({ isLogModalOpen: false });
  }

  handleStatusHistoryClose() {
    this.setState({ isHistoryModalOpen: false });
  }

  render() {
    const { job } = this.props;
    const {
      topLogs,
      logs,
      isTopModalOpen,
      isLogModalOpen,
      isHistoryModalOpen
    } = this.state;
    const timer = this.calculateRuntime(job);
    const time = this.parseTime(Math.floor(timer));
    const launchPad = this.props.users[job.launch_pad]
      ? this.props.users[job.launch_pad].username
      : job.launch_pad;
    const landingZone = this.props.machines[job.landing_zone]
      ? this.props.machines[job.landing_zone].machine_name
      : job.landing_zone;
    const date = new Date(job.upload_time * 1000).toString();
    const finalDate = date.slice(0, date.indexOf("GMT"));
    return (
      job && (
        <>
          <TableRow>
            <TableCell component="th" scope="row">
              <Grid container direction="column">
                <Grid item style={{ color: "gray" }}>
                  {finalDate}
                </Grid>
                <Grid item>
                  {landingZone ? landingZone : "Machine Pending"}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell>{launchPad}</TableCell>
            <TableCell>{job.name}</TableCell>
            <TableCell align="center">
              {time.indexOf(".") < 0
                ? time
                : time.substring(0, time.indexOf("."))}
            </TableCell>
            <TableCell align="center">
              <Link color="inherit" onClick={this.openStatusHistoryDialog}>
                {JobStatusDecode[job.status.toString()]
                  ? JobStatusDecode[job.status.toString()].status
                  : job.status.toString()}
              </Link>
            </TableCell>
            <TableCell align="center">{this.jobOptionsMenu()}</TableCell>
          </TableRow>
          <TopModalView
            text={topLogs}
            isOpen={isTopModalOpen}
            handleClose={this.handleTopClose}
          />
          <LogModalView
            text={logs}
            handleClose={this.handleLogClose}
            isOpen={isLogModalOpen}
          />
          <StatusHistoryModal
            statusHistory={job.status_history}
            isOpen={isHistoryModalOpen}
            handleClose={this.handleStatusHistoryClose}
            title="Job Status History"
          />
        </>
      )
    );
  }
}

Job.contextType = context;

const mapStateToProps = (state: IStore) => ({
  users: state.users.users,
  machines: state.machines.machines
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Job);
