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
import { GetMachinesFilter, Machine } from "../../business/objects/machine";
import {
  IReceiveCurrentUserMachines,
  receiveCurrentUserMachines
} from "../../actions/machineActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { StationsSortOptions } from "../Stations/Stations/StationsView";
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
};

type State = {
  sortBy: MachinesSortOptions;
  order: "asc" | "desc";
};

export enum MachinesSortOptions {
  created = "Date Created",
  name = "Name"
}

class Machines extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      sortBy: MachinesSortOptions.name,
      order: "desc"
    };
    this.setOrder = this.setOrder.bind(this);
  }

  componentDidMount(): void {
    if (this.props.currentUser.user_id !== "meme") {
      this.context.machineRepository
        .getMachines(
          new GetMachinesFilter(null, [this.props.currentUser.user_id])
        )
        .then(response => {
          // this.setState({currentUserMachines: response});
          this.props.receiveCurrentUserMachines(response);
        });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.currentUser.user_id === "meme" &&
      this.props.currentUser.user_id !== "meme"
    ) {
      this.context.machineRepository
        .getMachines(
          new GetMachinesFilter(null, [this.props.currentUser.user_id])
        )
        .then(response => {
          // this.setState({currentUserMachines: response});
          this.props.receiveCurrentUserMachines(response);
        });
    }
  }

  sortMachines() {
    const { currentUserMachines } = this.props;
    const { sortBy, order } = this.state;
    const machinesList = [...currentUserMachines];
    machinesList.sort((a: Machine, b: Machine) => {
      let machine1;
      let machine2;
      switch (sortBy) {
        case MachinesSortOptions.created:
          break;
        default:
          machine1 = a.machine_name;
          machine2 = b.machine_name;
          break;
      }
      if (order == "desc") {
        if (machine1 < machine2) return 1;
        if (machine1 > machine2) return -1;
        return 0;
      } else {
        if (machine1 < machine2) return -1;
        if (machine1 > machine2) return 1;
        return 0;
      }
    });
    return machinesList;
  }

  setOrder() {
    this.setState({ order: this.state.order == "asc" ? "desc" : "asc" });
  }

  public render() {
    const { currentUserMachines } = this.props;
    const { order } = this.state;
    const machinesList = this.sortMachines();
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
            {"Name"}
            {/* <FormControl>*/}
            {/*  <Select*/}
            {/*    defaultValue={MachinesSortOptions.name}*/}
            {/*    onChange={this.sortMachines}*/}
            {/*  >*/}
            {/*    <MenuItem value={MachinesSortOptions.name}>*/}
            {/*      {StationsSortOptions.name}*/}
            {/*    </MenuItem>*/}
            {/*  </Select>*/}
            {/* </FormControl>*/}
          </Box>
          <Box mr={1}>{"Sort By: "}</Box>
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
  const currentUserMachines = Object.keys(state.machines.machines)
    .filter(machine_id => {
      return (
        state.machines.machines[machine_id].owner ===
        state.users.currentUser.user_id
      );
    })
    .map(machine_id => {
      return state.machines.machines[machine_id];
    });
  return {
    currentUser: state.users.currentUser,
    currentUserMachines: currentUserMachines
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (text: string) =>
    dispatch(openNotificationModal("Notifications", text)),
  receiveCurrentUserMachines: (machines: Machine[]) =>
    dispatch(receiveCurrentUserMachines(machines))
});

export default connect(mapStateToProps, mapDispatchToProps)(Machines);
