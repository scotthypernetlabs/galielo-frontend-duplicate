import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../business/objects/store';
import { Dispatch } from 'redux';
import {Station, StationInput, Volume} from '../../../business/objects/station';
import {
  receiveStationInput,
  IReceiveStationInput,
  receiveSelectedStation,
  IReceiveSelectedStation
} from '../../../actions/stationActions';
import { ICloseModal, closeModal } from '../../../actions/modalActions';
import { context } from '../../../context';
import { MyContext } from '../../../MyContext';
import {Button, Checkbox, FormControlLabel, TextField, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
const MAX_CHAR = 200;

type Props = {
  state: StationInput;
  receiveStationInput: (station_input:StationInput) => IReceiveStationInput;
  closeModal: () => ICloseModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
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
  handleChange(e: { target: HTMLTextAreaElement | HTMLInputElement}, type:keyof StationInput){
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
  handleStationSubmit(e: any){
    e.preventDefault();
    const { stationName, description } = this.props.state;
    if(stationName.length === 0){
      this.props.receiveStationInput({
        stationNameError: true
      });
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
    prevVolumes.push({volume_id: '', station_id: '', name: '', mount_point: '', access: 'r', host_paths: {}});
    this.props.receiveStationInput({
      volumes: prevVolumes
    })
  }

  stationDetailsScreen(){
    const { stationName, volumeScreen, description, charsLeft, helpMode } = this.props.state;
    let buttonStyle = "primary-btn inactive";
    if(stationName.length > 0){
      buttonStyle="primary-btn";
    }
    if(volumeScreen){
      this.props.state.volumes.forEach(volume => {
        if(volume.name.length > 0 && volume.mount_point.length === 0){
          buttonStyle = 'create-station-button-faded';
        }
      })
    }
    return(
      <div className="create-station-modal-container">
        <Typography variant="h2" gutterBottom={true}>Create a Station</Typography>
        <Typography variant="h5" gutterBottom={true}>Please fill out the Station Details below.</Typography>
          <TextField
            value={stationName}
            onChange={(e) => this.handleChange(e, "stationName")}
            placeholder="Station Name"
            variant="outlined"
            size="small"
          />
          <TextField
            value={description}
            onChange={(e) => this.handleChange(e, "description")}
            rows="5"
            multiline
            placeholder="Description"
            variant="outlined"
            size="small"
          />
          <p className="group-description-textarea-counter">
            {charsLeft}/{MAX_CHAR}
          </p>
          <div className="attach-volumes-container">
            <div className="attach-volumes-text">
              <div> Attach Volumes? </div>
              <div className="hiw-text" onClick={this.setVolumeState(true, true)}>How does this work? </div>
            </div>
            <ToggleButtonGroup size = "small">
              <ToggleButton
                value="Yes"
                selected={volumeScreen && !helpMode}
                onClick={this.setVolumeState(true, false)}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                value="No"
                selected={!volumeScreen || helpMode}
                onClick={this.setVolumeState(false, false)}
              >
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="submit-buttons-container">
            <Button variant="outlined" onClick={this.props.closeModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleStationSubmit}
              disabled={stationName.length == 0}
            >
              Create Station
            </Button>
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
                <TextField
                  value={volume.name}
                  placeholder="Volume Name"
                  variant="outlined"
                  size="small"
                  onChange={this.handleVolumeInput(idx, 'name')}
                />
                <TextField
                  className={mountPathClass}
                  value={volume.mount_point}
                  placeholder="Mount Path"
                  variant="outlined"
                  size="small"
                  onChange={this.handleVolumeInput(idx, 'mount_point')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="writePermissions"
                      onChange={this.handleCheckbox(idx)}
                      checked={volume.access === 'rw'}
                  />
                  }
                  label="Write Access"
                />
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
  state: state.stations.inputState,
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveStationInput: (inputObject:StationInput) => dispatch(receiveStationInput(inputObject)),
  closeModal: () => dispatch(closeModal()),
  receiveSelectedStation: (station: Station) => dispatch(receiveSelectedStation(station))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateStationModal);
