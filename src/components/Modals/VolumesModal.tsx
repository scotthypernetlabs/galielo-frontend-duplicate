import React from 'react';
import { matchPath, match, RouteComponentProps } from 'react-router';
import {IStore} from "../../business/objects/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {closeModal, openNotificationModal} from "../../actions/modalActions";
import {IStation} from "../../business/objects/station";
import {Dictionary} from "../../business/objects/dictionary";

interface MatchParams {
  id: string;
}

interface Volume {
  name: string;
  mountPath: string;
  writePermissions: boolean;
}

interface Props extends RouteComponentProps<any> {
  stations: Dictionary<IStation>;
  username: string; // TODO: refactor to IUser
  openNotificationModal: Function;
}
type State = {
  volume: Volume;
  mountPathError: boolean;
  errorText: string;
};

class VolumesModal extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      volume: {
        name: '',
        mountPath: '',
        writePermissions: false
      },
      mountPathError: false,
      errorText: ''
    };

    this.handleAddVolume = this.handleAddVolume.bind(this);
    this.handleVolumeInput = this.handleVolumeInput.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  handleAddVolume(e: any){
    e.preventDefault();
    const match: match<MatchParams> = matchPath(this.props.history.location.pathname, {
      path: '/stations/:id',
      exact: true,
      strict: false
    });
    const { volume } = this.state;
    const station = this.props.stations[match.params.id];
    if(station.admins.includes(this.props.username)){
      if(volume.mountPath.length === 0){
        return;
      }
      this.setState({
        volume: {
          name: '',
          mountPath: '',
          writePermissions: false
        }
      })

    }else{
      this.props.openNotificationModal('Only admins are allowed to add volumes');
    }
  }

  handleVolumeInput(type: any){
    return(e: any) => {
      let newVolumeObject = Object.assign({}, this.state.volume, {[type]: e.target.value});
      this.setState({
        volume: newVolumeObject
      })
    }
  }

  handleCheckbox(e: any){
    const value = e.target.checked;
    let newVolumes = Object.assign({}, this.state.volume, {writePermissions: value});
    this.setState({
      volume: newVolumes
    })
  }

  public render(){
    const { volume } = this.state;
    const match: match<MatchParams> = matchPath(this.props.history.location.pathname, {
      path: '/stations/:id',
      exact: true,
      strict: false
    });
    const station = this.props.stations[match.params.id];
    if(!station){
      this.props.history.push('/stations');
      return;
    }

    return(
      <div className="modal-style" onClick={(e) => e.stopPropagation()}>
        <div className="volumes-modal-container">
          <div className="volumes-modal-text">
            {
              Object.keys(station.volumes).length > 0 ?
                `Please locate station volumes on ${this.props.username}`
                :
                'No volumes in this station.'
            }
          </div>
          <div className="volumes-modal-list">
            {/*TODO: refactor to get volume name*/}
            {/*{Object.keys(station.volumes).map((volume_name: string, idx) => {*/}
            {/*  return (*/}
            {/*    <div key={idx} className="volume-modal-volume">*/}
            {/*      <div className="volume-modal-volume-details">*/}
            {/*        <div className="volume-name">*/}
            {/*          {volume_name}*/}
            {/*        </div>*/}
            {/*        <div className="volume-path">*/}
            {/*          {station.volumes[volume_name][0]}*/}
            {/*        </div>*/}
            {/*        <div className="volume-access">*/}
            {/*          {station.volumes[volume_name][1] === 'rw' ? 'Read & Write' : 'Read Only'}*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*      <button className="secondary-btn">*/}
            {/*        Locate*/}
            {/*      </button>*/}
            {/*      <i className="delete-btn fas fa-trash-alt"/>*/}
            {/*    </div>*/}
            {/*  )*/}
            {/*})}*/}
          </div>
          <div className="horizontal-line"/>
          <div className="volume-input">
            <input
              value={volume.name}
              placeholder="Volume Name"
              onChange={this.handleVolumeInput('name')}
            />
            <input
              value={volume.mountPath}
              placeholder="Mount Path"
              onChange={this.handleVolumeInput('mountPath')}
            />
          </div>
          <div className="read-write-checkbox">
            <input
              name="writePermissions"
              type="checkbox"
              checked={volume.writePermissions}
              onChange={this.handleCheckbox}/>
            <label htmlFor="scales">Write Access</label>
          </div>
          <div>
            {
              this.state.mountPathError &&
              <div className="red">
                {this.state.errorText}
              </div>
            }
          </div>
          <button className="primary-btn" onClick={this.handleAddVolume}>
            Add Volume
          </button>
        </div>
      </div>
    )
  }
}

// TODO: refactor
const mapStateToProps = (store: IStore) => ({
  stations: store.stations.stations,
  // stationMachines: ,
  // machineVolumeInformation:
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: dispatch(closeModal()),
  openNotificationModal: (text: string) => dispatch(openNotificationModal('Volumes', text))
});

export default connect(mapStateToProps, mapDispatchToProps)(VolumesModal);
