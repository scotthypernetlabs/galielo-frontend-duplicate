import { Button, Grid, Typography } from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import React from "react";

interface StationHeaderProps {
  station: Station;
  currentUser: User;
  handleDeleteStation: any;
  handleLeaveStation: any;
}

const StationHeader: React.SFC<StationHeaderProps> = (
  props: StationHeaderProps
) => {
  const {
    station,
    currentUser,
    handleDeleteStation,
    handleLeaveStation
  } = props;
  return (
    <>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        style={
          station.members.includes(currentUser.user_id)
            ? {}
            : { paddingTop: 10 }
        }
      >
        {/* <h3 onClick={this.editName}>*/}
        {/*  {station && (this.state.editName ? this.editNameForm() : station.name)}*/}
        {/* </h3>*/}
        <Grid item>
          <Typography variant="h2">{station.name}</Typography>
        </Grid>
        <Grid item>
          {" "}
          {!station.invited_list.includes(currentUser.user_id) &&
            (station && currentUser.user_id === station.owner ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeleteStation}
              >
                Delete Station
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLeaveStation}
              >
                Leave Station
              </Button>
            ))}{" "}
        </Grid>
      </Grid>
      <Typography variant="h4" style={{ color: "grey", fontWeight: 400 }}>
        {station && station.description}
      </Typography>
    </>
  );
};

export default StationHeader;
