import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { UserIconNew } from "../../svgs/UserIconNew";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import React from "react";

interface StationMemberViewProps {
  station: Station;
  user: User;
  currentUser: User;
  handleRemoveUser: any;
  handleClickOpen: any;
  isDialogOpen: any;
  handleClose: any;
}

const StationMemberView: React.SFC<StationMemberViewProps> = (
  props: StationMemberViewProps
) => {
  const {
    station,
    user,
    currentUser,
    handleRemoveUser,
    handleClickOpen,
    isDialogOpen,
    handleClose
  } = props;
  return (
    <div className="station-member">
      <div className="member-icon">{UserIconNew("OFFLINE", 35)}</div>
      <div className="member-details">
        <div className="member-name" />
        <div className="member-email">{user.username}</div>
        {station.admins.includes(currentUser.user_id) &&
          !station.admins.includes(user.user_id) && (
            <IconButton aria-label="delete" onClick={handleClickOpen}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Launcher</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to delete the launcher?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleRemoveUser(station.id, user.user_id)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StationMemberView;
