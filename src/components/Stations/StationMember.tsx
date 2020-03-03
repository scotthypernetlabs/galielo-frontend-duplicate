import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import { History } from "history";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../../business/objects/station";
import { User } from "../../business/objects/user";
import { UserIconNew } from "../svgs/UserIconNew";
import { connect } from "react-redux";
import { context } from "../../context";
import { matchPath } from "react-router";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";


type Props = {
  station: Station;
  user_id: string;
  users: Dictionary<User>;
  history: History<any>;
  currentUser: User;
};

type State = {
  isDialogOpen: boolean
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
  handleClickOpen = () => {
    this.setState({isDialogOpen: true});
  };

  handleClose = () => {
    this.setState({isDialogOpen: false});
  };

  render() {
    const { user_id, station } = this.props;
    const user = this.props.users[user_id];
    if (!user) {
      return <></>;
    }
    return (
      <div className="station-member">
        <div className="member-icon">{UserIconNew("OFFLINE", 35)}</div>
        <div className="member-details">
          <div className="member-name"></div>
          <div className="member-email">{user.username}</div>
          {station.admins.indexOf(this.props.currentUser.user_id) >= 0 &&
            station.admins.indexOf(user_id) < 0 && (
              <IconButton 
                aria-label="delete"
                onClick={this.handleClickOpen}>
                <DeleteIcon fontSize="small" />
            </IconButton>        
            )}
        </div>
        <Dialog
        open={this.state.isDialogOpen}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Launcher</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that wou want to delete the launcher?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={this.handleClose} 
            color="primary">
              Cancel
          </Button>
          <Button 
            onClick={this.handleRemoveUser(station.id, user_id)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }
}
// onClick={this.handleRemoveUser(station.id, user_id)}>
StationMember.contextType = context;

const mapStateToProps = (state: IStore) => ({
  users: state.users.users,
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StationMember);
