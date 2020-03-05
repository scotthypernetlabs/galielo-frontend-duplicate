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
import { Card, Box } from "@material-ui/core";

const fileUploadTextDefault = "Browse or drop directory";


interface Props extends RouteComponentProps<any> {
  slice?: boolean;
  numberOfStations?: number;
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

    const { stations, history, currentUser, openCreateStation, numberOfStations } = this.props;

    return (
      <div className="stations-container">
        {Object.keys(this.props.stations).length > 0 ? (
          <StationsView
            slice = {this.props.slice} 
            numberOfStations = {this.props.numberOfStations}
            openCreateStation = {openCreateStation}
            history = {history}
            stations = {stations}
            currentUser = {currentUser}
          />
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
