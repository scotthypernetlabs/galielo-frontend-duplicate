import { Button, Grid, Typography } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import { IOpenModal, openModal } from "../../actions/modalActions";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../../actions/stationActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../../business/objects/station";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import React from "react";
import StationBox from "./StationBox";

const fileUploadTextDefault = "Browse or drop directory";

interface Props extends RouteComponentProps<any> {
  stations: Dictionary<Station>;
  currentUser: User;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}

type State = {
  dragOver: boolean;
  disabled: boolean;
  fileUploadText: string;
  fileUpload: boolean;
};

class Stations extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      dragOver: false,
      disabled: false,
      fileUploadText: fileUploadTextDefault,
      fileUpload: false
    };
  }

  componentDidMount() {
    this.context.stationService.refreshStations();
  }

  render() {
    if (!this.props.stations) {
      return <></>;
    }

    const pendingStations: Station[] = [];
    const stations: Station[] = [];
    Object.keys(this.props.stations).map((stationId: string) => {
      const station: Station = this.props.stations[stationId];
      if (station.invited_list.includes(this.props.currentUser.user_id)) {
        pendingStations.push(station);
      } else {
        stations.push(station);
      }
    });

    return (
      <div className="stations-container">
        {Object.keys(this.props.stations).length > 0 ? (
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
                  onClick={this.props.openCreateStation}
                >
                  Add Station
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              {stations.map((station: Station, idx: number) => {
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
                    history={this.props.history}
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
                        history={this.props.history}
                      />
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </div>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={2}
            style={{ minHeight: 400 }}
          >
            <Grid item>
              <Typography variant="h1" style={{ fontWeight: 700 }}>
                Welcome to Galileo!
              </Typography>
            </Grid>
            <Grid item>
              <Typography>Make a station to get started!</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.props.openCreateStation}
              >
                Add Station
              </Button>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

Stations.contextType = context;

const mapStateToProps = (state: IStore) => ({
  stations: state.stations.stations,
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openCreateStation: () => dispatch(openModal("Create Station")),
  receiveSelectedStation: (station: Station) =>
    dispatch(receiveSelectedStation(station))
});

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
