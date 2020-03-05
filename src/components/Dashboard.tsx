import Jobs from "../components/Jobs/Jobs"
import Stations from "../components/Stations/Stations/Stations"
import { RouteComponentProps } from "react-router-dom";

import { IStore } from "../business/objects/store";
import { MyContext } from "../MyContext";
import { connect } from "react-redux";
import { context } from "../context";
import Job from "./Jobs/Job";
import React from "react";
import { User } from "../business/objects/user";
import { Dictionary } from "../business/objects/dictionary";
import { Station } from "../business/objects/station";
import { IOpenModal, openModal } from "../actions/modalActions";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../actions/stationActions";




interface Props extends RouteComponentProps<any> {
  stations: Dictionary<Station>;
  currentUser: User;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}
type State = {
};
class Dashboard extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { stations, history, currentUser, openCreateStation } = this.props;
    return (
      <div className="jobs-container">
        <Stations
         slice = {true}
         numberOfStations = {5}
         history = {this.props.history}
         location = {this.props.location}
         match = {this.props.match}/>
        <Jobs
        showButtonGroup = {false}
        numberOfJobs = {5}
        />
      </div>
    );
  }
}

export default Dashboard;
