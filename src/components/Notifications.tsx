import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Link,
  Typography
} from "@material-ui/core";
import { Dictionary } from "../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../actions/stationActions";
import { IStore } from "../business/objects/store";
import { Link as LinkObject } from "react-router-dom";
import { MyContext } from "../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../business/objects/station";
import { User } from "../business/objects/user";
import { connect } from "react-redux";
import { context } from "../context";
import { linkBlue } from "./theme";
import React from "react";
import emptyInbox from "../images/empty-inbox.png";
import galileoRocket from "../images/rocket-gray.png";
import store from "../store/store";

interface Props extends RouteComponentProps<any> {
  receivedStationInvites: string[];
  stations: Dictionary<Station>;
  users: Dictionary<User>;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
  numberOfNotifications?: number;
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
      success: false
    };
    this.inboundStationInvites = this.inboundStationInvites.bind(this);
    this.handleStationRequest = this.handleStationRequest.bind(this);
  }
  componentDidMount() {
    // if the view all notifications clicked on dashboard, notifications tab will be active on Sidebar
    if (!this.props.numberOfNotifications) {
      store.dispatch({ type: "NOTIFICATIONS_SELECTED" });
    }
  }
  componentWillUnmount() {
    store.dispatch({ type: "NOTIFICATIONS_UNSELECTED" });
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

  rocket_image() {
    // Import result is the URL of your image
    return <img src={galileoRocket} alt="rocket" />;
  }

  handleButtonClick() {
    if (!this.state.loading) {
      this.setState({ success: false });
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ success: false });
        this.setState({ loading: false });
      }, 2000);
    }
  }

  inboundStationInvites() {
    const { receivedStationInvites, stations, users } = this.props;
    if (Object.keys(stations).length === 0) {
      return;
    }
    return (
      <>
        {receivedStationInvites.map((station_id, idx) => (
          <Box key={`${station_id}_${idx}`} mb={1}>
            <Card>
              <Box ml={3} mr={3}>
                <Grid key={station_id} container={true} alignItems="center">
                  <Grid item={true} xs={8}>
                    <Link
                      onClick={this.handleOpenStation(stations[station_id])}
                    >
                      <Typography
                        variant="h4"
                        style={{ float: "left", marginRight: "5px" }}
                      >
                        {`You have been invited to join the station ${stations[station_id].name}`}
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
                    <Grid
                      container={true}
                      alignContent="center"
                      justify="flex-end"
                    >
                      <Grid item>
                        <Box mt={2}>
                          <Button
                            variant="outlined"
                            style={{
                              color: linkBlue.main,
                              border: `1px solid ${linkBlue.main}`
                            }}
                            className="accept-button"
                            onClick={this.handleStationRequest(
                              station_id,
                              true
                            )}
                          >
                            Accept
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box mt={2}>
                          <Button
                            variant="outlined"
                            style={{ color: "red", border: "1px solid red" }}
                            className="decline-button"
                            onClick={this.handleStationRequest(
                              station_id,
                              false
                            )}
                          >
                            Decline
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        ))}
      </>
    );
  }
  render() {
    const { receivedStationInvites } = this.props;
    return (
      <div className="notifications">
        <Card>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            p={3}
          >
            <Typography variant="h3">
              New Notifications ({receivedStationInvites.length})
            </Typography>
            {this.props.numberOfNotifications && (
              <Link component={LinkObject} to="/notifications/">
                {"View All Notifications >"}
              </Link>
            )}
          </Box>
          <Box mt={3}>
            {receivedStationInvites.length > 0 && (
              <Box mt={3}>{this.inboundStationInvites()}</Box>
            )}

            {receivedStationInvites.length === 0 && (
              <Box
                display="flex"
                mt={3}
                mb={3}
                justifyContent="center"
                alignItems="center"
              >
                <Box mr={5}>
                  <img
                    src={emptyInbox}
                    alt="Empty Inbox"
                    width="100"
                    height="100"
                  />
                </Box>
                <Typography>
                  {" "}
                  Looks like you are up to date with your notifications.
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
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
