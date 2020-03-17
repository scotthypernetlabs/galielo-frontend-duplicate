import { Grid } from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import {
  faChalkboard,
  faDatabase,
  faLock,
  faLockOpen,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { linkBlue } from "../../theme";
import IconText from "../../Core/IconText";
import React from "react";

interface StationDetailsProps {
  station: Station;
  currentUser: User;
  openNotificationModal: any;
  openVolumesModal: any;
  setMode: Function;
}

const StationDetails: React.SFC<StationDetailsProps> = (
  props: StationDetailsProps
) => {
  const {
    station,
    currentUser,
    openNotificationModal,
    openVolumesModal,
    setMode
  } = props;

  const volumeText = `${station && station.volumes.length} Volumes`;
  const landingZoneText = `${station && station.machines.length} Landing Zones`;
  const launchersText = `${station && station.members.length} Launchers`;

  return (
    <div className="station-details">
      <Grid container spacing={2}>
        <Grid item>
          <span
            className="add-cursor"
            onClick={
              station.invited_list.includes(currentUser.user_id)
                ? () => {
                    openNotificationModal(
                      "Notifications",
                      "You must be a member of this group to manage volumes!"
                    );
                  }
                : openVolumesModal
            }
          >
            <IconText
              icon="storage"
              text={volumeText}
              textColor={linkBlue.main}
              iconColor={linkBlue.main}
              textVariant="h4"
              iconSize={18}
            />
          </span>
        </Grid>
        <Grid item>
          <span className="add-cursor" onClick={setMode("Machines")}>
            <IconText
              icon="tv"
              text={landingZoneText}
              textVariant="h4"
              iconSize={18}
            />
          </span>
        </Grid>
        <Grid item>
          <span className="add-cursor" onClick={setMode("Users")}>
            <IconText
              icon="person"
              text={launchersText}
              textVariant="h4"
              iconSize={18}
            />
          </span>
        </Grid>
        <Grid item>
          <span>
            {station && station.admins.indexOf(currentUser.user_id) >= 0 ? (
              <IconText
                icon="lock_open"
                text="You are an admin"
                textVariant="h4"
                iconSize={18}
              />
            ) : (
              <IconText
                icon="lock"
                text="You are not an admin"
                textVariant="h4"
                iconSize={18}
              />
            )}
          </span>
        </Grid>
      </Grid>
    </div>
  );
};

export default StationDetails;
