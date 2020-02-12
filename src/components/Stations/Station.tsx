import React from 'react';
import { connect } from 'react-redux';
import StationMachine from './StationMachine';
import StationMember from './StationMember';
import StationJob from './StationJob';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Machine } from '../../business/objects/machine';
import { RouteComponentProps } from 'react-router-dom';
import { Station as StationModel, EditStationParams } from '../../business/objects/station';
import { parseStationMachines } from '../../reducers/stationSelector';
import { IOpenNotificationModal, openNotificationModal, openModal } from '../../actions/modalActions';
import { User } from '../../business/objects/user';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import {Button, TextField} from '@material-ui/core';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChalkboard, faClipboardList, faDatabase, faLock, faLockOpen, faUser} from "@fortawesome/free-solid-svg-icons";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams>{
  station: StationModel;
  stationMachines: Machine[];
  openMachineModal: any;
  currentUser: User;
  openNotificationModal: (modal_type: string, text: string) => IOpenNotificationModal;
  stationJobs: any;
  openVolumesModal: any;
  openInviteMembersModal: any;
}

type State = {
  mode: string;
  inviteUsers: boolean;
  editName: boolean;
  stationName: string;
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class Station extends React.Component<Props, State>{
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      mode: 'Machines',
      inviteUsers: false,
      editName: false,
      stationName: props.station.name
    }
    this.setMode = this.setMode.bind(this);
    this.toggleInviteUsers = this.toggleInviteUsers.bind(this);
    this.handleDeleteStation = this.handleDeleteStation.bind(this);
    this.handleLeaveStation = this.handleLeaveStation.bind(this);
    this.handleOpenMachineModal = this.handleOpenMachineModal.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
    this.editName = this.editName.bind(this);
    this.editNameForm = this.editNameForm.bind(this);
  }
  componentDidMount(){
    if(this.props.station.name.length === 0){
      this.props.history.push('/');
    }
  }
  handleOpenMachineModal(){
    if(this.props.station.members.indexOf(this.props.currentUser.user_id) >= 0){
      this.props.openMachineModal();
    }else{
      this.props.openNotificationModal('Notifications', 'You must be a member of this group to manage machines!');
    }
  }
  handleDeleteStation(e:any){
    this.context.stationService.destroyStation(this.props.match.params.id);
    this.props.history.push('/stations');
  }
  handleLeaveStation(e:any){
    this.context.stationService.leaveStation(this.props.match.params.id);
    this.props.history.push('/stations');
  }
  toggleInviteUsers(){
    const station = this.props.station;
    if(station.admins.indexOf(this.props.currentUser.user_id) >= 0){
      this.setState(prevState => ({
        inviteUsers: !prevState.inviteUsers
      }));
      this.props.openInviteMembersModal();
    }else{
      this.props.openNotificationModal("Notifications", 'Only admins are allowed to invite users.');
    }
  }
  setMode(mode:string){
    return(e:any) => {
      this.setState({
        mode: mode
      })
    }
  }
  machines(){
    const { mode } = this.state;
    const station = this.props.station;
      if(mode === 'Machines'){
        return(
          <>
            <div className="section-header station-machines-header">
              <span>
                <FontAwesomeIcon
                  icon={faChalkboard}
                  style={{marginLeft: 5, marginRight: 5}}
                /> Landing Zones ({station.machines.length})
              </span>
              <div className="plus-container" onClick={this.handleOpenMachineModal}><i className="fal fa-plus-circle"/></div>
            </div>
            <div className="station-machines">
              {
                this.props.stationMachines.map( (machine:Machine) => {
                  return(
                    <div className="machine-in-station" key={machine.mid}>
                      <StationMachine machine={machine} station={station} currentUser={this.props.currentUser}/>
                    </div>
                  )
                })
              }
            </div>
          </>
        )
      }else{
        return(
          <div className="section-header station-machines-header-collapsed" onClick={this.setMode("Machines")}>
            <span>
              <FontAwesomeIcon
                icon={faChalkboard}
                style={{marginLeft: 5, marginRight: 5}}
              /> Landing Zones ({station.machines.length})
            </span>
            <div className="plus-container" onClick={this.handleOpenMachineModal}><i className="fal fa-plus-circle"/></div>
          </div>
        )
      }
  }
  users(){
    const { mode } = this.state;
    const station = this.props.station;
    if(mode === 'Users'){
      return(
        <>
          <div className="section-header station-users-header">
            <span>
              <FontAwesomeIcon
                icon={faUser}
                style={{marginLeft: 5, marginRight: 5}}
              /> Launchers ({station.members.length})
            </span>
            <div className="plus-container" onClick={this.toggleInviteUsers}><i className="fal fa-plus-circle"/></div>
          </div>
          <div className="station-users">
            {
              station.members.map( (user_id) => {
                return(
                  <React.Fragment key={user_id}>
                    <StationMember user_id={user_id} history={this.props.history} station={station}/>
                  </React.Fragment>
                )
              })
            }
          </div>
        </>
      )
    }else{
      return(
        <div className="section-header station-users-header-collapsed" onClick={this.setMode("Users")}>
          <span>
            <FontAwesomeIcon
              icon={faUser}
              style={{marginLeft: 5, marginRight: 5}}
            /> Launchers ({station.members.length})
          </span>
          <div className="plus-container" onClick={this.toggleInviteUsers}><i className="fal fa-plus-circle"/></div>
        </div>
      )
    }
  }
  jobs(){
    const { mode } = this.state;
    const group = this.props.station;
    let job_list:any[] = [];
    if(this.props.stationJobs[this.props.match.params.id]){
      job_list = Object.keys(this.props.stationJobs[this.props.match.params.id]).map(key => this.props.stationJobs[this.props.match.params.id][key]);
    }
    if(mode === 'Jobs'){
      return(
        <>
          <div className="section-header station-users-header" onClick={this.setMode('Jobs')}>
            <span>
              <FontAwesomeIcon
                icon={faClipboardList}
                style={{marginLeft: 5, marginRight: 5}}
              /> Station Activity
            </span>
          </div>
          <div className="station-jobs">
            <div className="station-jobs-headers">
              <div>SENT TO</div>
              <div>SENT BY</div>
              <div>NAME OF PROJECT</div>
              <div>TIME TAKEN</div>
            </div>
            {
              job_list.map((job:any, idx:number) => {
                return(
                  <StationJob
                    key={job.id}
                    job={job}
                    />
                )
              })
            }
          </div>
        </>
      )
    }else{
      return(
          <div className="section-header station-jobs-header-collapsed" onClick={this.setMode('Jobs')}>
            <span>
              <FontAwesomeIcon
                icon={faClipboardList}
                style={{marginLeft: 5, marginRight: 5}}
              /> Station Activity
            </span>
          </div>
      )
    }
  }
  public handleChange(type:keyof State){
    return(e: any) => {
      let value = e.target.value;
      this.setState(updateState(type, value));
    }
  }
  public editNameForm(){
    return(
      <div>
          <TextField
            value={this.state.stationName}
            variant="outlined"
            size="small"
            onChange={this.handleChange('stationName')}
          />
        <div>
          <Button variant="contained" onClick={this.handleEditName(true)}>Save</Button>
          <Button variant="contained" onClick={this.handleEditName(false)}>Discard</Button>
        </div>
      </div>
    )
  }
  public handleEditName(saveEdit: boolean){
    return((e:any) => {
      if(saveEdit){
        this.context.stationService.editStation(this.props.station.id, new EditStationParams(this.state.stationName, ''))
      }else{
        this.setState({
          editName: false,
          stationName: this.props.station.name
        })
      }
    })
  }
  public editName(e:any){
    if(!this.state.editName){
      this.setState({
        editName: true,
        stationName: this.props.station.name
      })
    }
  }
  render(){
    console.log(this.state);
    const station = this.props.station;
        if(!station){
          return null;
        }else{
          return(
            <div className="station-container">
              <div className="station-header">
                {/*<h3 onClick={this.editName}>*/}
                {/*  {station && (this.state.editName ? this.editNameForm() : station.name)}*/}
                {/*</h3>*/}
                <h3>{station.name}</h3>
                {!station.invited_list.includes(this.props.currentUser.user_id) &&
                  (station && this.props.currentUser.user_id === station.owner ?
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleDeleteStation}
                    >
                      Delete Station
                    </Button> :
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleLeaveStation}
                    >
                      Leave Station
                    </Button>
                  )
                }
              </div>
              <div className="station-description">
                {station && station.description}
              </div>
              <div className="station-details">
                <span
                  className="volumes"
                  onClick={this.props.station.invited_list.includes(this.props.currentUser.user_id)
                    ? () => {this.props.openNotificationModal('Notifications',
                      'You must be a member of this group to manage volumes!')}
                    : this.props.openVolumesModal}
                >
                  <FontAwesomeIcon
                    icon={faDatabase}
                    style={{marginLeft: 5, marginRight: 5}}
                  />
                    {station && station.volumes.length} Volumes
                </span>
                <span onClick={this.setMode("Machines")}>
                  <FontAwesomeIcon
                    icon={faChalkboard}
                    style={{marginLeft: 5, marginRight: 5}}
                  />
                    {station && station.machines.length} Landing Zones
                </span>
                <span onClick={this.setMode("Users")}>
                 <FontAwesomeIcon
                   icon={faUser}
                   style={{marginLeft: 5, marginRight: 5}}
                 />
                  {station && station.members.length} Launchers
                </span>
                  {
                    station && (station.admins.indexOf(this.props.currentUser.user_id) >= 0)
                      ?
                      <span>
                        <FontAwesomeIcon
                          icon={faLockOpen}
                          style={{marginLeft: 5, marginRight: 5}}
                        /> You are an Admin
                      </span> :
                      <span>
                        <FontAwesomeIcon
                          icon={faLock}
                          style={{marginLeft: 5, marginRight: 5}}
                        /> You are not an admin
                      </span>
                  }
              </div>
              <div className="station-machines-container">
              { this.machines() }
              { this.jobs() }
              { this.users() }
              </div>
            </div>
          )
      }
  }
}

Station.contextType = context;

type InjectedProps = {
  match: any,
  history: any
}

const mapStateToProps = (state: IStore, ownProps:InjectedProps) => {
  return({
    currentUser: state.users.currentUser,
    station: state.stations.selectedStation,
    stationMachines: parseStationMachines(state.stations.selectedStation.machines, state.machines.machines),
    stationJobs: state.jobs.stationJobs
  })
}

const mapDispatchToProps = (dispatch:Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) => dispatch(openNotificationModal(modal_name, text)),
  openMachineModal: () => dispatch(openModal('Add Machine')),
  openVolumesModal: () => dispatch(openModal('Volumes')),
  openInviteMembersModal: () => dispatch(openModal('Invite Members'))
})

export default connect(mapStateToProps, mapDispatchToProps)(Station);
