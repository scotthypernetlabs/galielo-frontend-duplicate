import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import { HostPath, Station, Volume } from "../../../business/objects/station";
import { IStore } from "../../../business/objects/store";
import { Machine } from "../../../business/objects/machine";
import { MyContext } from "../../../MyContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { User } from "../../../business/objects/user";
import {
  closeModal,
  openModal,
  openNotificationModal
} from "../../../actions/modalActions";
import { connect } from "react-redux";
import { context } from "../../../context";
import { parseStationMachines } from "../../../reducers/stationSelector";
import AddMachineModalView from "./AddMachineModalView";
import React from "react";

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

export interface Webkit extends HTMLInputElement {
  webkitdirectory?: boolean;
}

class StationMachineModal extends React.Component<Props, State> {
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

    console.log("machines to add", machinesToAdd);
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
    const inputElement: Webkit = document.createElement("input");
    inputElement.type = "file";
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
      const inputElement: Webkit = document.createElement("input");
      inputElement.type = "file";
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
    console.log(this.props);
    return (
      <div className="modal-style" onClick={e => e.stopPropagation()}>
        <AddMachineModalView
          closeModal={this.props.closeModal}
          currentUserMachines={this.props.currentUserMachines}
          station={this.props.station}
          machinesToModify={this.state.machinesToModify}
          toggleMachine={this.toggleMachine}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

StationMachineModal.contextType = context;

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
  openNotificationModal: (text: string) =>
    dispatch(openNotificationModal("AddMachine", text))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StationMachineModal)
);
