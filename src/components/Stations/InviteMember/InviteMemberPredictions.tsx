import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import InviteMemberPredictionView from "./InviteMemberPredictionView";
import React from "react";

interface InviteMemberPredictionsProps {
  predictions: User[];
  station: Station;
  currentUser: User;
  removeUserFromStation: Function;
  inviteUserToCurrentStation: Function;
}

const InviteMemberPredictions: React.SFC<InviteMemberPredictionsProps> = (
  props: InviteMemberPredictionsProps
) => {
  const {
    predictions,
    station,
    currentUser,
    removeUserFromStation,
    inviteUserToCurrentStation
  } = props;
  return (
    <div className="predictions">
      {predictions.map((prediction: User, idx: number) => {
        const inStationAlready =
          station.members.indexOf(prediction.user_id) >= 0;
        let alreadyInvited = false;
        if (station.invited_list.indexOf(prediction.user_id) >= 0) {
          alreadyInvited = true;
        }
        if (prediction.user_id === currentUser.user_id) {
          return;
        }
        return (
          <InviteMemberPredictionView
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
  );
};

export default InviteMemberPredictions;
