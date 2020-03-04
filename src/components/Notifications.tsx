import { Button, Divider, Grid, Link, Typography } from "@material-ui/core";
import { Dictionary } from "../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../actions/stationActions";
import { IStore } from "../business/objects/store";
import { MyContext } from "../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../business/objects/station";
import { User } from "../business/objects/user";
import { connect } from "react-redux";
import { context } from "../context";
import { linkBlue } from "./theme";
import React from "react";



interface Props extends RouteComponentProps<any> {
  receivedStationInvites: string[];
  stations: Dictionary<Station>;
  users: Dictionary<User>;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}

type State = {
  loading: boolean;
  success: boolean;
};

class Notifications extends React.Component<Props, State> {

  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      success: false,
    };
    this.inboundStationInvites = this.inboundStationInvites.bind(this);
    this.handleStationRequest = this.handleStationRequest.bind(this);
  }
  handleStationRequest(station_id: string, response: boolean) {
    return (e: any) => {
      this.context.stationService.respondToStationInvite(station_id, response);
    };
  }
  handleOpenStation(station: Station) {
    return (e: any) => {
      this.props.history.push(`/stations/${station.id}`);
      this.props.receiveSelectedStation(station);
    };
  }

  handleButtonClick = () => {
    console.log('button clicked')
    if (!this.state.loading) {
      this.setState({success: false})
      this.setState({loading: true})
      console.log('button clicked', this.state.loading)
      setTimeout(() => {
      this.setState({success: false});
      this.setState({loading: false});
      }, 2000);
    }
  };

  inboundStationInvites() {
    const { receivedStationInvites, stations, users } = this.props;
    console.log("received", receivedStationInvites);
    if (Object.keys(stations).length === 0) {
      return;
    }
    return (
      <>
        {receivedStationInvites.map((station_id, idx) => (
          <Grid key={station_id} container={true} alignItems="center">
            {idx > 0 && <Divider style={{ marginTop: 0, marginBottom: 20 }} />}
            <Grid item={true} xs={8}>
              <Link onClick={this.handleOpenStation(stations[station_id])}>
                <Typography
                  variant="h4"
                  style={{ float: "left", marginRight: "5px" }}
                >
                  {Object.entries(users).length > 0
                    ? `${
                        users[stations[station_id].owner].username
                      } invited you to join the station `
                    : `You have been invited to join the station `}
                </Typography>
                <Typography
                  variant="h4"
                  style={{ fontWeight: 600, float: "left" }}
                >
                  {stations[station_id].name}.
                </Typography>
              </Link>
            </Grid>
            <Grid item={true} xs={4}>
              <Grid container={true} alignContent="center" justify="flex-end">
                <Grid item>
                  <Button
                    variant="outlined"
                    style={{
                      color: linkBlue.main,
                      border: `1px solid ${linkBlue.main}`
                    }}
                    className="accept-button"
                    onClick={this.handleStationRequest(station_id, true)}
                  >
                    Accept
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    style={{ color: "red", border: "1px solid red" }}
                    className="decline-button"
                    onClick={this.handleStationRequest(station_id, false)}
                  >
                    Decline
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </>
    );
  }
  render() {
    const { receivedStationInvites } = this.props;
    console.log(this.props);
    return (
      <div className="notifications">
        <Typography
          variant="h3"
          style={{ fontWeight: 500 }}
          gutterBottom={true}
        >
          Notifications ({receivedStationInvites.length})
        </Typography>
        {this.inboundStationInvites()}
      </div>
    );
  }
}

Notifications.contextType = context;

const mapStateToProps = (state: IStore) => ({
  receivedStationInvites: state.users.receivedStationInvites,
  stations: state.stations.stations,
  users: state.users.users
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveSelectedStation: (station: Station) =>
    dispatch(receiveSelectedStation(station))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
