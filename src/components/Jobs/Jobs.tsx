import { Dictionary } from "../../business/objects/dictionary";
import { GetJobFilters, Job as JobModel } from "../../business/objects/job";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  Box
} from "@material-ui/core";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
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
};

class Jobs extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: true,
      offset: 0
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
  generateJobList(jobs: JobModel[]) {
    if (jobs.length > 0) {
      const jobs_reversed: JobModel[] = jobs.sort(
        (a: JobModel, b: JobModel) => {
          if (a.upload_time < b.upload_time) return 1;
          if (a.upload_time > b.upload_time) return -1;
          return 0;
        }
      );
      return jobs_reversed.slice(0,this.props.numberOfJobs).map((job, idx) => {
        return <Job key={job.id} job={job} isSentJob={this.state.mode} />;
      });
    }
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
    return (
      <div className="jobs-container">
        <Grid container justify="center">
          <Grid item>
            {this.props.showButtonGroup !== false &&
            <JobsButtonGroup
              toggleMode={this.toggleMode}
              mode={this.state.mode}
            />}
          </Grid>
        </Grid>
        <Card>
          <Box p = {3}>
        <Typography
          variant="h4"
          style={{ fontWeight: 500 }}
          gutterBottom={true}
        >
          Your Recent {mode ? "Sent" : "Received"} Jobs
        </Typography>
        {Object.keys(jobs).length > 0 ? (
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sent to</TableCell>
                  <TableCell>Sent by</TableCell>
                  <TableCell>Name of project</TableCell>
                  <TableCell align="center">Time taken</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.generateJobList(
                  Object.keys(jobs).map(job_id => jobs[job_id])
                )}
              </TableBody>
            </Table>
            {
              // <Pagination
              //  limit={10}
              //  offset={this.state.offset}
              //  total={100}
              //  onClick={(e, offset) => this.handleClick(offset)}
              //  />
            }
          </TableContainer>
        ) : (
          <h4>No jobs</h4>
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
  };
};

export default connect(mapStateToProps)(Jobs);
