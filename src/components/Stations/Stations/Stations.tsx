import { Box, Card } from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import { IOpenModal, openModal } from "../../../actions/modalActions";
import {
  IReceiveSearchedStation,
  IReceiveSelectedStation,
  receiveSearchedStations,
  receiveSelectedStation
} from "../../../actions/stationActions";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { RouteComponentProps } from "react-router-dom";
import { Station } from "../../../business/objects/station";
import { StationFilters } from "../../../api/objects/station";
import { User } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import React from "react";
import StationsView, { StationsSortOptions } from "./StationsView";
import WelcomeView from "./WelcomeView";
const fileUploadTextDefault = "Browse or drop directory";

interface Props extends RouteComponentProps<any> {
  slice?: boolean;
  numberOfStations?: number;
  stations: Dictionary<Station>;
  currentUser: User;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
  searchedStations: Station[];
  receiveSearchedStations: (stations: Station[]) => IReceiveSearchedStation;
}

type State = {
  dragOver: boolean;
  disabled: boolean;
  fileUploadText: string;
  fileUpload: boolean;
  sortedStations: Station[];
  sortBy: StationsSortOptions;
  order: "asc" | "desc";
  searchQuery: string;
};

class Stations extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      dragOver: false,
      disabled: false,
      fileUploadText: fileUploadTextDefault,
      fileUpload: false,
      sortedStations: undefined,
      sortBy: StationsSortOptions.name,
      order: "desc",
      searchQuery: ""
    };
    this.sortStations = this.sortStations.bind(this);
    this.setOrder = this.setOrder.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount(): void {
    this.setState({ sortedStations: this.sortStations() });
  }

  sortStations(
    sortBy: StationsSortOptions = this.state.sortBy,
    order: "asc" | "desc" = "desc",
    searchQuery?: string
  ) {
    const { stations, searchedStations } = this.props;
    let stations_obj: Station[];

    if (searchQuery && this.state.searchQuery.length > 0) {
      stations_obj = searchedStations;
    } else {
      stations_obj = Object.keys(stations).map(
        station_id => stations[station_id]
      );
    }

    stations_obj.sort((a: Station, b: Station) => {
      let station1;
      let station2;
      switch (sortBy) {
        case StationsSortOptions.last_used:
          station1 = a.updated_timestamp;
          station2 = b.updated_timestamp;
          break;
        case StationsSortOptions.machines:
          station1 = a.machines.length;
          station2 = b.machines.length;
          break;
        case StationsSortOptions.launchers:
          station1 = a.members.length;
          station2 = b.members.length;
          break;
        case StationsSortOptions.name:
          station1 = a.name;
          station2 = b.name;
          break;
        default:
          station1 = a.creation_timestamp;
          station2 = b.creation_timestamp;
          break;
      }
      if (order == "desc") {
        if (station1 < station2) return 1;
        if (station1 > station2) return -1;
        return 0;
      } else {
        if (station1 < station2) return -1;
        if (station1 > station2) return 1;
        return 0;
      }
    });
    this.setState({ sortedStations: stations_obj, sortBy });
    return stations_obj;
  }

  setOrder(order: "asc" | "desc") {
    this.setState({ order });
    this.sortStations(this.state.sortBy, order);
  }

  async onInputChange(e: React.ChangeEvent<{ value: string }>) {
    const input = e.target.value;
    this.setState({ searchQuery: input });
    if (input.length === 0) {
      this.props.receiveSearchedStations([]);
    } else {
      await this.context.stationService.searchStationName(
        new StationFilters([input])
      );
    }

    this.sortStations(this.state.sortBy, this.state.order, input);
  }

  render() {
    if (!this.props.stations) {
      return <></>;
    }

    const { history, currentUser, openCreateStation } = this.props;
    const { sortedStations } = this.state;

    return (
      <div className="stations-container">
        <Card>
          {sortedStations && (
            <Box p={3}>
              {Object.keys(this.props.stations).length > 0 ? (
                <StationsView
                  slice={this.props.slice}
                  numberOfStations={this.props.numberOfStations}
                  openCreateStation={openCreateStation}
                  history={history}
                  stations={sortedStations}
                  currentUser={currentUser}
                  sortStations={this.sortStations}
                  setOrder={this.setOrder}
                  onInputChange={this.onInputChange}
                />
              ) : (
                <WelcomeView openCreateStation={openCreateStation} />
              )}
            </Box>
          )}
        </Card>
      </div>
    );
  }
}

Stations.contextType = context;

const mapStateToProps = (state: IStore) => ({
  stations: state.stations.stations,
  currentUser: state.users.currentUser,
  searchedStations: state.stations.searchedStations
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openCreateStation: () => dispatch(openModal("Create Station")),
  receiveSelectedStation: (station: Station) =>
    dispatch(receiveSelectedStation(station)),
  receiveSearchedStations: (stations: Station[]) => {
    dispatch(receiveSearchedStations(stations));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
