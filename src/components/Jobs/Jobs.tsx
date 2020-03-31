import { Box, Button, Card, Link, Typography } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import {
  GetJobFilters,
  Job as JobModel,
  decodeJobStatus
} from "../../business/objects/job";
import { History } from "history";
import { IStore } from "../../business/objects/store";
import { Link as LinkObject } from "react-router-dom";
import { Machine } from "../../business/objects/machine";
import { SentimentDissatisfied } from "@material-ui/icons";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import { withRouter } from "react-router-dom";
import ButtonGroup from "./ButtonGroup";
import CustomTable from "../Core/Table";
import Job from "./Job";
import React from "react";
import galileoRocket from "../../images/rocket-gray.png";
import store from "../../store/store";

type Props = {
  sentJobs: Dictionary<JobModel>;
  history: History<any>;
  receivedJobs: Dictionary<JobModel>;
  jobsSelected: boolean;
  currentUser: User;
  showButtonGroup?: boolean;
  numberOfJobs?: number;
  machines: Dictionary<Machine>;
};
// True = sent jobs
type State = {
  mode: string;
  offset: number;
  displayArchived: boolean;
  orderBy: TableHeaderId;
  order: "asc" | "desc";
  selectedButton: string;
};

export type TableHeaders = {
  id: string;
  align: "inherit" | "left" | "center" | "right" | "justify";
  label: string;
  sort: boolean;
};

export enum TableHeaderId {
  Uploaded = "uploaded",
  SentTo = "sentto",
  SentBy = "sentby",
  NameOfProject = "nameofproject",
  TimeTaken = "timetaken",
  Status = "status",
  Action = "action"
}

