import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import { History } from "history";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { Station } from "../../../business/objects/station";
import { StationFilters } from "../../../api/objects/station";
import { User, UserFilterOptions } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import React from "react";
import StationMemberView from "./StationMemberView";

type Props = {
  station: Station;
  user_id: string;
  users: Dictionary<User>;
  history: History<any>;
  currentUser: User;
  invited?: boolean;
};

type State = {
  isDialogOpen: boolean;
  page: number;
};

class StationMember extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      isDialogOpen: false,
      page: 1
    };
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handlePaginationChange(event: React.ChangeEvent<unknown>, page: number) {
    this.setState({ page });
    this.context.userService.getUsers(
      new UserFilterOptions(null, null, null, null, null, page, null, [
        this.props.station.id
      ])
    );
  }

  render() {
    const { user_id, station, currentUser, invited } = this.props;
    const { isDialogOpen, page } = this.state;
    const user = this.props.users[user_id];
    if (!user) {
      return <></>;
    }
    return (
      <div>
        <StationMemberView
          station={station}
          user={user}
          currentUser={currentUser}
          handleRemoveUser={this.handleRemoveUser(station.id, user.user_id)}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
          isDialogOpen={isDialogOpen}
          invited={invited}
        />
        <Pagination
          count={10}
          page={page}
          onChange={this.handlePaginationChange}
        />
      </div>
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
