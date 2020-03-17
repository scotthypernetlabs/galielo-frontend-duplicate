import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import { History } from "history";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import React from "react";
import StationMemberView from "./StationMemberView";

type Props = {
  station: Station;
  user_id: string;
  users: Dictionary<User>;
  history: History<any>;
  currentUser: User;
};

type State = {
  isDialogOpen: boolean;
};

class StationMember extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      isDialogOpen: false
    };
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
  }
  handleRemoveUser(station_id: string, user_id: string) {
    return (e: any) => {
      this.context.stationService.expelUser(station_id, user_id);
    };
  }
  handleClickOpen() {
    this.setState({ isDialogOpen: true });
  }

  handleClose() {
    this.setState({ isDialogOpen: false });
  }

  render() {
    const { user_id, station, currentUser } = this.props;
    const { isDialogOpen } = this.state;
    const user = this.props.users[user_id];
    if (!user) {
      return <></>;
    }
    return (
      <StationMemberView
        station={station}
        user={user}
        currentUser={currentUser}
        handleRemoveUser={this.handleRemoveUser(station.id, user.user_id)}
        handleClickOpen={this.handleClickOpen}
        handleClose={this.handleClose}
        isDialogOpen={isDialogOpen}
      />
    );
  }
}

StationMember.contextType = context;

const mapStateToProps = (state: IStore) => ({
  users: state.users.users,
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StationMember);