class Jobs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: "Sent",
      offset: 0,
      displayArchived: false,
      orderBy: TableHeaderId.SentTo,
      order: "desc",
      selectedButton: "Sent"
    };
    this.changeSelectedButton = this.changeSelectedButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDisplayArchived = this.toggleDisplayArchived.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
  }
  componentDidMount() {
    // if the view all jobs clicked on dashboard, jobs tab will be active on Sidebar
    if (!this.props.numberOfJobs) {
      store.dispatch({ type: "JOBS_SELECTED" });
    }

    if (this.props.currentUser.user_id !== "meme") {
      const currentUserFilters = new GetJobFilters(
        null,
        null,
        [this.props.currentUser.user_id],
        null,
        null,
        1,
        25
      );
      const currentUserMachineFilters = new GetJobFilters(
        null,
        this.props.currentUser.mids,
        null,
        null,
        null,
        1,
        25
      );
      this.context.jobService.getJobs(currentUserFilters);
      this.context.jobService.getJobs(currentUserMachineFilters);
    }
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.currentUser.user_id === "meme" &&
      this.props.currentUser.user_id !== "meme"
    ) {
      const filters = new GetJobFilters(
        null,
        null,
        [this.props.currentUser.user_id],
        null,
        null,
        1,
        25
      );
      const currentUserMachineFilters = new GetJobFilters(
        null,
        this.props.currentUser.mids,
        null,
        null,
        null,
        1,
        25
      );
      this.context.jobService.getJobs(filters);
      this.context.jobService.getJobs(currentUserMachineFilters);
    }
  }
  componentWillUnmount() {
    store.dispatch({ type: "JOBS_UNSELECTED" });
  }
  changeSelectedButton(newButton: string) {
    this.setState({ mode: newButton });
  }
  toggleDisplayArchived() {
    this.setState(prevState => ({
      displayArchived: !prevState.displayArchived
    }));
  }
  generateJobList(jobs: JobModel[]) {
    const { orderBy, order } = this.state;
    const jobList: JSX.Element[] = [];
    if (jobs.length > 0) {
      const jobs_reversed: JobModel[] = jobs.sort(
        (a: JobModel, b: JobModel) => {
          let job1;
          let job2;
          switch (orderBy) {
            case TableHeaderId.SentBy:
              job1 = a.launch_pad;
              job2 = b.launch_pad;
              break;
            case TableHeaderId.NameOfProject:
              job1 = a.name.toLowerCase();
              job2 = b.name.toLowerCase();
              break;
            case TableHeaderId.TimeTaken:
              job1 = a.run_time;
              job2 = b.run_time;
              break;
            case TableHeaderId.Status:
              job1 = decodeJobStatus(a.status.toString()).status;
              job2 = decodeJobStatus(b.status.toString()).status;
              break;
            case TableHeaderId.Action:
              break;
            case TableHeaderId.SentTo:
              job1 = this.props.machines[a.landing_zone]
                ? this.props.machines[a.landing_zone].machine_name
                : "Machine Pending";
              job2 = this.props.machines[b.landing_zone]
                ? this.props.machines[b.landing_zone].machine_name
                : "Machine Pending";
              break;
            default:
              job1 = a.upload_time;
              job2 = b.upload_time;
              break;
          }
          if (order == "desc") {
            if (job1 < job2) return 1;
            if (job1 > job2) return -1;
            return 0;
          } else {
            if (job1 < job2) return -1;
            if (job1 > job2) return 1;
            return 0;
          }
        }
      );
      if (!this.state.displayArchived) {
        jobs_reversed.slice(0, this.props.numberOfJobs).map((job, idx) => {
          if (!job.archived) {
            jobList.push(
              <Job
                key={job.id}
                job={job}
                isSentJob={this.state.mode === "Sent"}
                hasPerms={true}
              />
            );
          }
        });
      } else {
        jobs_reversed.slice(0, this.props.numberOfJobs).map((job, idx) => {
          if (job.archived) {
            jobList.push(
              <Job
                key={job.id}
                job={job}
                isSentJob={this.state.mode === "Sent"}
                hasPerms={true}
              />
            );
          }
        });
      }
    }

    return jobList;
  }
  handleClick(offset: number) {
    this.setState({
      offset
    });
  }

  sortHandler(id: TableHeaderId) {
    return (e: any) => {
      this.setState({
        orderBy: id,
        order: this.state.order == "asc" ? "desc" : "asc"
      });
    };
  }

  render() {
    const { mode, orderBy, order } = this.state;

    let jobs: Dictionary<JobModel> = {};
    if (mode === "Sent") {
      jobs = Object.assign({}, this.props.sentJobs);
    } else {
      jobs = Object.assign({}, this.props.receivedJobs);
    }

    const jobsList: JSX.Element[] = this.generateJobList(
      Object.keys(jobs).map(job_id => jobs[job_id])
    );

    const headCells: TableHeaders[] = [
      {
        id: TableHeaderId.Uploaded,
        align: "left",
        sort: true,
        label: "Uploaded"
      },
      { id: TableHeaderId.SentTo, align: "left", sort: true, label: "Sent To" },
      { id: TableHeaderId.SentBy, align: "left", sort: true, label: "Sent By" },
      {
        id: TableHeaderId.NameOfProject,
        align: "left",
        sort: true,
        label: "Name of Project"
      },
      {
        id: TableHeaderId.TimeTaken,
        align: "center",
        sort: true,
        label: "Time Taken"
      },
      {
        id: TableHeaderId.Status,
        align: "center",
        sort: true,
        label: "Status"
      },
      { id: TableHeaderId.Action, align: "left", sort: false, label: "Action" }
    ];

    return (
      <div className="jobs-container">
        <Box display="flex" justifyContent="center" flexGrow={3} mb={3}>
          {this.props.showButtonGroup !== false && (
            <ButtonGroup
              changeSelectedButton={this.changeSelectedButton}
              mode={this.state.mode}
              buttons={["Sent", "Received"]}
            />
          )}
        </Box>
        <Card>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            p={3}
          >
            {this.props.showButtonGroup != null && (
              <Typography variant="h4" style={{ fontWeight: 500 }}>
                Your Recent Jobs
              </Typography>
            )}
            {this.props.showButtonGroup == null && (
              <Typography
                variant="h4"
                style={{ fontWeight: 500 }}
                gutterBottom={true}
              >
                Your Recent {mode === "Sent" ? "Sent" : "Received"} Jobs
              </Typography>
            )}
            <Box>
              {this.props.showButtonGroup != null ? (
                <Link component={LinkObject} to="/jobs/">
                  {"View All Jobs >"}
                </Link>
              ) : (
                <Button color="primary" onClick={this.toggleDisplayArchived}>
                  {this.state.displayArchived ? "Back" : "View Archived Jobs"}
                </Button>
              )}
            </Box>
          </Box>

          <Box m={3}>
            {Object.keys(jobs).length > 0 ? (
              <CustomTable
                numberOfJobs={this.props.numberOfJobs}
                tableBodyItems={jobsList}
                tableHeaders={headCells}
                order={order}
                orderBy={orderBy}
                sortHandler={this.sortHandler}
                showSort={this.props.showButtonGroup}
              />
            ) : (
              <Box
                display="flex"
                mt={3}
                mb={3}
                justifyContent="center"
                alignItems="center"
              >
                <Box mr={5}>
                  <img
                    src={galileoRocket}
                    alt="Empty Inbox"
                    width="100"
                    height="100"
                  />
                </Box>
                <Typography>
                  {" "}
                  You have no jobs.{" "}
                  <a
                    href="https://github.com/GoHypernet/Galileo-examples/archive/master.zip"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download some sample jobs to run.
                  </a>{" "}
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </div>
    );
  }
}

Jobs.contextType = context;

const mapStateToProps = (state: IStore) => {
  return {
    sentJobs: state.jobs.sentJobs,
    receivedJobs: state.jobs.receivedJobs,
    currentUser: state.users.currentUser,
    jobsSelected: state.jobs.jobsSelected,
    machines: state.machines.machines
  };
};

export default connect(mapStateToProps)(Jobs);
