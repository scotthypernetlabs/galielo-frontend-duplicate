import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { Dispatch } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICloseModal, closeModal } from "../../actions/modalActions";
import {
  IReceiveSearchedUsers,
  receiveSearchedUsers
} from "../../actions/userActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Station } from "../../business/objects/station";
import { User, UserFilterOptions } from "../../business/objects/user";
import { UserIconNew } from "../svgs/UserIconNew";
import { connect } from "react-redux";
import { context } from "../../context";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
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
    this.displayPredictions = this.displayPredictions.bind(this);
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
          new UserFilterOptions(null, value)
        );
      } else {
        this.props.receiveSearchedUsers([]);
      }
    };
  }

  public displayPredictions() {
    const { predictions, station } = this.props;
    return (
      <div className="predictions">
        {predictions.map((prediction, idx) => {
          const inStationAlready =
            station.members.indexOf(prediction.user_id) >= 0;
          let alreadyInvited = false;
          if (station.invited_list.indexOf(prediction.user_id) >= 0) {
            alreadyInvited = true;
          }
          if (prediction.user_id === this.props.currentUser.user_id) {
            return;
          }
          return (
            <div key={`${prediction.user_id}${idx}`} className="prediction">
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>{UserIconNew("ONLINE", 40)}</Grid>
                    <Grid item>
                      <div style={{ margin: 5 }}>{prediction.username}</div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  {inStationAlready &&
                    station.admins.indexOf(this.props.currentUser.user_id) >=
                      0 && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.removeUserFromStation(prediction.user_id)}
                      >
                        Remove
                      </Button>
                    )}
                  {alreadyInvited && (
                    <div>
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ float: "left", marginRight: 10 }}
                      />
                      <Box fontStyle="italic" style={{ float: "left" }}>
                        Invite Sent
                      </Box>
                    </div>
                  )}
                  {!inStationAlready && !alreadyInvited && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={this.inviteUserToCurrentStation(
                        prediction.user_id
                      )}
                    >
                      Invite
                    </Button>
                  )}
                </Grid>
              </Grid>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="modal-style" onClick={(e: any) => e.stopPropagation()}>
        <div className="invite-members">
          <div className="group-machine-modal-title">
            <Typography variant="h3" gutterBottom={true}>
              Add Users
            </Typography>
            <div onClick={this.props.closeModal} className="add-cursor">
              <i className="fal fa-times" />
            </div>
          </div>
          <button className="user-search">
            <TextField
              variant="outlined"
              size="small"
              type="text"
              value={this.state.searchInput}
              onChange={this.handleChange("searchInput")}
              placeholder={"Search by Email"}
            />
          </button>
          {this.displayPredictions()}
        </div>
      </div>
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
