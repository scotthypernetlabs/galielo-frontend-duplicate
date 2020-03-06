import { Button, Grid, Typography, Card, Box } from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import React from "react";
import StationBox from "../StationBox/StationBox";

interface StationsViewProps {
  slice: boolean;
  numberOfStations?: number;
  openCreateStation: any;
  history: any;
  stations: Dictionary<Station>;
  currentUser: User;
}

const StationsView: React.SFC<StationsViewProps> = (
  props: StationsViewProps
) => {
  const { openCreateStation, history, stations, currentUser, numberOfStations } = props;

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
            {(props.slice) ? "Recently Used" : ""} Stations
          </Typography>
        </Grid>



        <Grid item>
          {!props.slice &&
            <Button
              variant="contained"
              color="primary"
              onClick={openCreateStation}
            >
              Add Station
        </Button>
          }
        </Grid>
      </Grid>
      <Grid container>
        {activeStations.slice(0, numberOfStations).map((station: Station, idx: number) => {
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
        {!props.slice &&
          <Grid container style={{ paddingTop: 50 }}>
            <Grid item>
              <Typography>
                Pending Invitations ({pendingStations.length})
            </Typography>
            </Grid>
            <Grid container>
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
        }
      </Grid>
    </div>
  );
};
export default StationsView;
