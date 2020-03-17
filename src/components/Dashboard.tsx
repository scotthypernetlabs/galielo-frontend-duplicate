import { Box, Card } from "@material-ui/core";
import { Dictionary } from "../business/objects/dictionary";
import { IOpenModal, openModal } from "../actions/modalActions";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../actions/stationActions";
import { MyContext } from "../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../business/objects/station";
import { User } from "../business/objects/user";
import Jobs from "../components/Jobs/Jobs";
import Notifications from "../components/Notifications";
import React from "react";
import Stations from "../components/Stations/Stations/Stations";

interface Props extends RouteComponentProps<any> {
  stations: Dictionary<Station>;
  currentUser: User;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}
type State = {};
class Dashboard extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    const { stations, history, currentUser, openCreateStation } = this.props;
    return (
      <div className="jobs-container">
        <Box mb={3}>
          <Card>
            <Stations
              slice={true}
              numberOfStations={2}
              history={this.props.history}
              location={this.props.location}
              match={this.props.match}
            />
          </Card>
        </Box>
        <Box mb={3}>
          <Card>
            <Jobs showButtonGroup={false} numberOfJobs={5} />
          </Card>
        </Box>

        <Card>
          <Notifications
            numberOfNotifications={5}
            history={this.props.history}
            location={this.props.location}
            match={this.props.match}
          />
        </Card>
      </div>
    );
  }
}
export default Dashboard;
