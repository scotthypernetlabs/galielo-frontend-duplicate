import { Dispatch } from "redux";
import { Divider, Grid, Typography } from "@material-ui/core";
import { GetMachinesFilter, Machine } from "../../business/objects/machine";
import {
  IReceiveCurrentUserMachines,
  receiveCurrentUserMachines
} from "../../actions/machineActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import { openNotificationModal } from "../../actions/modalActions";
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

type State = {};

class Machines extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
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

  public render() {
    const { currentUserMachines } = this.props;
    console.log(this.props);
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
        <Grid container style={{ overflow: "scroll" }}>
          {currentUserMachines.map(machine => {
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
