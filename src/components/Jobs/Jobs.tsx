import { Box, Button, Card, Link, Typography } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  EConflatedJobStatus,
  EJobSortBy,
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
import NoJobs from "./NoJobs";
import React from "react";
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
  receiveSearchedSentJobs: (jobs: JobModel[]) => IReceiveSearchedSentJobs;
  receiveSearchedReceivedJobs: (
    jobs: JobModel[]
  ) => IReceiveSearchedReceivedJobs;
  searchedSentJobs: JobModel[];
  searchedReceivedJobs: JobModel[];
};
// True = sent jobs
type State = {
  mode: "Sent" | "Received";
  offset: number;
  displayArchived: boolean;
  orderBy: EJobSortBy;
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
      orderBy: EJobSortBy.UploadDate,
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
        id: EJobSortBy.UploadDate,
        align: "left",
        sort: true,
        label: "Uploaded"
      },
      { id: EJobSortBy.SentTo, align: "left", sort: true, label: "Sent To" },
      { id: EJobSortBy.SentBy, align: "left", sort: true, label: "Sent By" },
      {
        id: EJobSortBy.ProjectName,
        align: "left",
        sort: true,
        label: "Name of Project"
      },
      {
        id: EJobSortBy.TimeTaken,
        align: "center",
        sort: false,
        label: "Time Taken"
      },
      {
        id: EJobSortBy.Status,
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
                  this.state.mode == "Sent"
                    ? [this.props.currentUser.user_id]
                    : null,
                  null,
                  statuses,
                  [this.state.searchQuery],
                  1,
                  100,
                  [this.state.orderBy],
                  this.state.order,
                  this.state.displayArchived,
                  this.state.mode == "Received" ? 1 : null,
                  this.state.mode == "Received"
                    ? [this.props.currentUser.user_id]
                    : null
                )
              );
            }}
          />
        )
      },
      { id: EJobSortBy.Action, align: "left", sort: false, label: "Action" }
    ];
  }
  componentDidMount() {
    // if the view all jobs clicked on dashboard, jobs tab will be active on Sidebar
    if (!this.props.numberOfJobs) {
      store.dispatch({ type: "JOBS_SELECTED" });
    }
  }
  componentWillUnmount() {
    store.dispatch({ type: "JOBS_UNSELECTED" });
  }
  changeSelectedButton(newButton: "Sent" | "Received") {
    this.context.jobService.getJobs(
      new GetJobFilters(
        null,
        null,
        newButton == "Sent" ? [this.props.currentUser.user_id] : null,
        null,
        this.state.statuses,
        [this.state.searchQuery],
        1,
        100,
        [this.state.orderBy],
        this.state.order,
        this.state.displayArchived,
        newButton == "Received" ? 1 : null,
        newButton == "Received" ? [this.props.currentUser.user_id] : null
      )
    );
    this.setState({ mode: newButton });
  }
  toggleDisplayArchived() {
    const { mode } = this.state;
    this.context.jobService.getJobs(
      new GetJobFilters(
        null,
        null,
        mode == "Sent" ? [this.props.currentUser.user_id] : null,
        null,
        this.state.statuses,
        [this.state.searchQuery],
        1,
        100,
        [this.state.orderBy],
        this.state.order,
        !this.state.displayArchived,
        mode == "Received" ? 1 : null,
        mode == "Received" ? [this.props.currentUser.user_id] : null
      )
    );
    this.setState(prevState => ({
      displayArchived: !prevState.displayArchived
    }));
  }
  generateJobList(jobs: JobModel[]) {
    const jobList: JSX.Element[] = [];
    if (jobs && jobs.length > 0) {
      jobs.slice(0, this.props.numberOfJobs).map(job => {
        jobList.push(
          <Job
            key={job.id}
            job={job}
            isSentJob={this.state.mode === "Sent"}
            hasPerms={true}
          />
        );
      });
    }
    return jobList;
  }
  handleClick(offset: number) {
    this.setState({
      offset
    });
  }
  sortHandler(id: EJobSortBy) {
    return () => {
      let order: "asc" | "desc";
      if (this.state.orderBy !== id) {
        order = "desc";
      } else {
        order = this.state.order == "asc" ? "desc" : "asc";
      }
      this.context.jobService.getJobs(
        new GetJobFilters(
          null,
          null,
          this.state.mode == "Sent" ? [this.props.currentUser.user_id] : null,
          null,
          this.state.statuses,
          [this.state.searchQuery],
          1,
          100,
          [id],
          order,
          this.state.displayArchived,
          this.state.mode == "Received" ? 1 : null,
          this.state.mode == "Received"
            ? [this.props.currentUser.user_id]
            : null
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
      this.props.receiveSearchedSentJobs([]);
      this.props.receiveSearchedReceivedJobs([]);
    } else {
      await this.context.jobService.searchJobName(
        new GetJobFilters(
          null,
          null,
          this.state.mode == "Sent" ? [this.props.currentUser.user_id] : null,
          null,
          this.state.statuses,
          [input],
          1,
          100,
          [this.state.orderBy],
          this.state.order,
          this.state.displayArchived,
          this.state.mode == "Received" ? 1 : null,
          this.state.mode == "Received"
            ? [this.props.currentUser.user_id]
            : null
        )
      );
    }
  }

  render() {
    const { mode, orderBy, order, searchQuery } = this.state;
    const {
      sentJobs,
      searchedSentJobs,
      receivedJobs,
      searchedReceivedJobs,
      showButtonGroup
    } = this.props;

    let jobs: JobModel[];
    if (mode === "Sent") {
      jobs = searchQuery.length == 0 ? sentJobs : searchedSentJobs;
    } else {
      jobs = searchQuery.length == 0 ? receivedJobs : searchedReceivedJobs;
    }

    const jobsList: JSX.Element[] = this.generateJobList(jobs);

    return (
      <div className="jobs-container">
        <Box display="flex" justifyContent="center" flexGrow={3} mb={3}>
          {showButtonGroup !== false && (
            <ButtonGroup
              changeSelectedButton={this.changeSelectedButton}
              mode={mode}
              buttons={["Sent", "Received"]}
            />
          )}
        </Box>
        {showButtonGroup !== false && (
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
            {showButtonGroup != null && (
              <Typography variant="h4" style={{ fontWeight: 500 }}>
                Your Recent Jobs
              </Typography>
            )}
            {showButtonGroup == null && (
              <Typography
                variant="h4"
                style={{ fontWeight: 500 }}
                gutterBottom={true}
              >
                Your Recent {mode === "Sent" ? "Sent" : "Received"} Jobs
              </Typography>
            )}
            <Box>
              {showButtonGroup != null ? (
                <Link component={LinkObject} to="/jobs">
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
            {((jobs && Object.keys(jobs).length > 0) ||
              showButtonGroup !== false) && (
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
            {jobs &&
              Object.keys(jobs).length == 0 &&
              showButtonGroup == false && <NoJobs />}
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
  receiveSearchedSentJobs: (jobs: JobModel[]) =>
    dispatch(receiveSearchedSentJobs(jobs)),
  receiveSearchedReceivedJobs: (jobs: JobModel[]) =>
    dispatch(receiveSearchedReceivedJobs(jobs))
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
