import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Typography } from "@material-ui/core";
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
            <FontAwesomeIcon
              icon={faDatabase}
              style={{
                marginLeft: 5,
                marginRight: 5,
                color: linkBlue.main,
                float: "left",
                verticalAlign: "baseline"
              }}
            />
            <Typography
              variant="h4"
              style={{ color: linkBlue.main, float: "left" }}
            >
              {station && station.volumes.length} Volumes
            </Typography>
          </span>
        </Grid>
        <Grid item>
          <span className="add-cursor" onClick={setMode("Machines")}>
            <FontAwesomeIcon
              icon={faChalkboard}
              style={{ marginLeft: 5, marginRight: 5, float: "left" }}
            />
            <Typography variant="h4" style={{ float: "left" }}>
              {" "}
              {station && station.machines.length} Landing Zones
            </Typography>
          </span>
        </Grid>
        <Grid item>
          <span className="add-cursor" onClick={setMode("Users")}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginLeft: 5, marginRight: 5, float: "left" }}
            />
            <Typography variant="h4" style={{ float: "left" }}>
              {" "}
              {station && station.members.length} Launchers
            </Typography>
          </span>
        </Grid>
        <Grid item>
          {station && station.admins.indexOf(currentUser.user_id) >= 0 ? (
            <span>
              <FontAwesomeIcon
                icon={faLockOpen}
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  cursor: "default",
                  float: "left"
                }}
              />{" "}
              <Typography
                variant="h4"
                style={{ cursor: "default", float: "left" }}
              >
                You are an admin
              </Typography>
            </span>
          ) : (
            <span>
              <FontAwesomeIcon
                icon={faLock}
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  cursor: "default",
                  float: "left"
                }}
              />{" "}
              <Typography
                variant="h4"
                style={{ cursor: "default", float: "left" }}
              >
                You are not an admin
              </Typography>
            </span>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default StationDetails;
