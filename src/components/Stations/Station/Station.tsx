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
import { parseStationMachines } from "../../../reducers/stationSelector";
import EditTextForm from "../../Core/EditTextForm";
import React from "react";
import StationDetails from "./StationDetails";
import StationHeader from "./StationHeader";
import StationInviteHeader from "./StationInviteHeader";
import StationJobsExpanded from "./Jobs/StationJobsExpanded";
import StationJobsHeader from "./Jobs/StationJobsHeader";
import StationMachineExpanded from "./Machines/StationMachineExpanded";
import StationMachineHeader from "./Machines/StationMachineHeader";
import StationUserExpanded from "./Users/StationUserExpanded";
import StationUserHeader from "./Users/StationUserHeader";

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
      setTimeout(() => {
        if(response){
          this.forceUpdate();
        }else{
          this.props.history.push('/stations');
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

    if (mode === "Machines") {
      return (
        <StationMachineExpanded
          station={station}
          currentUser={currentUser}
          handleOpenMachineModal={this.handleOpenMachineModal}
          stationMachines={stationMachines}
          setMode={this.setMode}
        />
      );
    } else {
      return (
        <StationMachineHeader
          setMode={this.setMode}
          station={station}
          currentUser={currentUser}
          handleOpenMachineModal={this.handleOpenMachineModal}
        />
      );
    }
  }

  users() {
    const { mode } = this.state;
    const { station, currentUser, history } = this.props;

    if (mode === "Users") {
      return (
        <StationUserExpanded
          setMode={this.setMode}
          station={station}
          currentUser={currentUser}
          toggleInviteUsers={this.toggleInviteUsers}
          history={history}
        />
      );
    } else {
      return (
        <StationUserHeader
          setMode={this.setMode}
          station={station}
          currentUser={currentUser}
          toggleInviteUsers={this.toggleInviteUsers}
        />
      );
    }
  }

  jobs() {
    const { mode } = this.state;
    const { stationJobs, currentUser, match } = this.props;

    if (mode === "Jobs") {
      return (
        <StationJobsExpanded
          setMode={this.setMode}
          stationJobs={stationJobs}
          currentUser={currentUser}
          match={match}
        />
      );
    } else {
      return <StationJobsHeader setMode={this.setMode} />;
    }
  }

  public handleChange(type: keyof State) {
    return (e: any) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
    };
  }

  public editNameForm() {
    const { station } = this.props;
    return (
      <EditTextForm
        name={station.name}
        handleChange={this.handleChange("stationName")}
        handleEditName={this.handleEditName}
      />
    );
  }

  public handleEditName(saveEdit: boolean) {
    return () => {
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

  public editName() {
    if (!this.state.editName) {
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

    if (!station) {
      return null;
    } else {
      return (
        <>
          {receivedStationInvites.includes(station.id) && (
            <StationInviteHeader
              users={users}
              station={station}
              handleStationRequest={this.handleStationRequest}
            />
          )}
          <div className="station-container">
            <StationHeader
              station={station}
              currentUser={currentUser}
              handleDeleteStation={this.handleDeleteStation}
              handleLeaveStation={this.handleLeaveStation}
            />
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
