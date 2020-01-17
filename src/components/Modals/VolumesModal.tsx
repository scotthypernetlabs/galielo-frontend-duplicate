import React from 'react';
import { matchPath, match, RouteComponentProps, withRouter } from 'react-router';
import {IStore} from "../../business/objects/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import { openNotificationModal, IOpenNotificationModal } from "../../actions/modalActions";
import { Volume as VolumeModel, Station, HostPath } from "../../business/objects/station";
import {Dictionary} from "../../business/objects/dictionary";
import { User } from '../../business/objects/user';
import { MyContext } from '../../MyContext';
import { context } from '../../context';

interface MatchParams {
  id: string;
}

interface Volume {
  name: string;
  mountPath: string;
  writePermissions: boolean;
}

interface Props extends RouteComponentProps<MatchParams> {
  stations: Dictionary<Station>;
  currentUser: User;
  openNotificationModal: (modal_name: string, text: string) => IOpenNotificationModal;
}
type State = {
  volume: Volume;
  mountPathError: boolean;
  errorText: string;
};

class VolumesModal extends React.Component<Props, State> {
  context!: MyContext;
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
    if(station.admins.indexOf(this.props.currentUser.user_id) >= 0){
      if(volume.mountPath.length === 0){
        return;
      }
      let emptyHostPathList:HostPath[] = [];
      this.context.stationService.addVolume(station.id, new VolumeModel(volume.name, volume.mountPath, (volume.writePermissions ? 'rw' : 'r'), emptyHostPathList))
      this.setState({
        volume: {
          name: '',
          mountPath: '',
          writePermissions: false
        }
      })
    }else{
      this.props.openNotificationModal("Notifications", 'Only admins are allowed to add volumes');
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
    console.log(station);
    // if(!station){
    //   this.props.history.push('/stations');
    //   return;
    // }

    return(
      <div className="modal-style" onClick={(e) => e.stopPropagation()}>
        <div className="volumes-modal-container">
          <div className="volumes-modal-text">
            {
              station.volumes.length > 0 ?
                `Please locate station volumes`
                :
                'No volumes in this station.'
            }
          </div>
          <div className="volumes-modal-list">
            {station.volumes.map((volume, idx) => {
              return (
                <div key={idx} className="volume-modal-volume">
                  <div className="volume-modal-volume-details">
                  <div className="volume-name">
                    {volume.name}
                  </div>
                  <div className="volume-path">
                    {volume.mount_point}
                  </div>
                  <div className="volume-access">
                   {volume.access === 'rw' ? 'Read & Write' : 'Read Only'}
                  </div>
               </div>
                <i className="delete-btn fas fa-trash-alt"/>
              </div>
              )
            })}
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

VolumesModal.contextType = context;

const mapStateToProps = (store: IStore) => ({
  stations: store.stations.stations,
  currentUser: store.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (text: string) => dispatch(openNotificationModal('Notifications', text))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VolumesModal));
