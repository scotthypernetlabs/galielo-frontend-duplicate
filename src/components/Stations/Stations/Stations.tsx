import { Button, Grid, Typography } from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import { IOpenModal, openModal } from "../../../actions/modalActions";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../../../actions/stationActions";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import React from "react";
import StationBox from "../StationBox/StationBox";
import WelcomeView from "./WelcomeView";

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

  render() {
    if (!this.props.stations) {
      return <></>;
    }

    const { stations, history, currentUser, openCreateStation } = this.props;
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
        ) : (
          <WelcomeView openCreateStation={openCreateStation} />
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
