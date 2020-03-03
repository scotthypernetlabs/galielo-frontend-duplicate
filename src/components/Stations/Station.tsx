import {
  Button,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  CircularProgress
} from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import { EJobStatus, Job as JobModel } from "../../business/objects/job";
import {
  EditStationParams,
  Station as StationModel
} from "../../business/objects/station";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ICloseModal,
  IOpenModal,
  IOpenNotificationModal,
  IOpenQueryModal,
  closeModal,
  openModal,
  openNotificationModal,
  openQueryModal
} from "../../actions/modalActions";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import { Query } from "../../business/objects/modal";
import { RouteComponentProps } from "react-router-dom";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import {
  faChalkboard,
  faClipboardList,
  faDatabase,
  faInfoCircle,
  faLock,
  faLockOpen,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { galileoTeal, linkBlue } from "../theme";
import { parseStationMachines } from "../../reducers/stationSelector";
import Job from "../Jobs/Job";
import React from "react";
import StationMachine from "./StationMachine";
import StationMember from "./StationMember";
import ProgressButton from "../coreComponents/ProgressButton"

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  station: StationModel;
  stationMachines: Machine[];
  openMachineModal: () => IOpenModal;
  users: Dictionary<User>;
  currentUser: User;
  receivedStationInvites: string[];
  openNotificationModal: (
    modalType: string,
    text: string
  ) => IOpenNotificationModal;
  stationJobs: any;
  openVolumesModal: () => IOpenModal;
  openInviteMembersModal: () => IOpenModal;
  openQueryModal: (query: Query) => IOpenQueryModal;
  closeModal: () => ICloseModal;
}

