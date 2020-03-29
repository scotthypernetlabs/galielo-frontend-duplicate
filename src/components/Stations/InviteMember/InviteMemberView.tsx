import { ICloseModal } from "../../../actions/modalActions";
import { Station } from "../../../business/objects/station";
import { TextField, Typography } from "@material-ui/core";
import { User } from "../../../business/objects/user";
import InviteMemberPrediction from "./InviteMemberPrediction";
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
            size="small"
            type="text"
            value={searchInput}
            onChange={handleChange("searchInput")}
            placeholder={"Search by Email"}
          />
        </button>
        <div className="predictions">
          {predictions.map((prediction: User, idx: number) => {
            const inStationAlready =
              station.members.indexOf(prediction.user_id) >= 0;
            const alreadyInvited =
              station.invited_list.indexOf(prediction.user_id) >= 0;
            if (prediction.user_id === currentUser.user_id) {
              return;
            }
            return (
              <InviteMemberPrediction
                key={`${prediction.user_id}${idx}`}
                prediction={prediction}
                inStationAlready={inStationAlready}
                station={station}
                currentUser={currentUser}
                removeUserFromStation={removeUserFromStation}
                alreadyInvited={alreadyInvited}
                inviteUserToCurrentStation={inviteUserToCurrentStation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InviteMemberView;
