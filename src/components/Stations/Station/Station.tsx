import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Tooltip
} from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  EUserRole,
  User,
  UserFilterOptions
} from "../../../business/objects/user";
import {
  EditStationParams,
  Station as StationModel
} from "../../../business/objects/station";
import { GetMachinesFilter, Machine } from "../../../business/objects/machine";
import {
  ICloseModal,
  IOpenModal,
  IOpenNotificationModal,
  IOpenQueryModal,
  closeModal,
  openModal,
  openNotificationModal,
  openQueryModal
} from "../../../actions/modalActions";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { Query } from "../../../business/objects/modal";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { context } from "../../../context";
import { darkGrey } from "../../theme";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GalileoAlert from "../../Core/GalileoAlert";
import Header from "../../Core/Header";
import IconText from "../../Core/IconText";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

import {
  EConflatedJobStatus,
  EJobSortBy,
  GetJobFilters,
  Job
} from "../../../business/objects/job";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../../../actions/stationActions";
import { Pagination } from "@material-ui/lab";
import { parseStationMachines } from "../../../reducers/stationSelector";
import Placeholder from "../../Core/Placeholder";
import React from "react";
import StationDetails from "./StationDetails";
import StationJobsExpanded from "./Jobs/StationJobsExpanded";
import StationMachineContainer from "./Machines/StationMachineContainer";
import StationMember from "../StationMember/StationMember";
import Tokenizer from "sentence-tokenizer";
import Typography from "@material-ui/core/Typography";

const usersPerPage = 30;
interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  station: StationModel;
  machines: Dictionary<Machine>;
  stationMachines: Machine[];
  openMachineModal: () => IOpenModal;
  users: Dictionary<User>;
  currentUser: User;
  receivedStationInvites: string[];
  openNotificationModal: (
    modalType: string,
    text: string
  ) => IOpenNotificationModal;
  stationJobs: Job[];
  openVolumesModal: () => IOpenModal;
  openInviteMembersModal: () => IOpenModal;
  openQueryModal: (query: Query) => IOpenQueryModal;
  closeModal: () => ICloseModal;
  receiveSelectedStation: (station: StationModel) => IReceiveSelectedStation;
}
type StationJobsTab = "Running" | "Queued" | "Past Jobs";

