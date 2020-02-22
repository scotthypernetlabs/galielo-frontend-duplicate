import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {IStore} from "../../../business/objects/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {closeModal, ICloseModal, IOpenNotificationModal, openNotificationModal} from "../../../actions/modalActions";
import {Station, Volume} from "../../../business/objects/station";
import {Dictionary} from "../../../business/objects/dictionary";
import {User} from '../../../business/objects/user';
import {MyContext} from '../../../MyContext';
import {context} from '../../../context';
import {Machine} from '../../../business/objects/machine';
import {HostPathsWindow} from './HostPathsWindow';
import {VolumesWindow} from "./VolumesWindow";

interface MatchParams {
  id: string;
}

export interface VolumeInput {
  name: string;
  mountPath: string;
  writePermissions: boolean;
}

interface Props extends RouteComponentProps<MatchParams> {
  station: Station;
  currentUser: User;
  openNotificationModal: (modal_name: string, text: string) => IOpenNotificationModal;
  closeModal: () => ICloseModal,
  machines: Dictionary<Machine>;
}
type State = {
  volumeInput: VolumeInput;
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
  constructor(props: Props){
    super(props);
    this.state = {
      volumeInput: {
        name: '',
        mountPath: '',
        writePermissions: false
      },
      mountPathError: false,
      errorText: '',
      forceUpdate: false,
      selectedVolume: new Volume(
        '',
        '',
        '',
        '',
        '',
        {}
        ),
      modifyHostPaths: false,
      hostPathInput: {},
      modifyComplete: {},
    };

    this.handleAddVolume = this.handleAddVolume.bind(this);
    this.handleVolumeInput = this.handleVolumeInput.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleHostPathInput = this.handleHostPathInput.bind(this);
    this.returnToVolumesView = this.returnToVolumesView.bind(this);
    this.handleModifyHostPath = this.handleModifyHostPath.bind(this);
    this.handleHostPaths = this.handleHostPaths.bind(this);
    this.handleRemoveVolume = this.handleRemoveVolume.bind(this);
  }

  handleAddVolume(e: any){
    e.preventDefault();
    const { volumeInput } = this.state;
    const { station } = this.props;

    if(station.admins.indexOf(this.props.currentUser.user_id) < 0) {
      this.props.openNotificationModal(
        'Notifications',
        'Only admins are allowed to add volumes'
      );
      return;
    }

    if(volumeInput.mountPath.length === 0){
      return;
    }

    this.context.stationService.addVolume(
      station.id,
      volumeInput.name,
      volumeInput.mountPath,
      (volumeInput.writePermissions ? 'rw' : 'r')
    );

    this.setState({
      volumeInput: {
        name: '',
        mountPath: '',
        writePermissions: false
      }
    })
  }

  handleRemoveVolume(volume_id: string){
    return () => {
      const { station } = this.props;
      this.context.stationService.removeVolume(station.id, volume_id);
    }
  }

  handleVolumeInput(type: any){
    return(e: any) => {
      let newVolumeObject = Object.assign({}, this.state.volumeInput, {[type]: e.target.value});
      this.setState({
        volumeInput: newVolumeObject
      })
    }
  }

  handleCheckbox(e: any){
    const value = e.target.checked;
    let newVolumes = Object.assign({}, this.state.volumeInput, {writePermissions: value});
    this.setState({
      volumeInput: newVolumes
    })
  }

  handleHostPathInput(mid: string){
    return(e: any) => {
      let value = e.target.value;
      let updatedObject = Object.assign({}, this.state.hostPathInput, {[mid]: value});
      let modify = Object.assign({}, this.state.modifyComplete, {[mid]: false});
      this.setState({
        hostPathInput: updatedObject,
        modifyComplete: modify
      })
    }
  }

  handleHostPaths(volume: Volume){
    return () => {
      let setHostPaths:Dictionary<string> = {};
      let modifyComplete:Dictionary<boolean> = {};
      this.props.currentUser.mids.forEach( (mid:string) => {
        let host_path = volume.host_paths[mid];
        if(host_path){
          setHostPaths[mid] = host_path.host_path;
        }else{
          setHostPaths[mid] = "";
        }
        modifyComplete[mid] = true;
      });
      this.setState({
        selectedVolume: volume,
        modifyHostPaths: true,
        hostPathInput: setHostPaths,
        modifyComplete: modifyComplete
      })
    }
  }

  handleModifyHostPath(station_id: string, volume: Volume, mid: string, host_path: string) {
    return () => {
      if (this.state.modifyComplete[mid]) {
        return;
      }
      this.context.stationService.modifyHostPath(station_id, volume, mid, host_path)
        .then(() => {
          this.setState({
            modifyComplete: Object.assign({}, this.state.modifyComplete, {[mid]: true})
          })
        })
    }
  }

  returnToVolumesView(){
    this.setState({
      modifyHostPaths: false
    })
  }

  public render(){
    const { machines, station, closeModal } = this.props;
    const {
      modifyComplete,
      hostPathInput,
      selectedVolume,
      volumeInput,
      mountPathError,
      errorText
    } = this.state;
    return(
      <div className="modal-style" onClick={(e) => e.stopPropagation()}>
        { this.state.modifyHostPaths ?
          <HostPathsWindow
            machines={machines}
            station={station}
            modifyComplete={modifyComplete}
            hostPathInput={hostPathInput}
            selectedVolume={selectedVolume}
            returnToVolumesView={this.returnToVolumesView}
            handleHostPathInput={this.handleHostPathInput}
            handleModifyHostPath={this.handleModifyHostPath}
          /> :
          <VolumesWindow
            volumeInput={volumeInput}
            station={station}
            mountPathError={mountPathError}
            errorText={errorText}
            closeModal={closeModal}
            handleHostPaths={this.handleHostPaths}
            handleRemoveVolume={this.handleRemoveVolume}
            handleVolumeInput={this.handleVolumeInput}
            handleCheckbox={this.handleCheckbox}
            handleAddVolume={this.handleAddVolume}
          />
        }
      </div>
    )
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
  openNotificationModal: (text: string) => dispatch(openNotificationModal('Notifications', text)),
  closeModal: () => dispatch(closeModal())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VolumesModal));
