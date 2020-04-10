import { Dispatch } from "redux";
import { ICloseModal, closeModal } from "../../../actions/modalActions";
import {
  IReceiveSearchedUsers,
  receiveSearchedUsers
} from "../../../actions/userActions";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Station } from "../../../business/objects/station";
import { User, UserFilterOptions } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import InviteMemberView from "./InviteMemberView";
import React from "react";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  predictions: User[];
  station: Station;
  currentUser: User;
  receiveSearchedUsers: (userList: User[]) => IReceiveSearchedUsers;
  closeModal: () => ICloseModal;
}

type State = {
  searchInput: string;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class InviteMembers extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      searchInput: ""
    };
    this.removeUserFromStation = this.removeUserFromStation.bind(this);
    this.inviteUserToCurrentStation = this.inviteUserToCurrentStation.bind(
      this
    );
    this.handleChange = this.handleChange.bind(this);
  }

  public removeUserFromStation(userId: string) {
    return () => {
      this.context.stationService.expelUser(this.props.station.id, userId);
    };
  }

  public inviteUserToCurrentStation(userId: string) {
    return () => {
      this.context.stationService.inviteUsersToStation(this.props.station.id, [
        userId
      ]);
    };
  }

  public handleChange(type: keyof State) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
      if (value.length > 1) {
        this.context.userService.searchByUsername(
          new UserFilterOptions(null, [value])
        );
      } else {
        this.props.receiveSearchedUsers([]);
      }
    };
  }

  render() {
    const { predictions, station, currentUser, closeModal } = this.props;
    const { searchInput } = this.state;
    return (
      <InviteMemberView
        closeModal={closeModal}
        searchInput={searchInput}
        handleChange={this.handleChange}
        predictions={predictions}
        station={station}
        currentUser={currentUser}
        removeUserFromStation={this.removeUserFromStation}
        inviteUserToCurrentStation={this.inviteUserToCurrentStation}
      />
    );
  }
}

InviteMembers.contextType = context;

type InjectedProps = {
  match: any;
  history: any;
};

const mapStateToProps = (store: IStore, ownProps: InjectedProps) => {
  return {
    predictions: store.users.searchedUsers,
    currentUser: store.users.currentUser,
    stations: store.stations.stations,
    station: store.stations.selectedStation
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveSearchedUsers: (userList: User[]) =>
    dispatch(receiveSearchedUsers(userList)),
  closeModal: () => dispatch(closeModal())
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InviteMembers)
);
