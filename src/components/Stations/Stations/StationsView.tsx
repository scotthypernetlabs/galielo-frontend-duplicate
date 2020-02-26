import { Button, Grid, Typography } from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import React from "react";
import StationBox from "../StationBox/StationBox";

interface StationsViewProps {
  openCreateStation: any;
  history: any;
  stations: Dictionary<Station>;
  currentUser: User;
}

const StationsView: React.SFC<StationsViewProps> = (
  props: StationsViewProps
) => {
  const { openCreateStation, history, stations, currentUser } = props;

  const pendingStations: Station[] = [];
  const activeStations: Station[] = [];
  Object.keys(stations).map((stationId: string) => {
    const station: Station = stations[stationId];
    if (station.invited_list.includes(currentUser.user_id)) {
      pendingStations.push(station);
    } else {
      activeStations.push(station);
    }
  });

  return (
    <div>
      <Grid container justify="space-between" alignItems="baseline">
        <Grid item>
          <Typography variant="h3" style={{ fontWeight: 500 }}>
            Stations
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={openCreateStation}
          >
            Add Station
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        {activeStations.map((station: Station, idx: number) => {
          if (
            !station.machines ||
            !station.members ||
            !Object.keys(station.volumes)
          ) {
            return <React.Fragment key={`station-${idx}`} />;
          }
          return (
            <StationBox
              key={`station-${idx}`}
              pending={false}
              station={station}
              history={history}
            />
          );
        })}
        <Grid container style={{ paddingTop: 50 }}>
          <Grid item>
            <Typography>
              Pending Invitations ({pendingStations.length})
            </Typography>
          </Grid>
          <Grid container={true}>
            {pendingStations.map((station: Station, idx: number) => {
              if (
                !station.machines ||
                !station.members ||
                !Object.keys(station.volumes)
              ) {
                return <React.Fragment key={`pending-station-${idx}`} />;
              }
              return (
                <StationBox
                  key={`pending-station-${idx}`}
                  pending={true}
                  station={station}
                  history={history}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default StationsView;