type State = {
  mode: string;
  inviteUsers: boolean;
  editName: boolean;
  stationName: string;
  loading: boolean;
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
      loading: true
    };
    this.setMode = this.setMode.bind(this);
    this.toggleInviteUsers = this.toggleInviteUsers.bind(this);
    this.handleDeleteStation = this.handleDeleteStation.bind(this);
    this.handleLeaveStation = this.handleLeaveStation.bind(this);
    this.handleOpenMachineModal = this.handleOpenMachineModal.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
    this.editName = this.editName.bind(this);
    this.editNameForm = this.editNameForm.bind(this);
    this.handleStationRequest = this.handleStationRequest.bind(this);
  }

  componentDidMount() {
    if (this.props.station.name.length === 0) {
      this.props.history.push("/");
    }
    this.context.stationService.getJobsByStationId(this.props.station.id);
  }

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
      this.forceUpdate();
    };
  }

  toggleInviteUsers() {
    const station = this.props.station;
    if (station.admins.indexOf(this.props.currentUser.user_id) >= 0) {
      this.setState(prevState => ({
        inviteUsers: !prevState.inviteUsers
      }));
      this.props.openInviteMembersModal();
    } else {
      this.props.openNotificationModal(
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

  machines() {
    const { mode } = this.state;
    const { station, currentUser, stationMachines } = this.props;

    const onlineMachines: Machine[] = [];
    const offlineMachines: Machine[] = [];
    stationMachines.map((machine: Machine, idx: number) => {
      if (machine.status == "online") {
        onlineMachines.push(machine);
      } else {
        offlineMachines.push(machine);
      }
    });

    if (mode === "Machines") {
      return (
        <>
          <div className="section-header station-machines-header">
            <span>
              <FontAwesomeIcon
                icon={faChalkboard}
                style={{ marginLeft: 5, marginRight: 5 }}
              />{" "}
              Landing Zones ({station.machines.length})
            </span>
            {station.members.includes(currentUser.user_id) && (
              <div
                className="plus-container"
                onClick={this.handleOpenMachineModal}
              >
                <i className="fal fa-plus-circle" />
              </div>
            )}
          </div>
          <div className="station-machines">
            <Grid container>
              <Grid item xs={12}>
                <Typography> Online ({onlineMachines.length}) </Typography>
              </Grid>
              {onlineMachines.map((machine: Machine, idx: number) => {
                return (
                  <div className="machine-in-station" key={idx}>
                    <StationMachine
                      machine={machine}
                      station={station}
                      currentUser={this.props.currentUser}
                    />
                  </div>
                );
              })}
            </Grid>
            <Grid container style={{ paddingTop: 30 }}>
              <Grid item xs={12}>
                <Typography style={{ float: "left" }}>
                  {" "}
                  Offline ({offlineMachines.length}){" "}
                </Typography>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  arrow={true}
                  title="You can still send jobs to offline machines and your jobs will start running once the machines are online."
                >
                  <div
                    style={{ float: "left", marginLeft: 10 }}
                    className="add-cursor"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                </Tooltip>
              </Grid>
              {offlineMachines.map((machine: Machine, idx: number) => {
                return (
                  <div className="machine-in-station" key={idx}>
                    <StationMachine
                      machine={machine}
                      station={station}
                      currentUser={this.props.currentUser}
                    />
                  </div>
                );
              })}
            </Grid>
          </div>
        </>
      );
    } else {
      return (
        <div
          className="section-header station-machines-header-collapsed"
          onClick={this.setMode("Machines")}
        >
          <span>
            <FontAwesomeIcon
              icon={faChalkboard}
              style={{ marginLeft: 5, marginRight: 5 }}
            />{" "}
            Landing Zones ({station.machines.length})
          </span>
          {station.members.includes(currentUser.user_id) && (
            <div
              className="plus-container"
              onClick={this.handleOpenMachineModal}
            >
              <i className="fal fa-plus-circle" />
            </div>
          )}
        </div>
      );
    }
  }

  users() {
    const { mode } = this.state;
    const { station, currentUser } = this.props;
    if (mode === "Users") {
      return (
        <>
          <div className="section-header station-users-header">
            <span>
              <FontAwesomeIcon
                icon={faUser}
                style={{ marginLeft: 5, marginRight: 5 }}
              />{" "}
              Launchers({station.members.length})
            </span>
            {station.owner == currentUser.user_id && (
              <div className="plus-container" onClick={this.toggleInviteUsers}>
                <i className="fal fa-plus-circle" />
              </div>
            )}
          </div>
          <div className="station-users">
            {station.members.map((userId: string) => {
              return (
                <React.Fragment key={userId}>
                  <StationMember
                    user_id={userId}
                    history={this.props.history}
                    station={station}
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
          <span>
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginLeft: 5, marginRight: 5 }}
            />{" "}
            Launchers ({station.members.length})
          </span>
          {station.owner == currentUser.user_id && (
            <div className="plus-container" onClick={this.toggleInviteUsers}>
              <i className="fal fa-plus-circle" />
            </div>
          )}
        </div>
      );
    }
  }

  jobs() {
    const { mode } = this.state;
    let jobList: any[] = [];
    if (this.props.stationJobs[this.props.match.params.id]) {
      jobList = Object.keys(this.props.stationJobs[this.props.match.params.id])
        .map(key => this.props.stationJobs[this.props.match.params.id][key])
        .filter((job: JobModel) => job.status === EJobStatus.running);
    }
    if (mode === "Jobs") {
      return (
        <>
          <div
            className="section-header station-users-header"
            onClick={this.setMode("Jobs")}
          >
            <span>
              <FontAwesomeIcon
                icon={faClipboardList}
                style={{ marginLeft: 5, marginRight: 5 }}
              />{" "}
              Station Activity
            </span>
          </div>
          <div className="station-jobs">
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
                  {jobList
                    .sort((a: JobModel, b: JobModel) => {
                      if (a.upload_time < b.upload_time) return 1;
                      if (a.upload_time > b.upload_time) return -1;
                      return 0;
                    })
                    .map((job: any, idx: number) => {
                      return (
                        <Job
                          key={job.id}
                          job={job}
                          isSentJob={
                            job.landing_zone !== this.props.currentUser.user_id
                          }
                        />
                      );
                    })}
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
          </div>
          {/* <div className="station-jobs">*/}
          {/*  <div className="station-jobs-headers">*/}
          {/*    <div>SENT TO</div>*/}
          {/*    <div>SENT BY</div>*/}
          {/*    <div>NAME OF PROJECT</div>*/}
          {/*    <div>TIME TAKEN</div>*/}
          {/*  </div>*/}
          {/*  {jobList.map((job: any, idx: number) => {*/}
          {/*    return <StationJob key={job.id} job={job} />;*/}
          {/*  })}*/}
          {/* </div>*/}
        </>
      );
    } else {
      return (
        <div
          className="section-header station-jobs-header-collapsed"
          onClick={this.setMode("Jobs")}
        >
          <span>
            <FontAwesomeIcon
              icon={faClipboardList}
              style={{ marginLeft: 5, marginRight: 5 }}
            />{" "}
            Station Activity
          </span>
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

  public editNameForm() {
    return (
      <div>
        <TextField
          value={this.state.stationName}
          variant="outlined"
          size="small"
          onChange={this.handleChange("stationName")}
        />
        <div>
          <Button variant="contained" onClick={this.handleEditName(true)}>
            Save
          </Button>
          <Button variant="contained" onClick={this.handleEditName(false)}>
            Discard
          </Button>
        </div>
      </div>
    );
  }

  public handleEditName(saveEdit: boolean) {
    return (e: any) => {
      if (saveEdit) {
        this.context.stationService.editStation(
          this.props.station.id,
          new EditStationParams(this.state.stationName, "")
        );
      } else {
        this.setState({
          editName: false,
          stationName: this.props.station.name
        });
      }
    };
  }

  public editName(e: any) {
    if (!this.state.editName) {
      this.setState({
        editName: true,
        stationName: this.props.station.name
      });
    }
  }

  render() {
    const { station, users, receivedStationInvites, currentUser } = this.props;
    if (!station) {
      return null;
    } else {
      return (
        <>
          {receivedStationInvites.includes(station.id) && (
            <Grid
              container
              alignItems="center"
              justify="space-between"
              style={{
                backgroundColor: galileoTeal.main,
                marginLeft: 250,
                padding: 4,
                width: "calc(100% - 250px)",
                position: "absolute"
              }}
            >
              <Grid item>
                <Typography
                  variant="h4"
                  style={{ color: "white", paddingLeft: 5 }}
                >
                  {users[station.owner].username} invited you to join this
                  station.
                </Typography>
              </Grid>
              <Grid item>
                <Grid
                  container
                  alignItems="baseline"
                  justify="center"
                  style={{ marginBottom: 0 }}
                >
                  <Grid item>
                    <Link
                      style={{ margin: 10, color: "white" }}
                      onClick={this.handleStationRequest(station.id, true)}
                    >
                      Accept
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      style={{ margin: 10, color: "white" }}
                      onClick={this.handleStationRequest(station.id, false)}
                    >
                      Decline
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          <div className="station-container">
            <Grid
              container
              alignItems="center"
              justify="space-between"
              style={
                station.members.includes(currentUser.user_id)
                  ? {}
                  : { paddingTop: 10 }
              }
            >
              {/* <h3 onClick={this.editName}>*/}
              {/*  {station && (this.state.editName ? this.editNameForm() : station.name)}*/}
              {/* </h3>*/}
              <Grid item>
                <Typography variant="h2">{station.name}</Typography>
              </Grid>
              <Grid item>
                {" "}
                {!station.invited_list.includes(
                  this.props.currentUser.user_id
                ) &&
                  (station &&
                  this.props.currentUser.user_id === station.owner ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleDeleteStation}
                    >
                      Delete Station
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleLeaveStation}
                    >
                      Leave Station
                    </Button>
                  ))}{" "}
              </Grid>
            </Grid>
            <Typography variant="h4" style={{ color: "grey", fontWeight: 400 , whiteSpace: 'pre-wrap'}}>
              {station && station.description}
            </Typography>
            <div style={{ paddingTop: 20, paddingBottom: 20 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <span
                    className="add-cursor"
                    onClick={
                      this.props.station.invited_list.includes(
                        this.props.currentUser.user_id
                      )
                        ? () => {
                            this.props.openNotificationModal(
                              "Notifications",
                              "You must be a member of this group to manage volumes!"
                            );
                          }
                        : this.props.openVolumesModal
                    }
                  >
                    <FontAwesomeIcon
                      icon={faDatabase}
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        color: linkBlue.main,
                        float: "left",
                        verticalAlign: "baseline"
                      }}
                    />
                    <Typography
                      variant="h5"
                      style={{ color: linkBlue.main, float: "left" }}
                    >
                      {station && station.volumes.length} Volumes
                    </Typography>
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className="add-cursor"
                    onClick={this.setMode("Machines")}
                  >
                    <FontAwesomeIcon
                      icon={faChalkboard}
                      style={{ marginLeft: 5, marginRight: 5, float: "left" }}
                    />
                    <Typography variant="h5" style={{ float: "left" }}>
                      {" "}
                      {station && station.machines.length} Landing Zones
                    </Typography>
                  </span>
                </Grid>
                <Grid item>
                  <span className="add-cursor" onClick={this.setMode("Users")}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ marginLeft: 5, marginRight: 5, float: "left" }}
                    />
                    <Typography variant="h5" style={{ float: "left" }}>
                      {" "}
                      {station && station.members.length} Launchers
                    </Typography>
                    <div className={"classes.wrapper"}>
      </div>
                  </span>
                </Grid>
                <Grid item>
                  {station &&
                  station.admins.indexOf(this.props.currentUser.user_id) >=
                    0 ? (
                    <span>
                      <FontAwesomeIcon
                        icon={faLockOpen}
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          cursor: "default",
                          float: "left"
                        }}
                      />{" "}
                      <Typography
                        variant="h5"
                        style={{ cursor: "default", float: "left" }}
                      >
                        You are an admin
                      </Typography>
                    </span>
                  ) : (
                    <span>
                      <FontAwesomeIcon
                        icon={faLock}
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          cursor: "default",
                          float: "left"
                        }}
                      />{" "}
                      <Typography
                        variant="h5"
                        style={{ cursor: "default", float: "left" }}
                      >
                        You are not an admin
                      </Typography>
                    </span>
                  )}
                </Grid>
              </Grid>
            </div>
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
    stationJobs: state.jobs.stationJobs,
    receivedStationInvites: state.users.receivedStationInvites
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openQueryModal: (query: Query) => dispatch(openQueryModal(query)),
  closeModal: () => dispatch(closeModal()),
  openNotificationModal: (modalName: string, text: string) =>
    dispatch(openNotificationModal(modalName, text)),
  openMachineModal: () => dispatch(openModal("Add Machine")),
  openVolumesModal: () => dispatch(openModal("Volumes")),
  openInviteMembersModal: () => dispatch(openModal("Invite Members"))
});

export default connect(mapStateToProps, mapDispatchToProps)(Station);
