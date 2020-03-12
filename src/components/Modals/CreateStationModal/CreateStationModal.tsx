import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import { Dispatch } from "redux";
import { ICloseModal, closeModal } from "../../../actions/modalActions";
import {
  IReceiveSelectedStation,
  IReceiveStationInput,
  receiveSelectedStation,
  receiveStationInput
} from "../../../actions/stationActions";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import {
  Station,
  StationInput,
  Volume
} from "../../../business/objects/station";
import { connect } from "react-redux";
import { context } from "../../../context";
import CreateStationModalView from "./CreateStationModalView";
import React from "react";
import { Webkit } from "../AddMachineModal/AddMachineModal";
const MAX_CHAR = 200;

type Props = {
  state: StationInput;
  receiveStationInput: (station_input: StationInput) => IReceiveStationInput;
  closeModal: () => ICloseModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
};

type State = {};

class CreateStationModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleStationSubmit = this.handleStationSubmit.bind(this);
    this.setVolumeState = this.setVolumeState.bind(this);
    this.stationDetailsScreen = this.stationDetailsScreen.bind(this);
    this.handleAddVolume = this.handleAddVolume.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleSelectMountPath = this.handleSelectMountPath.bind(this);
    this.handleVolumeInput = this.handleVolumeInput.bind(this);
    this.volumeScreen = this.volumeScreen.bind(this);
  }
  // technically should filter to either stationName or description. doesn't handle other states.
  handleChange(
    e: { target: HTMLTextAreaElement | HTMLInputElement },
    type: keyof StationInput
  ) {
    const value = e.target.value;
    if (type === "stationName" && value.length > 18) {
      return;
    }
    let chars = this.props.state.charsLeft;
    if (type === "description") {
      if (value.length > MAX_CHAR) {
        return;
      } else {
        chars = MAX_CHAR - value.length;
      }
    }
    this.props.receiveStationInput({
      [type]: value,
      [`${type}Error`]: false,
      charsLeft: chars
    });
  }
  handleStationSubmit(e: any) {
    e.preventDefault();
    const { stationName, description } = this.props.state;
    if (stationName.length === 0) {
      this.props.receiveStationInput({
        stationNameError: true
      });
      return;
    }
    const volumeList: Volume[] = [];
    const errorList: number[] = [];
    this.props.state.volumes.forEach((volume, idx) => {
      if (volume.name.length > 0) {
        if (volume.mount_point.length === 0) {
          errorList.push(idx);
        }
      }
    });
    if (errorList.length > 0) {
      this.props.receiveStationInput({
        stationNameError: false,
        mountPathErrors: errorList
      });
      return;
    }
    // create group function here
    // this.context.stationService.createStation(stationName, description, [''], ['']);
    this.context.stationService.createStation(
      stationName,
      description,
      [],
      this.props.state.volumes
    );
  }
  setVolumeState(state: boolean, helpMode: boolean) {
    return (e: any) => {
      this.props.receiveStationInput({
        volumeScreen: state,
        helpMode: helpMode
      });
    };
  }
  handleCheckbox(idx: number) {
    return (e: any) => {
      const value = e.target.checked;
      const prevVolumes = this.props.state.volumes;
      const newVolumeObject = Object.assign({}, prevVolumes[idx], {
        access: value ? "rw" : "r"
      });
      prevVolumes[idx] = newVolumeObject;
      this.props.receiveStationInput({
        volumes: prevVolumes
      });
    };
  }
  handleSelectMountPath(idx: number) {
    return (e: any) => {
      const inputElement: Webkit = document.createElement("input");
      inputElement.type = "file";
      inputElement.webkitdirectory = true;
      inputElement.addEventListener("change", file => {
        const prevVolumes = this.props.state.volumes;
        const newVolumeObject = Object.assign({}, prevVolumes[idx], {
          // @ts-ignore
          mnt_point: inputElement.files[0].path
        });
        prevVolumes[idx] = newVolumeObject;
        this.props.receiveStationInput({
          volumes: prevVolumes
        });
      });
      inputElement.dispatchEvent(new MouseEvent("click"));
    };
  }
  handleVolumeInput(idx: number, type: string) {
    return (e: any) => {
      const prevVolumes = this.props.state.volumes;
      const newVolumeObject = Object.assign({}, prevVolumes[idx], {
        [type]: e.target.value
      });
      let mountPathErrors = this.props.state.mountPathErrors;
      if (type === "mnt_point") {
        mountPathErrors = mountPathErrors.filter(index => index !== idx);
      }
      prevVolumes[idx] = newVolumeObject;
      this.props.receiveStationInput({
        volumes: prevVolumes,
        mountPathErrors: mountPathErrors
      });
    };
  }

  handleAddVolume() {
    const prevVolumes = this.props.state.volumes;
    prevVolumes.push({
      volume_id: "",
      station_id: "",
      name: "",
      mount_point: "",
      access: "r",
      host_paths: {}
    });
    this.props.receiveStationInput({
      volumes: prevVolumes
    });
  }

  stationDetailsScreen() {
    const {
      stationName,
      volumeScreen,
      description,
      charsLeft,
      helpMode
    } = this.props.state;
    let buttonStyle = "primary-btn inactive";
    if (stationName.length > 0) {
      buttonStyle = "primary-btn";
    }
    if (volumeScreen) {
      this.props.state.volumes.forEach(volume => {
        if (volume.name.length > 0 && volume.mount_point.length === 0) {
          buttonStyle = "create-station-button-faded";
        }
      });
    }
    return (
      <CreateStationModalView
        stationName={stationName}
        description={description}
        charsLeft={charsLeft}
        helpMode={helpMode}
        handleChange={this.handleChange}
        MAX_CHAR={MAX_CHAR}
        setVolumeState={this.setVolumeState}
        volumeScreen={volumeScreen}
        handleStationSubmit={this.handleStationSubmit}
        closeModal={this.props.closeModal}
      />
    );
  }
  volumeScreen() {
    const { helpMode, mountPathErrors } = this.props.state;
    if (helpMode) {
      return (
        <div className="volume-screen-help">
          <div className="hiw-header">
            <div
              className="far fa-chevron-left"
              onClick={this.setVolumeState(false, true)}
            />
            <div className="hiw-header-text">How volume Works</div>
          </div>
          <i className="fal fa-share-alt" />
          <p>
            {" "}
            Volumes are attached to a station as shared resources for all users
            in the station to access.
          </p>
          <i className="far fa-crosshairs" />
          <p>
            {" "}
            All machines added to the station will be required to locate the
            volumes locally.{" "}
          </p>
          <i className="fal fa-edit" />
          <p>
            {" "}
            You can change the volume attached to a station after the station
            has been created{" "}
          </p>
        </div>
      );
    } else {
      return (
        <div className="volumes-list">
          {this.props.state.volumes.map((volume, idx) => {
            let mountPathClass: string = "";
            if (mountPathErrors.indexOf(idx) >= 0) {
              mountPathClass = "mount-path-error";
            }
            return (
              <div className="volume" key={idx}>
                <div className="volume-index">Volume {idx + 1}</div>
                <TextField
                  value={volume.name}
                  placeholder="Volume Name"
                  variant="outlined"
                  size="small"
                  onChange={this.handleVolumeInput(idx, "name")}
                />
                <TextField
                  className={mountPathClass}
                  value={volume.mount_point}
                  placeholder="Mount Path"
                  variant="outlined"
                  size="small"
                  onChange={this.handleVolumeInput(idx, "mount_point")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="writePermissions"
                      onChange={this.handleCheckbox(idx)}
                      checked={volume.access === "rw"}
                    />
                  }
                  label="Write Access"
                />
              </div>
            );
          })}
          <div className="add-volume-btn" onClick={this.handleAddVolume}>
            + Add new volume
          </div>
        </div>
      );
    }
  }
  render() {
    let modalSize = "modal-style";
    if (this.props.state.volumeScreen) {
      modalSize = "modal-style-expanded";
    }
    return (
      <div className={modalSize} onClick={e => e.stopPropagation()}>
        {this.stationDetailsScreen()}
        {this.props.state.volumeScreen && (
          <>
            <div className="vertical-divider" />
            {this.volumeScreen()}
          </>
        )}
      </div>
    );
  }
}

CreateStationModal.contextType = context;

const mapStateToProps = (state: IStore) => ({
  state: state.stations.inputState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveStationInput: (inputObject: StationInput) =>
    dispatch(receiveStationInput(inputObject)),
  closeModal: () => dispatch(closeModal()),
  receiveSelectedStation: (station: Station) =>
    dispatch(receiveSelectedStation(station))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateStationModal);