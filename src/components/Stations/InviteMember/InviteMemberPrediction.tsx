import { Box, Button, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { UserIconNew } from "../../svgs/UserIconNew";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import IconText from "../../Core/IconText";

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
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>{UserIconNew("ONLINE", 40)}</Grid>
            <Grid item>
              <div className="invite-member-prediction-name">
                {prediction.username}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
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
              <IconText icon={faCheck} text="Invite Sent" textVariant="h5" />
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
        </Grid>
      </Grid>
    </div>
  );
};

export default InviteMemberPrediction;
