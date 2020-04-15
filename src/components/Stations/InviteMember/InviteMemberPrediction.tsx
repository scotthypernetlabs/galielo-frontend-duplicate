import { Box, Button, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { UserIconNew } from "../../svgs/UserIconNew";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import IconText from "../../Core/IconText";
import React from "react";

interface InviteMemberPrediction {
  prediction: User;
  inStationAlready: boolean;
  station: Station;
  currentUser: User;
  removeUserFromStation: Function;
  alreadyInvited: boolean;
  inviteUserToCurrentStation: Function;
}

const InviteMemberPrediction: React.SFC<InviteMemberPrediction> = (
  props: InviteMemberPrediction
) => {
  const {
    prediction,
    inStationAlready,
    station,
    currentUser,
    removeUserFromStation,
    alreadyInvited,
    inviteUserToCurrentStation
  } = props;
  return (
    <div className="prediction">
      <Box display="flex" flexDirection="row" width="100%" alignItems="center">
        <Box m={1}>{UserIconNew("ONLINE", 40)}</Box>
        <Box width="100%" m={1}>
          <div className="invite-member-prediction-name">
            {prediction.username}
          </div>
        </Box>
        <Box flexShrink={0} m={1}>
          {inStationAlready &&
            station.admins.indexOf(currentUser.user_id) >= 0 && (
              <Button
                variant="outlined"
                color="primary"
                onClick={removeUserFromStation(prediction.user_id)}
              >
                Remove
              </Button>
            )}
          {alreadyInvited && (
            <div>
              <IconText icon="check" text="Invite Sent" textVariant="h5" />
            </div>
          )}
          {!inStationAlready && !alreadyInvited && (
            <Button
              variant="outlined"
              color="primary"
              onClick={inviteUserToCurrentStation(prediction.user_id)}
            >
              Invite
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default InviteMemberPrediction;
