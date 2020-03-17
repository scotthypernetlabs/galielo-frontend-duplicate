import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import {GetJobFilters, Job as JobModel, JobStatusDecode, decodeJobStatus} from "../../business/objects/job";
import { IStore } from "../../business/objects/store";
import { Link as LinkObject } from "react-router-dom";
import { MyContext } from "../../MyContext";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import CustomTable from "../Core/Table";
import Job from "./Job";
import JobsButtonGroup from "./JobsButtonGroup";
import React from "react";
import galileoRocket from "../../images/rocket-gray.png";

type Props = {
  sentJobs: Dictionary<JobModel>;
  receivedJobs: Dictionary<JobModel>;
  currentUser: User;
  showButtonGroup?: boolean;
  numberOfJobs?: number;
};
// True = sent jobs
type State = {
  mode: boolean;
  offset: number;
  displayArchived: boolean;
  orderBy: TableHeaderId;
  order: "asc" | "desc";
};

export type TableHeaders = {
  id: string;
  align: "inherit" | "left" | "center" | "right" | "justify";
  label: string;
  sort: boolean;
};

export enum TableHeaderId {
  SentTo = "sentto",
  SentBy = "sentby",
  NameOfProject = "nameofproject",
  TimeTaken = "timetaken",
  Status = "status",
  Action = "action"
}

class Jobs extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: true,
      offset: 0,
      displayArchived: false,
      orderBy: TableHeaderId.SentTo,
      order: "desc"
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDisplayArchived = this.toggleDisplayArchived.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
  }
  componentDidMount() {
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
  toggleMode() {
    this.setState(prevState => ({
      mode: !prevState.mode
    }));
  }
  toggleDisplayArchived() {
    this.setState(prevState => ({
      displayArchived: !prevState.displayArchived
    }));
  }
  generateJobList(jobs: JobModel[]): JSX.Element[] {
    const { orderBy, order } = this.state;
    const jobList: JSX.Element[] = [];

    if (jobs.length > 0) {
      const jobs_reversed: JobModel[] = jobs.sort(
        (a: JobModel, b: JobModel) => {
          let var1;
          let var2;
          switch (orderBy) {
            case TableHeaderId.SentBy:
              var1 = a.launch_pad;
              var2 = b.launch_pad;
              break;
            case TableHeaderId.NameOfProject:
              var1 = a.name.toLowerCase();
              var2 = b.name.toLowerCase();
              break;
            case TableHeaderId.TimeTaken:
              var1 = a.run_time;
              var2 = b.run_time;
              break;
            case TableHeaderId.Status:
              var1 = decodeJobStatus(a.status.toString()).status;
              var2 = decodeJobStatus(b.status.toString()).status;
              break;
            case TableHeaderId.Action:
              break;
            default:
              var1 = a.upload_time;
              var2 = b.upload_time;
              break;
          }
          if (order == "desc") {
            if (var1 < var2) return 1;
            if (var1 > var2) return -1;
            return 0;
          } else {
            if (var1 < var2) return -1;
            if (var1 > var2) return 1;
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
                isSentJob={this.state.mode}
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
                isSentJob={this.state.mode}
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
    if (mode) {
      jobs = Object.assign({}, this.props.sentJobs);
    } else {
      jobs = Object.assign({}, this.props.receivedJobs);
    }

    const jobsList: JSX.Element[] = this.generateJobList(
      Object.keys(jobs).map(job_id => jobs[job_id])
    );

    const headCells: TableHeaders[] = [
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
            <JobsButtonGroup
              toggleMode={this.toggleMode}
              mode={this.state.mode}
            />
          )}
        </Box>
        <Box>
          {this.props.showButtonGroup != null ? (
            <Link component={LinkObject} to="/jobs/">
              View All Jobs >
            </Link>
          ) : (
            <Button color="primary" onClick={this.toggleDisplayArchived}>
              {this.state.displayArchived ? "Back" : "View Archived Jobs"}
            </Button>
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
                Your Recent {mode ? "Sent" : "Received"} Jobs
              </Typography>
            )}

            <Box>
              {this.props.showButtonGroup != null ? (
                <Link component={LinkObject} to="/jobs/">
                  View All Jobs >
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
                    href="https://github.com/GoHypernet/Galileo-examples"
                    target="_blank"
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
    currentUser: state.users.currentUser
  };
};

export default connect(mapStateToProps)(Jobs);
