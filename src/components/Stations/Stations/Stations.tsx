import { Box, Card } from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  EStationSortBy,
  StationFilters,
  StationsSortOptions
} from "../../../api/objects/station";
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
import { User } from "../../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../../context";
import Pagination from "@material-ui/lab/Pagination";
import React from "react";
import StationsView from "./StationsView";
import WelcomeView from "./WelcomeView";

const fileUploadTextDefault = "Browse or drop directory";
const itemsPerPage = 8;

interface Props extends RouteComponentProps<any> {
  slice?: boolean;
  numberOfStations?: number;
  stations: Dictionary<Station>;
  currentUser: User;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
  searchedStations: Station[];
  receiveSearchedStations: (stations: Station[]) => IReceiveSearchedStation;
  currentStations: Station[];
}

type State = {
  dragOver: boolean;
  disabled: boolean;
  fileUploadText: string;
  fileUpload: boolean;
  sortBy: StationsSortOptions;
  order: "asc" | "desc";
  searchQuery: string;
  page: number;
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
      sortBy: StationsSortOptions.name,
      order: "desc",
      searchQuery: "",
      page: 1
    };
    this.setOrder = this.setOrder.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount(): void {
    this.context.stationService.refreshStations(
      null,
      new StationFilters(
        [this.state.searchQuery],
        this.state.page,
        itemsPerPage,
        true,
        null,
        [EStationSortBy[this.state.sortBy]],
        this.state.order
      )
    );
  }

  setOrder(order: "asc" | "desc") {
    this.context.stationService.refreshStations(
      null,
      new StationFilters(
        [this.state.searchQuery],
        this.state.page,
        itemsPerPage,
        true,
        null,
        [EStationSortBy[this.state.sortBy]],
        order
      )
    );
    this.setState({ order });
  }

  onInputChange(e: React.ChangeEvent<{ value: string }>) {
    const input = e.target.value;
    this.setState({ searchQuery: input });
    if (input.length === 0) {
      this.props.receiveSearchedStations([]);
    } else {
      this.context.stationService.searchStationName(
        new StationFilters(
          [input],
          this.state.page,
          itemsPerPage,
          true,
          null,
          [EStationSortBy[this.state.sortBy]],
          this.state.order
        )
      );
    }
  }

  onSelectChange(e: React.ChangeEvent<{ value: StationsSortOptions }>) {
    const sortBy = e.target.value;
    this.context.stationService.refreshStations(
      null,
      new StationFilters(
        [this.state.searchQuery],
        this.state.page,
        itemsPerPage,
        true,
        null,
        [EStationSortBy[sortBy]],
        this.state.order
      )
    );
    this.setState({ sortBy });
  }

  handlePaginationChange(event: React.ChangeEvent<unknown>, page: number) {
    this.setState({ page });
    this.context.stationService.refreshStations(
      null,
      new StationFilters(
        [this.state.searchQuery],
        page,
        itemsPerPage,
        true,
        null,
        [EStationSortBy[this.state.sortBy]],
        this.state.order
      )
    );
  }

  render() {
    const {
      history,
      currentUser,
      openCreateStation,
      currentStations,
      stations,
      slice,
      numberOfStations,
      searchedStations
    } = this.props;

    const { searchQuery, page } = this.state;
    const stationsToUse =
      searchQuery.length == 0 ? currentStations : searchedStations;

    return (
      <div className="stations-container">
        <Card>
          {currentStations && (
            <Box p={3}>
              {Object.keys(stations).length > 0 ? (
                <StationsView
                  slice={slice}
                  numberOfStations={numberOfStations}
                  openCreateStation={openCreateStation}
                  history={history}
                  stations={stationsToUse}
                  currentUser={currentUser}
                  onSelectChange={this.onSelectChange}
                  setOrder={this.setOrder}
                  onInputChange={this.onInputChange}
                />
              ) : (
                <WelcomeView openCreateStation={openCreateStation} />
              )}
            </Box>
          )}
        </Card>
        {!slice && (
          <Box>
            <Pagination
              count={10}
              page={page}
              onChange={this.handlePaginationChange}
            />
          </Box>
        )}
      </div>
    );
  }
}

Stations.contextType = context;

const mapStateToProps = (state: IStore) => ({
  stations: state.stations.stations,
  currentUser: state.users.currentUser,
  searchedStations: state.stations.searchedStations,
  currentStations: state.stations.currentStations
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
