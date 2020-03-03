import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField
} from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  HostPath,
  Station,
  Volume,
  Volume as VolumeModel
} from "../../business/objects/station";
import {
  ICloseModal,
  IOpenNotificationModal,
  closeModal,
  openNotificationModal
} from "../../actions/modalActions";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import {
  RouteComponentProps,
  match,
  matchPath,
  withRouter
} from "react-router";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import React from "react";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { IVolume } from "../../api/objects/station";

interface MatchParams {
  id: string;
}

interface VolumeInput {
  name: string;
  mountPath: string;
  writePermissions: boolean;
}

interface Props extends RouteComponentProps<MatchParams> {
  station: Station;
  currentUser: User;
  openNotificationModal: (
    modal_name: string,
    text: string
  ) => IOpenNotificationModal;
  closeModal: () => ICloseModal;
  machines: Dictionary<Machine>;
}
type State = {
  volume: VolumeInput;
  mountPathError: boolean;
  errorText: string;
  forceUpdate: boolean;
  selectedVolume: Volume;
  modifyHostPaths: boolean;
  hostPathInput: Dictionary<string>;
  modifyComplete: Dictionary<boolean>;
};

class VolumesModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      volume: {
        name: "",
        mountPath: "",
        writePermissions: false
      },
      mountPathError: false,
      errorText: "",
      forceUpdate: false,
      selectedVolume: new Volume("", "", "", "", "", {}),
      modifyHostPaths: false,
      hostPathInput: {},
      modifyComplete: {}
    };

    this.handleAddVolume = this.handleAddVolume.bind(this);
    this.handleVolumeInput = this.handleVolumeInput.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleHostPathInput = this.handleHostPathInput.bind(this);
    this.VolumesWindow = this.VolumesWindow.bind(this);
    this.HostPathsWindow = this.HostPathsWindow.bind(this);
    this.returnToVolumesView = this.returnToVolumesView.bind(this);
    this.handleModifyHostPath = this.handleModifyHostPath.bind(this);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {}

  handleAddVolume(e: any) {
    e.preventDefault();

    const { volume } = this.state;
    const { station } = this.props;
    if (station.admins.indexOf(this.props.currentUser.user_id) >= 0) {
      if (volume.mountPath.length === 0) {
        return;
      }
      const emptyHostPathList: HostPath[] = [];
      this.context.stationService.addVolume(
        station.id,
        volume.name,
        volume.mountPath,
        volume.writePermissions ? "rw" : "r"
      );
      this.setState({
        volume: {
          name: "",
          mountPath: "",
          writePermissions: false
        }
      });
    } else {
      this.props.openNotificationModal(
        "Notifications",
        "Only admins are allowed to add volumes"
      );
    }
  }

  handleRemoveVolume(volume_id: string) {
    return (e: any) => {
      const match: match<MatchParams> = matchPath(
        this.props.history.location.pathname,
        {
          path: "/stations/:id",
          exact: true,
          strict: false
        }
      );
      const { station } = this.props;
      this.context.stationService.removeVolume(station.id, volume_id);
    };
  }

  handleVolumeInput(type: any) {
    return (e: any) => {
      const newVolumeObject = Object.assign({}, this.state.volume, {
        [type]: e.target.value
      });
      this.setState({
        volume: newVolumeObject
      });
    };
  }

  handleCheckbox(e: any) {
    const value = e.target.checked;
    const newVolumes = Object.assign({}, this.state.volume, {
      writePermissions: value
    });
    this.setState({
      volume: newVolumes
    });
  }
  handleHostPathInput(mid: string) {
    return (e: any) => {
      const value = e.target.value;
      const updatedObject = Object.assign({}, this.state.hostPathInput, {
        [mid]: value
      });
      const modify = Object.assign({}, this.state.modifyComplete, {
        [mid]: false
      });
      this.setState({
        hostPathInput: updatedObject,
        modifyComplete: modify
      });
    };
  }
  handleHostPaths(volume: Volume) {
    return (e: any) => {
      const setHostPaths: Dictionary<string> = {};
      const modifyComplete: Dictionary<boolean> = {};
      const currentUserMachines = this.props.currentUser.mids;
      currentUserMachines.forEach((mid: string) => {
        const host_path = volume.host_paths[mid];
        if (host_path) {
          setHostPaths[mid] = host_path.host_path;
        } else {
          setHostPaths[mid] = "";
        }
        modifyComplete[mid] = true;
      });
      this.setState({
        selectedVolume: volume,
        modifyHostPaths: true,
        hostPathInput: setHostPaths,
        modifyComplete: modifyComplete
      });
    };
  }
  handleModifyHostPath(
    station_id: string,
    volume: Volume,
    mid: string,
    host_path: string
  ) {
    return (e: any) => {
      if (this.state.modifyComplete[mid]) {
        return;
      }
      this.context.stationService
        .modifyHostPath(station_id, volume, mid, host_path)
        .then((volume: Volume) => {
          this.setState({
            modifyComplete: Object.assign({}, this.state.modifyComplete, {
              [mid]: true
            }),
            selectedVolume: volume
          });
        });
    };
  }
  public VolumesWindow() {
    const { volume } = this.state;
    const { station } = this.props;
    return (
      <div className="volumes-modal-container">
        <div>
          <div className="volumes-modal-text">
            {station.volumes.length > 0
              ? `Please locate station volumes`
              : "No volumes in this station."}
          </div>
          <div
            onClick={this.props.closeModal}
            className="close-notifications add-cursor"
          >
            <i className="fal fa-times" style={{ fontSize: 20 }} />
          </div>
        </div>
        <div className="volumes-modal-list">
          {station.volumes.map((volume, idx) => {
            return (
              <div key={idx} className="volume-modal-volume">
                <div className="volume-modal-volume-details">
                  <div className="volume-name">{volume.name}</div>
                  <div className="volume-path">{volume.mount_point}</div>
                  <div className="volume-access">
                    {volume.access === "rw" ? "Read & Write" : "Read Only"}
                  </div>
                </div>
                <Button
                  variant="outlined"
                  onClick={this.handleHostPaths(volume)}
                >
                  Host Paths
                </Button>
                <div className="add-cursor">
                  <i
                    className="delete-btn fas fa-trash-alt"
                    onClick={this.handleRemoveVolume(volume.volume_id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="horizontal-line" />
        <TextField
          value={volume.name}
          placeholder="Volume Name"
          variant="outlined"
          size="small"
          onChange={this.handleVolumeInput("name")}
        />
        <TextField
          value={volume.mountPath}
          placeholder="Mount Path"
          variant="outlined"
          size="small"
          onChange={this.handleVolumeInput("mountPath")}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="writePermissions"
              onChange={this.handleCheckbox}
              checked={volume.writePermissions}
            />
          }
          label="Write Access"
        />
        <div>
          {this.state.mountPathError && (
            <div className="red">{this.state.errorText}</div>
          )}
        </div>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleAddVolume}
          >
            Add Volume
          </Button>
        </div>
      </div>
    );
  }
  returnToVolumesView() {
    this.setState({
      modifyHostPaths: false
    });
  }
  public HostPathsWindow() {
    const { hostPathInput, selectedVolume } = this.state;
    const { machines, station } = this.props;
    return (
      <div className="volumes-modal-container">
        <div onClick={this.returnToVolumesView} className="add-cursor">
          <i className="far fa-chevron-left" />
        </div>
        <div className="volumes-modal-text">
          Host Paths are locations Landing Zones will check for data files when
          running jobs. Currently setting host paths for {selectedVolume.name}:
        </div>
        <div className="volumes-modal-list">
          {Object.keys(hostPathInput).length > 0 ? (
            Object.keys(hostPathInput).map((mid: string, idx: number) => {
              if (station.machines.includes(mid)) {
                return (
                  <div key={idx} className="volume-modal-volume">
                    <div className="volume-modal-volume-details">
                      <div className="volume-name">
                        {machines[mid].machine_name}
                      </div>
                      <Grid container alignItems="center">
                        <Grid item xs={9}>
                          <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Enter in host path"
                            value={hostPathInput[mid]}
                            onChange={this.handleHostPathInput(mid)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          {
                            <Button
                              variant="contained"
                              size="small"
                              disabled={this.state.modifyComplete[mid]}
                              color="primary"
                              style={{ width: "80px", height: "50px" }}
                              onClick={this.handleModifyHostPath(
                                station.id,
                                selectedVolume,
                                mid,
                                hostPathInput[mid]
                              )}
                            >
                              {this.state.modifyComplete[mid]
                                ? "Saved"
                                : "Update"}
                            </Button>
                          }
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div>This station has no machines to set a host path on.</div>
          )}
        </div>
      </div>
    );
  }
  public render() {
    return (
      <div className="modal-style" onClick={e => e.stopPropagation()}>
        {this.state.modifyHostPaths
          ? this.HostPathsWindow()
          : this.VolumesWindow()}
      </div>
    );
  }
}

VolumesModal.contextType = context;

const mapStateToProps = (store: IStore) => ({
  stations: store.stations.stations,
  station: store.stations.selectedStation,
  currentUser: store.users.currentUser,
  machines: store.machines.machines
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (modal_name:string, text: string) =>
    dispatch(openNotificationModal(modal_name, text)),
  closeModal: () => dispatch(closeModal())
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VolumesModal)
);
