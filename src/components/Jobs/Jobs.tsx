import { Box, Button, Link, Typography } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { GetJobFilters, Job as JobModel } from "../../business/objects/job";
import { IStore } from "../../business/objects/store";
import { Link as LinkObject } from "react-router-dom";
import { MyContext } from "../../MyContext";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import CustomTable, { TableHeader } from "../Core/Table";
import Job from "./Job";
import JobsButtonGroup from "./JobsButtonGroup";
import React from "react";

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
};

class Jobs extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: true,
      offset: 0,
      displayArchived: false
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDisplayArchived = this.toggleDisplayArchived.bind(this);
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
    const jobList: JSX.Element[] = [];

    if (jobs.length > 0) {
      const jobs_reversed: JobModel[] = jobs.sort(
        (a: JobModel, b: JobModel) => {
          if (a.upload_time < b.upload_time) return 1;
          if (a.upload_time > b.upload_time) return -1;
          return 0;
        }
      );
      if (!this.state.displayArchived) {
        jobs_reversed.slice(0, this.props.numberOfJobs).map((job, idx) => {
          if (!job.archived) {
            jobList.push(
              <Job key={job.id} job={job} isSentJob={this.state.mode} />
            );
          }
        });
      } else {
        jobs_reversed.slice(0, this.props.numberOfJobs).map((job, idx) => {
          if (job.archived) {
            jobList.push(
              <Job key={job.id} job={job} isSentJob={this.state.mode} />
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
  render() {
    const { mode } = this.state;

    let jobs: Dictionary<JobModel> = {};
    if (mode) {
      jobs = Object.assign({}, this.props.sentJobs);
    } else {
      jobs = Object.assign({}, this.props.receivedJobs);
    }

    const jobsList: JSX.Element[] = this.generateJobList(
      Object.keys(jobs).map(job_id => jobs[job_id])
    );

    const tableHeaders: TableHeader[] = [
      { "Sent To": "justify" },
      { "Sent By": "justify" },
      { "Name of Project": "justify" },
      { "Time Taken": "center" },
      { Status: "center" },
      { Actions: "justify" }
    ];

    return (
      <div className="jobs-container">
        <Box display="flex" flexDirection="row">
          <Box display="flex" justifyContent="center" flexGrow={3}>
            <Box>
              {this.props.showButtonGroup && (
                <JobsButtonGroup
                  toggleMode={this.toggleMode}
                  mode={this.state.mode}
                />
              )}
            </Box>
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
        </Box>
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
        {Object.keys(jobs).length > 0 ? (
          <CustomTable tableBodyItems={jobsList} tableHeaders={tableHeaders} />
        ) : (
          <h4>No jobs</h4>
        )}
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
