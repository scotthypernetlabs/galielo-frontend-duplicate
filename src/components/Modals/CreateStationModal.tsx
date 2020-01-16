import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { StationInput, Volume } from '../../business/objects/station';
import { receiveStationInput, IReceiveStationInput } from '../../actions/stationActions';
import { ICloseModal, closeModal } from '../../actions/modalActions';
import { Dictionary } from '../../business/objects/dictionary';
import { context } from '../../context';
import { MyContext } from '../../MyContext';
const MAX_CHAR = 200;

type Props = {
  state: StationInput;
  receiveStationInput: (station_input:StationInput) => IReceiveStationInput;
  closeModal: () => ICloseModal
}

type State = {
}

class CreateStationModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
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
  handleChange(type:keyof StationInput){
    return(e: { target: HTMLInputElement; }) => {
      let value = e.target.value;
      if(type === "stationName" && value.length > 18){
        return;
      }
      let chars = this.props.state.charsLeft;
      if(type === "description"){
        if(value.length > MAX_CHAR){
          return;
        }else{
          chars = MAX_CHAR - value.length;
        }
      }
      this.props.receiveStationInput({
        [type]: value,
        [`${type}Error`]: false,
        charsLeft: chars,
      })
    }
  }
  handleStationSubmit(e: any){
    e.preventDefault();
    const { stationName, description } = this.props.state;
    if(stationName.length === 0){
      this.props.receiveStationInput({
        stationNameError: true
      })
      return;
    }
    let volumeList:Volume[] = [];
    let errorList:number[] = [];
    this.props.state.volumes.forEach((volume, idx) => {
      if(volume.name.length > 0){
        if(volume.mount_point.length === 0){
          errorList.push(idx);
        }
      }
    })
    if(errorList.length > 0){
      this.props.receiveStationInput({
        stationNameError: false,
        mountPathErrors: errorList
      })
      return;
    }
    // create group function here
    // this.context.stationService.createStation(stationName, description, [''], ['']);
    this.context.stationService.createStation(stationName, description, [], this.props.state.volumes);

  }
  setVolumeState(state:boolean, helpMode: boolean){
    return(e:any) => {
      this.props.receiveStationInput({
        volumeScreen: state,
        helpMode: helpMode
      })
    }
  }
  handleCheckbox(idx:number){
    return(e:any) => {
      const value = e.target.checked;
      let prevVolumes = this.props.state.volumes;
      let newVolumeObject = Object.assign({}, prevVolumes[idx], { access: (value ? 'rw' : 'r') });
      prevVolumes[idx] = newVolumeObject;
      this.props.receiveStationInput({
        volumes: prevVolumes
      })
    }
  }
  handleSelectMountPath(idx:number){
    return(e:any) => {
      let inputElement = document.createElement('input');
      inputElement.type = "file";
      //@ts-ignore
      inputElement.webkitdirectory = true;
      console.log("Handle select mouth path");
      inputElement.addEventListener("change", (file) => {

        let prevVolumes = this.props.state.volumes;
        //@ts-ignore
        let newVolumeObject = Object.assign({}, prevVolumes[idx], {mnt_point: inputElement.files[0].path })
        prevVolumes[idx] = newVolumeObject;
        this.props.receiveStationInput({
          volumes: prevVolumes
        })
      })
      inputElement.dispatchEvent(new MouseEvent("click"));
    }
  }
  handleVolumeInput(idx: number, type:string){
    return(e:any) => {
      let prevVolumes = this.props.state.volumes;
      let newVolumeObject = Object.assign({}, prevVolumes[idx], {[type]: e.target.value});
      let mountPathErrors = this.props.state.mountPathErrors;
      if(type === 'mnt_point'){
        mountPathErrors = mountPathErrors.filter(index => index !== idx);
      }
      prevVolumes[idx] = newVolumeObject;
      this.props.receiveStationInput({
        volumes: prevVolumes,
        mountPathErrors: mountPathErrors
      })
    }
  }

  handleAddVolume(){
    let prevVolumes = this.props.state.volumes;
    prevVolumes.push({name: '', mount_point: '', access: 'r', host_paths: []});
    this.props.receiveStationInput({
      volumes: prevVolumes
    })
  }
  stationDetailsScreen(){
    const { stationName, volumeScreen, stationNameError, description, descriptionError, charsLeft } = this.props.state;
    let buttonStyle = "primary-btn inactive";
    if(stationName.length > 0){
      buttonStyle="primary-btn";
    }
    let yesToggle = "white";
    let noToggle = "black";
    if(volumeScreen){
      yesToggle = "black";
      noToggle = "white;"
      this.props.state.volumes.forEach(volume => {
        if(volume.name.length > 0 && volume.mount_point.length === 0){
          buttonStyle = 'create-station-button-faded';
        }
      })
    }
    return(
      <div className="create-station-modal-container">
        <div className="create-group-modal-title">Create a Station</div>
        <p>Please fill out the Station Details below.</p>
          <input
            className={'station-name-input' + (stationNameError ? ' error' : '')}
            type="text"
            value={stationName}
            onChange={this.handleChange("stationName")}
            placeholder="Station Name"
            />
          <textarea
            value={description}
            className={'station-description-input' + (descriptionError ? ' error': '')}
            //@ts-ignore
            onChange={this.handleChange("description")}
            placeholder="Description"
          />
          <p className="group-description-textarea-counter">
            {charsLeft}/{MAX_CHAR}
          </p>
          <div className="attach-volumes-container">
            <div className="attach-volumes-text">
              <div> Attach Volumes? </div>
              <div className="hiw-text" onClick={this.setVolumeState(true, true)}>How does this work? </div>
            </div>
            <div className="attach-volume-toggle">
              <div className={yesToggle} onClick={this.setVolumeState(true, false)}>
                <p>Yes</p>
              </div>
              <div className={noToggle} onClick={this.setVolumeState(false, false)}>
                <p>No</p>
              </div>
            </div>
          </div>
          <div className="submit-buttons-container">
          <button className="cancel-button" onClick={this.props.closeModal}>
            Cancel
          </button>
          <button className={buttonStyle} onClick={this.handleStationSubmit}>
            Create Station
          </button>
          </div>
      </div>
    )
  }
  volumeScreen(){
    const { helpMode, mountPathErrors } = this.props.state;
    if(helpMode){
      return(
        <div className="volume-screen-help">
          <div className="hiw-header"><div className="far fa-chevron-left" onClick={this.setVolumeState(false, true)}></div><div className="hiw-header-text">How volume Works</div></div>
          <i className="fal fa-share-alt"></i>
          <p> Volumes are attached to a station as shared resources for all users in the station to access.</p>
          <i className="far fa-crosshairs"></i>
          <p> All machines added to the station will be required to locate the volumes locally. </p>
          <i className="fal fa-edit"></i>
          <p> You can change the volume attached to a station after the station has been created </p>
        </div>
      )
    }else{
      return(
        <div className="volumes-list">
        {
          this.props.state.volumes.map((volume, idx) => {
            let mountPathClass:string = "";
            if(mountPathErrors.indexOf(idx) >= 0){
              mountPathClass = "mount-path-error";
            }
            return (
              <div className="volume" key={idx}>
                <div className="volume-index">Volume {idx+1}</div>
                <input
                  value={volume.name}
                  placeholder="Volume Name"
                  onChange={this.handleVolumeInput(idx, 'name')}
                  />
                  <input
                    className={mountPathClass}
                    value={volume.mount_point}
                    placeholder="Mount Path"
                    onChange={this.handleVolumeInput(idx, 'mount_point')}
                    />
                  <div className="read-write-checkbox">
                    <input
                      name="writePermissions"
                      type="checkbox"
                      checked={volume.access === 'rw'}
                      onChange={this.handleCheckbox(idx)} />
                    <label> Write Access
                    </label>
                  </div>
              </div>
            )
          })
        }
          <div className="add-volume-btn" onClick={this.handleAddVolume}>
            + Add new volume
          </div>
        </div>
      )
    }
  }
  render(){
    let modalSize = "modal-style";
    if(this.props.state.volumeScreen){
      modalSize = "modal-style-expanded";
    }
      return(
          <div className={modalSize} onClick={(e) => e.stopPropagation()}>
          {
            this.stationDetailsScreen()
          }
          {
            this.props.state.volumeScreen &&
            <>
              <div className="vertical-divider" />
              {this.volumeScreen()}
            </>
          }
          </div>
      )
  }
}

CreateStationModal.contextType = context;

const mapStateToProps = (state:IStore) => ({
  state: state.stations.inputState
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveStationInput: (inputObject:StationInput) => dispatch(receiveStationInput(inputObject)),
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateStationModal);
