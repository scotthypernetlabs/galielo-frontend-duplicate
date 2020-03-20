import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  EditStationParams,
  Station as StationModel
} from "../../../business/objects/station";
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
import { Machine } from "../../../business/objects/machine";
import { MyContext } from "../../../MyContext";
import { Query } from "../../../business/objects/modal";
import { RouteComponentProps } from "react-router-dom";
import { User } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import { darkGrey } from "../../theme";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons/faChalkboard";
import { faClipboardList, faUser } from "@fortawesome/free-solid-svg-icons";
import { parseStationMachines } from "../../../reducers/stationSelector";
import EditTextForm from "../../Core/EditTextForm";
import GalileoAlert from "../../Core/GalileoAlert";
import Header from "../../Core/Header";
import React from "react";
import StationDetails from "./StationDetails";
import StationJobsExpanded from "./Jobs/StationJobsExpanded";
import StationMachineContainer from "./Machines/StationMachineContainer";
import StationMember from "../StationMember/StationMember";
import Typography from "@material-ui/core/Typography";
import IconText from "../../Core/IconText";
import { Box } from "@material-ui/core";

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
    this.toggleEditName = this.toggleEditName.bind(this);
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

  machines() {
    const { mode } = this.state;
    const { station, currentUser, stationMachines } = this.props;
    const landingZonesText = `Landing Zones (${station.machines.length})`;
    const onlineMachines: Machine[] = [];
    const offlineMachines: Machine[] = [];

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

  users() {
    const { mode } = this.state;
    const { station, history, currentUser } = this.props;
    const launchersText = `Launchers (${station.members.length})`;
    console.log(station)
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
              showSecondaryIcon={station.members.includes(currentUser.user_id)}
              secondaryIcon="add_circle_outline"
              onClickSecondaryIcon={this.toggleInviteUsers}
            />
          </div>
          <div className="station-users">
            {station.members.map((userId: string) => {
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
          { station.invited_list.length>0 &&
             <Box mb = {3}>
              <IconText
                icon="person_add"
                text="Invited Members"
                textVariant="h4"
                noWrap={true}
                iconSize={18}
                textColor={darkGrey.main}
              /> 
              <Typography color={"textSecondary"} variant="h3"> ({station.invited_list.length})</Typography>
            </Box>
          }
         
          <div className="station-users">
          {station.invited_list.map((userId: string) => {
              return (
                <React.Fragment key={userId}>
                  <StationMember
                    user_id={userId}
                    history={history}
                    station={station}
                    invited = {true}
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
            showSecondaryIcon={station.members.includes(currentUser.user_id)}
            secondaryIcon="add_circle_outline"
            onClickSecondaryIcon={this.toggleInviteUsers}
          />
        </div>
      );
    }
  }

  jobs() {
    const { mode } = this.state;
    const { stationJobs, currentUser, match } = this.props;

    if (mode === "Jobs") {
      return (
        <StationJobsExpanded
          station={this.props.station}
          setMode={this.setMode}
          stationJobs={stationJobs}
          currentUser={currentUser}
          match={match}
        />
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

    if (station.id === "") {
      return null;
    } else {
      const isInvite = receivedStationInvites.includes(station.id);
      const stationContainer = isInvite
        ? "station-container-invited"
        : "station-container";
      const alertMessage = `${
        users[station.owner[0]].username
      } invited you to join this station.`;
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
            <Typography variant="h4">{station.description}</Typography>
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
