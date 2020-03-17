import { Button, Typography } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import { HostPath, Station, Volume } from "../../business/objects/station";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { User } from "../../business/objects/user";
import {
  closeModal,
  openModal,
  openNotificationModal
} from "../../actions/modalActions";
import { connect } from "react-redux";
import { context } from "../../context";
import { match, matchPath } from "react-router";
import { parseStationMachines } from "../../reducers/stationSelector";
import React from "react";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<any> {
  currentUser: User;
  stations: Dictionary<Station>;
  station: Station;
  currentUserMachines: Machine[];
  stationMachines: Machine[];
  closeModal: (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>
  ) => void;
}

type State = {
  machinesToModify: any;
  selectedMachine: any;
  mode: string;
  volumes: Volume;
  data_root: any;
};

class GroupMachineModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      machinesToModify: {},
      selectedMachine: null,
      mode: "machines",
      volumes: new (class implements Volume {
        access: string;
        host_paths: Dictionary<HostPath>;
        mount_point: string;
        name: string;
        station_id: string;
        volume_id: string;
      })(),
      data_root: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleMachine = this.toggleMachine.bind(this);
    this.locateVolume = this.locateVolume.bind(this);
    this.handleSpecialSubmit = this.handleSpecialSubmit.bind(this);
    this.locateDataRoot = this.locateDataRoot.bind(this);
  }

  toggleMachine(machine: Machine) {
    return () => {
      const { machinesToModify } = this.state;
      // Keeping track of what machines to modify the state of inside machinesToModify.
      // Toggle true/false based on whether or not it needs to be modified.
      if (machinesToModify[machine.mid]) {
        const newMachinesToModify = Object.assign({}, machinesToModify, {
          [machine.mid]: !machinesToModify[machine.mid]
        });
        this.setState({
          machinesToModify: newMachinesToModify
        });
      } else {
        const newMachinesToModify = Object.assign({}, machinesToModify, {
          [machine.mid]: true
        });
        this.setState({
          machinesToModify: newMachinesToModify
        });
      }
    };
  }

  handleSubmit(e: any) {
    e.preventDefault();
    const { machinesToModify } = this.state;
    const station = this.props.station;
    if (!station) {
      return;
    }
    // this.context.stationService.addMachinesToStation(station.id, Object.keys(machinesToModify))
    const machinesToAdd: string[] = [];
    const machinesToRemove: string[] = [];
    Object.keys(machinesToModify).forEach(machine_id => {
      if (machinesToModify[machine_id]) {
        if (station.machines.indexOf(machine_id) >= 0) {
          machinesToRemove.push(machine_id);
        } else {
          machinesToAdd.push(machine_id);
        }
      }
    });
    if (machinesToAdd.length > 0) {
      this.context.stationService.addMachinesToStation(
        station.id,
        machinesToAdd
      );
    }
    if (machinesToRemove.length > 0) {
      this.context.stationService.removeMachinesFromStation(
        station.id,
        machinesToRemove
      );
    }
  }

  locateDataRoot() {
    const inputElement: HTMLInputElement = document.createElement("input");
    inputElement.type = "file";
    // @ts-ignore
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", () => {
      this.setState({
        // @ts-ignore
        data_root: inputElement.files[0].path
      });
    });
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  locateVolume(volume_name: string) {
    return () => {
      const inputElement: HTMLInputElement = document.createElement("input");
      inputElement.type = "file";
      // @ts-ignore
      inputElement.webkitdirectory = true;
      inputElement.addEventListener("change", () => {
        const newVolumes = Object.assign({}, this.state.volumes, {
          // @ts-ignore
          [volume_name]: inputElement.files[0].path
        });
        this.setState({
          volumes: newVolumes
        });
      });
      inputElement.dispatchEvent(new MouseEvent("click"));
    };
  }

  handleSpecialSubmit() {
    const station = this.props.station;
    if (!station) {
      return;
    }
  }

  render() {
    const station = this.props.station;

    return (
      <div className="modal-style" onClick={e => e.stopPropagation()}>
        <div className="group-machine-modal-container">
          <div className="group-machine-modal">
            <div className="group-machine-modal-title">
              <Typography variant="h2" gutterBottom={true}>
                Add Your Machines
              </Typography>
              <div onClick={this.props.closeModal} className="add-cursor">
                <i className="fal fa-times" />
              </div>
            </div>
            <div className="group-user-machine-container">
              {this.props.currentUserMachines.map((machine: Machine) => {
                let inStation = false;
                if (station.machines.indexOf(machine.mid) >= 0) {
                  inStation = true;
                }
                if (this.state.machinesToModify[machine.mid]) {
                  if (inStation === false) {
                    inStation = true;
                  } else {
                    inStation = false;
                  }
                }
                let memory: string = "0 GB";
                let cores: number = 0;
                if (machine.memory !== "Unknown") {
                  memory = `${+(+machine.memory / 1e9).toFixed(1)}GB`;
                } else {
                  memory = "Currently Unavailable";
                }
                if (machine.cpu !== "Unknown") {
                  cores = +machine.cpu;
                }
                return (
                  <div className="group-user-machine" key={machine.mid}>
                    <div>
                      <div className="machine-name">{machine.machine_name}</div>
                      <div className="machine-details">
                        <span>
                          <i className="fas fa-sd-card" />
                          {memory}
                        </span>
                        <span>
                          <i className="fas fa-tachometer-fast" />
                          {cores} Cores
                        </span>
                      </div>
                    </div>

                    <div className="add-cursor">
                      <button
                        className={inStation ? "in-group" : "not-in-group"}
                        onClick={this.toggleMachine(machine)}
                      >
                        {inStation ? (
                          <i className="fas fa-check-circle" />
                        ) : (
                          <i className="far fa-check-circle" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="group-machine-modal-buttons">
              <Button variant="outlined" onClick={this.props.closeModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GroupMachineModal.contextType = context;

const mapStateToProps = (store: IStore, ownProps: any) => {
  const station = store.stations.selectedStation;
  return {
    machines: store.machines.machines,
    currentUser: store.users.currentUser,
    currentUserMachines: parseStationMachines(
      store.users.currentUser.mids,
      store.machines.machines
    ),
    stationMachines: parseStationMachines(
      station.machines,
      store.machines.machines
    ),
    stations: store.stations.stations,
    station: station
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  startLoading: () => dispatch(openModal("Loading")),
  openNotificationModal: (text: string) =>
    dispatch(openNotificationModal("AddMachine", text))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GroupMachineModal)
);
