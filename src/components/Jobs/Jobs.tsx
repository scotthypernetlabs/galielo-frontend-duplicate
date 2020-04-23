import { Box, Button, Card, Link, Typography } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  EConflatedJobStatus,
  ESortBy,
  GetJobFilters,
  Job as JobModel
} from "../../business/objects/job";
import { History } from "history";
import {
  IReceiveSearchedReceivedJobs,
  IReceiveSearchedSentJobs,
  receiveSearchedReceivedJobs,
  receiveSearchedSentJobs
} from "../../actions/jobActions";
import { IStore } from "../../business/objects/store";
import { Link as LinkObject } from "react-router-dom";
import { Machine } from "../../business/objects/machine";
import { SearchBar } from "../Core/SearchBar";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import ButtonGroup from "./ButtonGroup";
import CustomTable from "../Core/Table";
import FilterMenu from "../Core/FilterMenu";
import Job from "./Job";
import React from "react";
import galileoRocket from "../../images/rocket-gray.png";
import store from "../../store/store";

type Props = {
  sentJobs: JobModel[];
  history: History<any>;
  receivedJobs: JobModel[];
  jobsSelected: boolean;
  currentUser: User;
  showButtonGroup?: boolean;
  numberOfJobs?: number;
  machines: Dictionary<Machine>;
  receiveSearchedSentJobs: (
    jobs: Dictionary<JobModel>
  ) => IReceiveSearchedSentJobs;
  receiveSearchedReceivedJobs: (
    jobs: Dictionary<JobModel>
  ) => IReceiveSearchedReceivedJobs;
  searchedSentJobs: Dictionary<JobModel>;
  searchedReceivedJobs: Dictionary<JobModel>;
};
// True = sent jobs
type State = {
  mode: string;
  offset: number;
  displayArchived: boolean;
  orderBy: ESortBy;
  order: "asc" | "desc";
  selectedButton: string;
  searchQuery: string;
  statuses: EConflatedJobStatus[];
};

export type TableHeaders = {
  id: string;
  align: "inherit" | "left" | "center" | "right" | "justify";
  label: string;
  sort: boolean;
  icon?: JSX.Element;
};

class Jobs extends React.Component<Props, State> {
  headCells: TableHeaders[];
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: "Sent",
      offset: 0,
      displayArchived: false,
      orderBy: ESortBy.UploadDate,
      order: "desc",
      selectedButton: "Sent",
      searchQuery: "",
      statuses: []
    };
    this.changeSelectedButton = this.changeSelectedButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDisplayArchived = this.toggleDisplayArchived.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.headCells = [
      {
        id: ESortBy.UploadDate,
        align: "left",
        sort: true,
        label: "Uploaded"
      },
      { id: ESortBy.SentTo, align: "left", sort: true, label: "Sent To" },
      { id: ESortBy.SentBy, align: "left", sort: true, label: "Sent By" },
      {
        id: ESortBy.ProjectName,
        align: "left",
        sort: true,
        label: "Name of Project"
      },
      {
        id: ESortBy.TimeTaken,
        align: "center",
        sort: true,
        label: "Time Taken"
      },
      {
        id: ESortBy.Status,
        align: "center",
        sort: false,
        label: "Status",
        icon: (
          <FilterMenu
            list={Object.keys(EConflatedJobStatus).filter(
              value => isNaN(Number(value)) === true
            )}
            onClick={(checked: string[]) => {
              const statuses: any[] = checked.map((value: string) => {
                // @ts-ignore
                return EConflatedJobStatus[value];
              });
              this.setState({ statuses });
              this.context.jobService.getJobs(
                new GetJobFilters(
                  null,
                  null,
                  [this.props.currentUser.user_id],
                  null,
                  statuses,
                  null,
                  1,
                  100,
                  [this.state.orderBy],
                  this.state.order,
                  false
                )
              );
            }}
          />
        )
      },
      { id: ESortBy.Action, align: "left", sort: false, label: "Action" }
    ];
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
        null,
        1,
        25
        // [ESortBy.UploadDate],
        // "desc"
      );
      const currentUserMachineFilters = new GetJobFilters(
        null,
        this.props.currentUser.mids,
        null,
        null,
        null,
        null,
        1,
        25
        // [ESortBy.UploadDate],
        // "desc"
      );
      // this.context.jobService.getJobs(currentUserFilters);
      // this.context.jobService.getJobs(currentUserMachineFilters);
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
        null,
        1,
        25
      );
      // this.context.jobService.getJobs(filters);
      // this.context.jobService.getJobs(currentUserMachineFilters);
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
    const jobList: JSX.Element[] = [];
    if (jobs.length > 0) {
      if (!this.state.displayArchived) {
        jobs.slice(0, this.props.numberOfJobs).map((job, idx) => {
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
        jobs.slice(0, this.props.numberOfJobs).map((job, idx) => {
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

  sortHandler(id: ESortBy) {
    return () => {
      const order = this.state.order == "asc" ? "desc" : "asc";
      this.context.jobService.getJobs(
        new GetJobFilters(
          null,
          null,
          [this.props.currentUser.user_id],
          null,
          this.state.statuses,
          null,
          1,
          100,
          [id],
          order,
          false
        )
      );
      this.setState({
        orderBy: id,
        order
      });
    };
  }

  async onInputChange(e: React.ChangeEvent<{ value: string }>) {
    const input = e.target.value;
    this.setState({ searchQuery: input });
    if (input.length === 0) {
      this.props.receiveSearchedSentJobs({});
      this.props.receiveSearchedReceivedJobs({});
    } else {
      await this.context.jobService.searchJobName(
        new GetJobFilters(
          undefined,
          undefined,
          [this.props.currentUser.user_id],
          undefined,
          undefined,
          [input]
        )
      );
    }
  }

  render() {
    const { mode, orderBy, order, searchQuery } = this.state;

    let jobs: JobModel[];
    if (mode === "Sent") {
      if (searchQuery.length == 0) {
        jobs = this.props.sentJobs;
      } else {
        // jobs = Object.assign({}, this.props.searchedSentJobs);
      }
    } else {
      if (searchQuery.length == 0) {
        // jobs = Object.assign({}, this.props.receivedJobs);
      } else {
        // jobs = Object.assign({}, this.props.searchedReceivedJobs);
      }
    }

    const jobsList: JSX.Element[] = this.generateJobList(jobs);

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
        {this.props.showButtonGroup !== false && (
          <Box flexGrow={1} mb={2}>
            <SearchBar
              placeholder="Search jobs by name"
              onInputChange={this.onInputChange}
            />
          </Box>
        )}
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
            {(Object.keys(jobs).length > 0 ||
              this.props.showButtonGroup !== false) && (
              <CustomTable
                numberOfJobs={this.props.numberOfJobs}
                tableBodyItems={jobsList}
                tableHeaders={this.headCells}
                order={order}
                orderBy={orderBy}
                sortHandler={this.sortHandler}
                showSort={this.props.showButtonGroup}
              />
            )}
            {Object.keys(jobs).length == 0 &&
              this.props.showButtonGroup == false && (
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
    machines: state.machines.machines,
    searchedSentJobs: state.jobs.searchedSentJobs,
    searchedReceivedJobs: state.jobs.searchedReceivedJobs
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveSearchedSentJobs: (jobs: Dictionary<JobModel>) =>
    dispatch(receiveSearchedSentJobs(jobs)),
  receiveSearchedReceivedJobs: (jobs: Dictionary<JobModel>) =>
    dispatch(receiveSearchedReceivedJobs(jobs))
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
