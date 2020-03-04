import { Dictionary } from "../../../business/objects/dictionary";
import { Grid, Link, Typography } from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { galileoTeal } from "../../theme";
import React from "react";

interface StationInviteHeaderProps {
  users: Dictionary<User>;
  station: Station;
  handleStationRequest: Function;
}

const StationInviteHeader: React.SFC<StationInviteHeaderProps> = (
  props: StationInviteHeaderProps
) => {
  const { users, station, handleStationRequest } = props;
  return (
    <>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        style={{
          backgroundColor: galileoTeal.main,
          marginLeft: 250,
          padding: 4,
          width: "calc(100% - 250px)",
          position: "absolute"
        }}
      >
        <Grid item>
          <Typography variant="h4" style={{ color: "white", paddingLeft: 5 }}>
            {users[station.owner[0]].username} invited you to join this station.
          </Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            alignItems="baseline"
            justify="center"
            style={{ marginBottom: 0 }}
          >
            <Grid item>
              <Link
                style={{ margin: 10, color: "white" }}
                onClick={handleStationRequest(station.id, true)}
              >
                Accept
              </Link>
            </Grid>
            <Grid item>
              <Link
                style={{ margin: 10, color: "white" }}
                onClick={handleStationRequest(station.id, false)}
              >
                Decline
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default StationInviteHeader;
