import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core";
import { Dispatch } from "redux";
import {
  EMachineSortBy,
  GetMachinesFilter,
  Machine,
  MachinesSortOptions
} from "../../business/objects/machine";
import {
  IReceiveCurrentUserMachines,
  IReceiveSearchedMachines,
  receiveCurrentUserMachines,
  receiveSearchedMachines
} from "../../actions/machineActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { SearchBar } from "../Core/SearchBar";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import { openNotificationModal } from "../../actions/modalActions";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import LandingZone from "./LandingZone/LandingZone";
import React from "react";

type Props = {
  currentUser: User;
  openNotificationModal: Function;
  receiveCurrentUserMachines: (
    machines: Machine[]
  ) => IReceiveCurrentUserMachines;
  currentUserMachines: Machine[];
  receiveSearchedMachines: (machines: Machine[]) => IReceiveSearchedMachines;
  searchedMachines: Machine[];
};

type State = {
  sortBy: MachinesSortOptions;
  order: "asc" | "desc";
  searchQuery: string;
};

class Machines extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      sortBy: MachinesSortOptions.name,
      order: "desc",
      searchQuery: ""
    };
    this.setOrder = this.setOrder.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount(): void {
    if (this.props.currentUser.user_id !== "meme") {
      this.context.machineRepository
        .getMachines(
          new GetMachinesFilter(
            null,
            [this.props.currentUser.user_id],
            null,
            null,
            [EMachineSortBy.Name],
            "desc"
          )
        )
        .then(response => {
          this.props.receiveCurrentUserMachines(response);
        });
    }
  }

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   if (
  //     prevProps.currentUser.user_id === "meme" &&
  //     this.props.currentUser.user_id !== "meme"
  //   ) {
  //     this.context.machineRepository
  //       .getMachines(
  //         new GetMachinesFilter(null, [this.props.currentUser.user_id])
  //       )
  //       .then(response => {
  //         this.props.receiveCurrentUserMachines(response);
  //       });
  //   }
  // }

  setOrder() {
    const newOrder: "asc" | "desc" = this.state.order == "asc" ? "desc" : "asc";
    this.context.machineRepository
      .getMachines(
        new GetMachinesFilter(
          null,
          [this.props.currentUser.user_id],
          [this.state.searchQuery],
          null,
          [EMachineSortBy[this.state.sortBy]],
          newOrder
        )
      )
      .then(response => {
        this.props.receiveCurrentUserMachines(response);
      });
    this.setState({ order: newOrder });
  }

  onInputChange(e: React.ChangeEvent<{ value: string }>) {
    const input = e.target.value;
    this.setState({ searchQuery: input });
    if (input.length === 0) {
      this.props.receiveSearchedMachines([]);
    } else {
      this.context.machineRepository
        .getMachines(
          new GetMachinesFilter(
            null,
            [this.props.currentUser.user_id],
            [input],
            null,
            [EMachineSortBy[this.state.sortBy]],
            this.state.order
          )
        )
        .then(response => {
          this.props.receiveSearchedMachines(response);
        });
    }
  }

  onSelectChange(e: React.ChangeEvent<{ value: MachinesSortOptions }>) {
    const sortBy = e.target.value;
    this.context.machineRepository
      .getMachines(
        new GetMachinesFilter(
          null,
          [this.props.currentUser.user_id],
          [this.state.searchQuery],
          null,
          [EMachineSortBy[sortBy]],
          this.state.order
        )
      )
      .then(response => {
        this.props.receiveCurrentUserMachines(response);
      });
    this.setState({ sortBy });
  }

  public render() {
    const { currentUserMachines, searchedMachines } = this.props;
    const { order, searchQuery } = this.state;
    const machinesList =
      searchQuery.length == 0 ? currentUserMachines : searchedMachines;
    return (
      <div className="stations-container">
        <Grid container={true} justify="space-between" alignItems="baseline">
          <Grid item={true}>
            <Typography variant="h3" style={{ fontWeight: 500 }}>
              Machines
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Typography variant="h4" style={{ color: "gray", marginTop: 7 }}>
          My Machines ({currentUserMachines.length})
        </Typography>
        <Box
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <Box>
            <IconButton size="small" onClick={this.setOrder}>
              {order == "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Box>
          <Box mr={1}>
            <FormControl>
              <Select
                defaultValue={MachinesSortOptions.name}
                onChange={this.onSelectChange}
              >
                <MenuItem value={MachinesSortOptions.name}>
                  {MachinesSortOptions.name}
                </MenuItem>
                <MenuItem value={MachinesSortOptions.memory}>
                  {MachinesSortOptions.memory}
                </MenuItem>
                <MenuItem value={MachinesSortOptions.cores}>
                  {MachinesSortOptions.cores}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mr={1}>{"Sort By: "}</Box>
          <Box flexGrow={1}>
            <SearchBar
              placeholder="Search machines"
              onInputChange={this.onInputChange}
            />
          </Box>
        </Box>
        <Grid container style={{ overflow: "scroll" }}>
          {machinesList.map(machine => {
            return (
              <LandingZone
                machine={machine}
                station={false}
                key={machine.mid}
              />
            );
          })}
        </Grid>
      </div>
    );
  }
}

Machines.contextType = context;

const mapStateToProps = (state: IStore) => {
  return {
    currentUser: state.users.currentUser,
    currentUserMachines: state.machines.currentUserMachines,
    searchedMachines: state.machines.searchedMachines
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (text: string) =>
    dispatch(openNotificationModal("Notifications", text)),
  receiveCurrentUserMachines: (machines: Machine[]) =>
    dispatch(receiveCurrentUserMachines(machines)),
  receiveSearchedMachines: (machines: Machine[]) =>
    dispatch(receiveSearchedMachines(machines))
});

export default connect(mapStateToProps, mapDispatchToProps)(Machines);
