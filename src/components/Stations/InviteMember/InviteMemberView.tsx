import { ICloseModal } from "../../../actions/modalActions";
import { Station } from "../../../business/objects/station";
import { TextField, Typography } from "@material-ui/core";
import { User } from "../../../business/objects/user";
import InviteMemberPredictions from "./InviteMemberPredictions";
import React from "react";

interface InviteMemberViewProps {
  closeModal: () => ICloseModal;
  searchInput: string;
  handleChange: Function;
  predictions: User[];
  station: Station;
  currentUser: User;
  removeUserFromStation: Function;
  inviteUserToCurrentStation: Function;
}

const InviteMemberView: React.SFC<InviteMemberViewProps> = (
  props: InviteMemberViewProps
) => {
  const {
    closeModal,
    searchInput,
    handleChange,
    predictions,
    station,
    currentUser,
    removeUserFromStation,
    inviteUserToCurrentStation
  } = props;
  return (
    <div className="modal-style" onClick={(e: any) => e.stopPropagation()}>
      <div className="invite-members">
        <div className="group-machine-modal-title">
          <Typography variant="h3" gutterBottom={true}>
            Add Users
          </Typography>
          <div onClick={closeModal} className="add-cursor">
            <i className="fal fa-times" />
          </div>
        </div>
        <button className="user-search">
          <TextField
            variant="outlined"
            size="small"
            type="text"
            value={searchInput}
            onChange={handleChange("searchInput")}
            placeholder={"Search by Email"}
          />
        </button>
        <InviteMemberPredictions
          predictions={predictions}
          station={station}
          currentUser={currentUser}
          removeUserFromStation={removeUserFromStation}
          inviteUserToCurrentStation={inviteUserToCurrentStation}
        />
      </div>
    </div>
  );
};

export default InviteMemberView;