type State = {
  mode: string;
  inviteUsers: boolean;
  editName: boolean;
  stationName: string;
  loading: boolean;
  usersPage: number;
  machinesPage: number;
  runningJobsPage: number;
  queuedJobsPage: number;
  pastJobsPage: number;
  jobsTab: StationJobsTab;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class Station extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: "Machines",
      inviteUsers: false,
      editName: false,
      stationName: props.station.name,
      loading: true,
      usersPage: 1,
      machinesPage: 1,
      runningJobsPage: 1,
      queuedJobsPage: 1,
      pastJobsPage: 1,
      jobsTab: "Running"
    };
    this.setMode = this.setMode.bind(this);
    this.toggleInviteUsers = this.toggleInviteUsers.bind(this);
    this.handleDeleteStation = this.handleDeleteStation.bind(this);
    this.handleLeaveStation = this.handleLeaveStation.bind(this);
    this.handleOpenMachineModal = this.handleOpenMachineModal.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
    this.toggleEditName = this.toggleEditName.bind(this);
    this.handleStationRequest = this.handleStationRequest.bind(this);
    this.nonAdminMembers = this.nonAdminMembers.bind(this);
    this.setJobTab = this.setJobTab.bind(this);
    this.handleUserPaginationChange = this.handleUserPaginationChange.bind(
      this
    );
    this.handleJobPaginationChange = this.handleJobPaginationChange.bind(this);
  }

  componentDidMount() {
    if (
      this.props.station.id ||
      this.props.station.machines == null ||
      this.props.station.members == null ||
      this.props.station.volumes == null
    ) {
      // this.props.history.push("/");
      // probably need to cache the previous results
      this.context.stationService
        .getStationById(this.props.station.id)
        .then((station: StationModel) => {
          this.props.receiveSelectedStation(station);
        });
    }
    console.log("admins", this.props.station.admins);

    this.context.userService.getUsers(
      new UserFilterOptions(
        null,
        null,
        null,
        null,
        null,
        this.state.usersPage,
        usersPerPage * 2,
        [this.props.station.id],
        [EUserRole.member]
      )
    );

    this.context.userService.getUsers(
      new UserFilterOptions(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [this.props.station.id],
        [EUserRole.admin, EUserRole.owner]
      )
    );

    this.context.userService.getUsers(
      new UserFilterOptions(
        null,
        null,
        null,
        null,
        null,
        this.state.usersPage,
        usersPerPage * 2,
        [this.props.station.id],
        [EUserRole.pending, EUserRole.invited]
      )
    );

    // Get all running jobs first
    this.context.jobService.getJobs(
      new GetJobFilters(
        null,
        null,
        null,
        [this.props.station.id],
        [
          EConflatedJobStatus["Job In Progress"],
          EConflatedJobStatus["Building Image"],
          EConflatedJobStatus["Building Container"],
          EConflatedJobStatus["Job Paused"],
          EConflatedJobStatus["Job Uploaded"],
          EConflatedJobStatus["Collecting Results"]
        ],
        null,
        1,
        20,
        [EJobSortBy.UploadDate],
        "desc"
      )
    );
    // this.context.machineService.getMachines(
    //   new GetMachinesFilter(this.props.station.machines)
    // );
  }

  // componentDidUpdate(prevProps: Props) {
  // console.log("prevProps", prevProps.station);
  // console.log("props", this.props.station);
  // }

  handleOpenMachineModal() {
    if (
      this.props.station.members.indexOf(this.props.currentUser.user_id) >= 0
    ) {
      this.props.openMachineModal();
    } else {
      this.props.openNotificationModal(
        "Notifications",
        "You must be a member of this group to manage machines!"
      );
    }
  }

  handleDeleteStation() {
    this.props.openQueryModal(
      new Query(
        "Delete Station",
        "Are you sure you want to delete this station?",
        () => {
          this.context.stationService.destroyStation(
            this.props.match.params.id
          );
          this.props.history.push("/stations");
          this.props.closeModal();
        },
        () => {
          this.props.closeModal();
        }
      )
    );
  }

  handleLeaveStation() {
    this.props.openQueryModal(
      new Query(
        "Leave Station",
        "Are you sure you want to leave this station?",
        () => {
          this.context.stationService.leaveStation(this.props.match.params.id);
          this.props.history.push("/stations");
          this.props.closeModal();
        },
        () => {
          this.props.closeModal();
        }
      )
    );
  }

  handleStationRequest(stationId: string, response: boolean) {
    return () => {
      this.context.stationService.respondToStationInvite(stationId, response);
      setTimeout(() => {
        if (response) {
          this.forceUpdate();
        } else {
          this.props.history.push("/stations");
        }
      }, 1000);
    };
  }

  toggleInviteUsers() {
    const {
      station,
      openInviteMembersModal,
      openNotificationModal
    } = this.props;
    if (station.admins.indexOf(this.props.currentUser.user_id) >= 0) {
      this.setState(prevState => ({
        inviteUsers: !prevState.inviteUsers
      }));
      openInviteMembersModal();
    } else {
      openNotificationModal(
        "Notifications",
        "Only admins are allowed to invite users."
      );
    }
  }

  setMode(mode: string) {
    return () => {
      this.setState({
        mode: mode
      });
    };
  }
  nonAdminMembers(members: Array<string>, admins: Array<string>) {
    const nonMembers = members.filter(member => {
      return !admins.includes(member);
    });
    return nonMembers;
  }

  machines() {
    const { mode } = this.state;
    const { station, currentUser, stationMachines } = this.props;
    const landingZonesText = `Landing Zones (${station.machines.length})`;
    const onlineMachines: Machine[] = [];
    const offlineMachines: Machine[] = [];

    console.log("stationMachines", stationMachines);

    stationMachines.map((machine: Machine) => {
      if (machine.status == "online") {
        onlineMachines.push(machine);
      } else {
        offlineMachines.push(machine);
      }
    });

    if (mode === "Machines") {
      return (
        <>
          <div
            className="section-header station-machines-header-collapsed"
            onClick={this.setMode("Machines")}
          >
            <Header
              icon="tv"
              title={landingZonesText}
              titleVariant="h4"
              textColor={darkGrey.main}
              showSecondaryIcon={station.members.includes(currentUser.user_id)}
              secondaryIcon="add_circle_outline"
              onClickSecondaryIcon={this.handleOpenMachineModal}
            />
          </div>
          <div className="station-machines">
            <StationMachineContainer
              online={true}
              machines={onlineMachines}
              station={station}
              currentUser={currentUser}
            />
            <StationMachineContainer
              online={false}
              machines={offlineMachines}
              station={station}
              currentUser={currentUser}
            />
          </div>
        </>
      );
    } else {
      return (
        <div
          className="section-header station-machines-header-collapsed"
          onClick={this.setMode("Machines")}
        >
          <Header
            icon="tv"
            title={landingZonesText}
            titleVariant="h4"
            textColor={darkGrey.main}
            showSecondaryIcon={station.members.includes(currentUser.user_id)}
            secondaryIcon="add_circle_outline"
            onClickSecondaryIcon={this.handleOpenMachineModal}
          />
        </div>
      );
    }
  }

  async handleUserPaginationChange(
    event: React.ChangeEvent<unknown>,
    page: number
  ) {
    await this.context.userService.getUsers(
      new UserFilterOptions(
        null,
        null,
        null,
        null,
        null,
        this.state.usersPage,
        usersPerPage * 2,
        [this.props.station.id]
      )
    );
    this.setState({ usersPage: page });
  }

  users() {
    const { mode, usersPage } = this.state;
    const { station, history, currentUser } = this.props;
    const launchersText = `Launchers (${station.members.length})`;
    if (mode === "Users") {
      return (
        <>
          <div
            className="section-header station-users-header"
            onClick={this.setMode("Users")}
          >
            <Header
              icon="person"
              title={launchersText}
              titleVariant="h4"
              textColor={darkGrey.main}
              showSecondaryIcon={station.admins.includes(currentUser.user_id)}
              secondaryIcon="add_circle_outline"
              onClickSecondaryIcon={this.toggleInviteUsers}
            />
          </div>
          <div className="station-users">
            {station.admins.map((userId: string) => {
              return (
                <>
                  <Tooltip title="Admin">
                    <SupervisedUserCircleIcon />
                  </Tooltip>
                  <React.Fragment key={userId}>
                    <StationMember
                      user_id={userId}
                      history={history}
                      station={station}
                    />
                  </React.Fragment>
                </>
              );
            })}
          </div>
          <div className="station-users">
            {station.members
              .slice(
                usersPage * usersPerPage,
                usersPage * usersPerPage + usersPerPage
              )
              .map((userId: string) => {
                return (
                  <React.Fragment key={userId}>
                    <StationMember
                      user_id={userId}
                      history={history}
                      station={station}
                    />
                  </React.Fragment>
                );
              })}
          </div>
          <Pagination
            count={Math.ceil(station.members.length / usersPerPage)}
            page={usersPage}
            onChange={this.handleUserPaginationChange}
          />
          {station.invited_list.length > 0 && (
            <Box mb={2}>
              <IconText
                icon="person_add"
                text="Invited Members"
                textVariant="h4"
                noWrap={true}
                iconSize={18}
                textColor={darkGrey.main}
              />
              <Typography color={"textSecondary"} variant="h3">
                {" "}
                ({station.invited_list.length})
              </Typography>
            </Box>
          )}
          <div className="station-users">
            {station.invited_list.map((userId: string) => {
              return (
                <React.Fragment key={userId}>
                  <StationMember
                    user_id={userId}
                    history={history}
                    station={station}
                    invited={true}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </>
      );
    } else {
      return (
        <div
          className="section-header station-users-header-collapsed"
          onClick={this.setMode("Users")}
        >
          <Header
            icon="person"
            title={launchersText}
            titleVariant="h4"
            textColor={darkGrey.main}
            showSecondaryIcon={station.admins.includes(currentUser.user_id)}
            secondaryIcon="add_circle_outline"
            onClickSecondaryIcon={this.toggleInviteUsers}
          />
        </div>
      );
    }
  }

  static getConflatedStatuses(jobType: StationJobsTab): EConflatedJobStatus[] {
    let conflatedStatuses: EConflatedJobStatus[];
    switch (jobType) {
      case "Past Jobs":
        conflatedStatuses = [
          EConflatedJobStatus.Completed,
          EConflatedJobStatus["Unknown Error"],
          EConflatedJobStatus["Build Error"],
          EConflatedJobStatus["Docker Error"],
          EConflatedJobStatus["Exit Error"],
          EConflatedJobStatus["Job Cancelled"],
          EConflatedJobStatus["Results Posted"],
          EConflatedJobStatus["Removed By Host"],
          EConflatedJobStatus["Kill Request"],
          EConflatedJobStatus["Job Terminated"]
        ];
        break;
      case "Queued":
        conflatedStatuses = [EConflatedJobStatus.Queued];
        break;
      default:
        conflatedStatuses = [
          EConflatedJobStatus["Job In Progress"],
          EConflatedJobStatus["Building Image"],
          EConflatedJobStatus["Building Container"],
          EConflatedJobStatus["Job Paused"],
          EConflatedJobStatus["Job Uploaded"],
          EConflatedJobStatus["Collecting Results"]
        ];
        break;
    }
    return conflatedStatuses;
  }

  setJobTab(jobType: StationJobsTab) {
    const conflatedStatuses: EConflatedJobStatus[] = Station.getConflatedStatuses(
      jobType
    );

    this.context.jobService.getJobs(
      new GetJobFilters(
        null,
        null,
        null,
        [this.props.station.id],
        conflatedStatuses,
        null,
        1,
        20,
        [EJobSortBy.UploadDate],
        "desc"
      )
    );
    this.setState({ jobsTab: jobType });
  }

  async handleJobPaginationChange(
    event: React.ChangeEvent<unknown>,
    page: number
  ) {
    switch (this.state.jobsTab) {
      case "Past Jobs":
        this.setState({ pastJobsPage: page });
        break;
      case "Queued":
        this.setState({ queuedJobsPage: page });
        break;
      default:
        this.setState({ runningJobsPage: page });
        break;
    }

    await this.context.jobService.getJobs(
      new GetJobFilters(
        null,
        null,
        null,
        [this.props.station.id],
        Station.getConflatedStatuses(this.state.jobsTab),
        null,
        page,
        20,
        [EJobSortBy.UploadDate],
        "desc"
      )
    );
  }

  jobs() {
    const {
      mode,
      pastJobsPage,
      queuedJobsPage,
      runningJobsPage,
      jobsTab
    } = this.state;
    const { currentUser, stationJobs } = this.props;
    let page = runningJobsPage;
    switch (jobsTab) {
      case "Queued":
        page = queuedJobsPage;
        break;
      case "Past Jobs":
        page = pastJobsPage;
        break;
      default:
        break;
    }
    if (mode === "Jobs") {
      return (
        <>
          <StationJobsExpanded
            station={this.props.station}
            setMode={this.setMode}
            stationJobs={stationJobs}
            currentUser={currentUser}
            setJobTab={this.setJobTab}
          />
          <Pagination
            count={10}
            page={page}
            onChange={this.handleJobPaginationChange}
          />
        </>
      );
    } else {
      return (
        <div
          className="section-header station-jobs-header-collapsed"
          onClick={this.setMode("Jobs")}
        >
          <Header
            icon="list_alt"
            title="Station Activity"
            titleVariant="h4"
            textColor={darkGrey.main}
          />
        </div>
      );
    }
  }

  public handleChange(type: keyof State) {
    return (e: any) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
    };
  }

  // public editNameForm() {
  //   const { station } = this.props;
  //   return (
  //     <EditTextForm
  //       name={this.state.stationName}
  //       handleChange={this.handleChange("stationName")}
  //       handleEditName={this.handleEditName}
  //     />
  //   );
  // }

  public handleEditName(saveEdit: boolean) {
    return async () => {
      if (saveEdit) {
        const response: any = await this.context.stationService.editStation(
          this.props.station.id,
          new EditStationParams(this.state.stationName, null)
        );
        this.setState({
          editName: false,
          stationName: response.name
        });
      } else {
        this.setState({
          editName: false,
          stationName: this.props.station.name
        });
      }
    };
  }

  public toggleEditName() {
    if (
      !this.state.editName &&
      this.props.station.admins.includes(this.props.currentUser.user_id)
    ) {
      this.setState({
        editName: true,
        stationName: this.props.station.name
      });
    }
  }

  render() {
    const {
      station,
      users,
      receivedStationInvites,
      currentUser,
      openNotificationModal,
      openVolumesModal
    } = this.props;

    const tokenizer = new Tokenizer("Chuck");
    tokenizer.setEntry(station.description);
    const stationDescription = tokenizer.getSentences();

    if (station.id === "") {
      return null;
    }

    const isInvite = receivedStationInvites.includes(station.id);
    const stationContainer = isInvite
      ? "station-container-invited"
      : "station-container";
    // const alertMessage = `${
    //   users[station.owner[0]].username
    // } invited you to join this station.`;
    const alertMessage = "You are invited to this station.";

    if (
      this.props.station.name.length === 0 ||
      this.props.station.machines == null ||
      this.props.station.members == null ||
      this.props.station.volumes == null
    ) {
      return <></>;
    }

    return (
      <>
        {isInvite && (
          <GalileoAlert
            message={alertMessage}
            onClickAccept={this.handleStationRequest(station.id, true)}
            onClickDecline={this.handleStationRequest(station.id, false)}
          />
        )}
        <div className={stationContainer}>
          <Header
            title={this.state.stationName}
            titleVariant="h2"
            showButton={true}
            buttonText={
              station && station.owner.includes(currentUser.user_id)
                ? "Delete Station"
                : "Leave Station"
            }
            onClickButton={
              station && station.owner.includes(currentUser.user_id)
                ? this.handleDeleteStation
                : this.handleLeaveStation
            }
            editTitle={this.state.editName}
            handleEditTitle={this.handleChange("stationName")}
            submitEditTitle={this.handleEditName}
            toggleEditTitle={this.toggleEditName}
          />
          {stationDescription.length > 2 && (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4">
                  {stationDescription.slice(0, 2)}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>{stationDescription.slice(2)}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
          {stationDescription.length <= 2 && (
            <Typography variant="h4">{station.description}</Typography>
          )}
          <StationDetails
            station={station}
            currentUser={currentUser}
            openNotificationModal={openNotificationModal}
            openVolumesModal={openVolumesModal}
            setMode={this.setMode}
          />
          <div className="station-machines-container">
            {this.machines()}
            {this.jobs()}
            {this.users()}
          </div>
        </div>
      </>
    );
  }
}

Station.contextType = context;

type InjectedProps = {
  match: any;
  history: any;
};

const mapStateToProps = (state: IStore, ownProps: InjectedProps) => {
  return {
    users: state.users.users,
    currentUser: state.users.currentUser,
    station: state.stations.selectedStation,
    stationMachines: parseStationMachines(
      state.stations.selectedStation.machines,
      state.machines.machines
    ),
    machines: state.machines.machines,
    stationJobs: state.jobs.stationJobs[state.stations.selectedStation.id],
    receivedStationInvites: state.users.receivedStationInvites
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openQueryModal: (query: Query) => dispatch(openQueryModal(query)),
  closeModal: () => dispatch(closeModal()),
  openNotificationModal: (modalName: string, text: string) =>
    dispatch(openNotificationModal(modalName, text)),
  openMachineModal: () => dispatch(openModal("Add Machine")),
  receiveSelectedStation: (station: StationModel) =>
    dispatch(receiveSelectedStation(station))
});

export default connect(mapStateToProps, mapDispatchToProps)(Station);
