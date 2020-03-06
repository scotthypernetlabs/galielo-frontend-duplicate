import { Button, Grid, Typography } from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import React from "react";

interface StationHeaderProps {
  station: Station;
  currentUser: User;
  handleDeleteStation: any;
  handleLeaveStation: any;
  editName: boolean;
  editNameForm: Function;
  toggleEditName: Function;
  stationName: string;
}

const StationHeader: React.SFC<StationHeaderProps> = (
  props: StationHeaderProps
) => {
  const {
    station,
    currentUser,
    handleDeleteStation,
    handleLeaveStation,
    editName,
    editNameForm,
    toggleEditName,
    stationName
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
        <Grid item onClick={() => toggleEditName()}>
          <Typography variant="h2">{(editName ? editNameForm() : stationName)}</Typography>
        </Grid>
        <Grid item>
          {!station.invited_list.includes(currentUser.user_id) &&
            (station && station.owner.includes(currentUser.user_id) ? (
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
            ))}
        </Grid>
      </Grid>
      <Typography variant="h4" style={{ color: "grey", fontWeight: 400 }}>
        {station && station.description}
      </Typography>
    </>
  );
};

export default StationHeader;
