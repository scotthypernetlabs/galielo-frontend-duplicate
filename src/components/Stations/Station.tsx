import React from 'react';
import { connect } from 'react-redux';
import StationMachine from './StationMachine';
import StationMember from './StationMember';
import StationJob from './StationJob';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Machine } from '../../business/objects/machine';
import { RouteComponentProps } from 'react-router-dom';
import { Station as StationModel } from '../../business/objects/station';
import { Dictionary } from '../../business/objects/dictionary';
import { parseStationMachines } from '../../reducers/stationSelector';
import { IOpenNotificationModal, openNotificationModal, openModal } from '../../actions/modalActions';
import { User } from '../../business/objects/user';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import InviteMembers from './InviteMember';

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
}

type State = {
  mode: string;
  inviteUsers: boolean;
}

class Station extends React.Component<Props, State>{
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      mode: 'Machines',
      inviteUsers: false
    }
    this.setMode = this.setMode.bind(this);
    this.toggleInviteUsers = this.toggleInviteUsers.bind(this);
    this.handleDeleteStation = this.handleDeleteStation.bind(this);
    this.handleLeaveStation = this.handleLeaveStation.bind(this);
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
      }))
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
              <span><i className="fas fa-chalkboard"></i>Landing Zones ({station.machines.length})</span>
              <div className="plus-container" onClick={this.props.openMachineModal}><i className="fal fa-plus-circle"></i></div>
            </div>
            <div className="station-machines">
              {
                this.props.stationMachines.map( (machine:Machine) => {
                  return(
                    <div className="machine-in-station" key={machine.mid}>
                      <StationMachine machine={machine} station={station}/>
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
            <span><i className="fas fa-chalkboard"></i>Landing Zones ({station.machines.length})</span>
            <div className="plus-container" onClick={this.props.openMachineModal}><i className="fal fa-plus-circle"></i></div>
          </div>
        )
      }
  }
  users(){
    const { mode } = this.state;
    const station = this.props.station;
    console.log(station);
    if(mode === 'Users'){
      return(
        <>
          <div className="section-header station-users-header">
            <span><i className="fas fa-user"></i>Launchers ({station.members.length})</span>
            <div className="plus-container" onClick={this.toggleInviteUsers}><i className="fal fa-plus-circle"></i></div>
          </div>
          <div className="station-users">
            {
              station.members.map( (user_id) => {
                return(
                  <React.Fragment key={user_id}>
                    <StationMember user_id={user_id} history={this.props.history}/>
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
          <span><i className="fas fa-user"></i>Launchers ({station.members.length})</span>
          <div className="plus-container" onClick={this.toggleInviteUsers}><i className="fal fa-plus-circle"></i></div>
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
            <span><i className="fas fa-clipboard-list"></i>Station Activity</span>
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
            <span><i className="fas fa-clipboard-list"></i>Station Activity</span>
          </div>
      )
    }
  }
  render(){
    console.log(this.props);
    const station = this.props.station;
        if(!station){
          return null;
        }else{
          return(
            <div className="station-container">
              {
                this.state.inviteUsers &&
                <div className="backdrop" onClick={this.toggleInviteUsers}>
                  <div className="modal-style" onClick={(e) => e.stopPropagation()}>
                    <InviteMembers station={this.props.station}/>
                  </div>
                </div>
              }
              <div className="station-header">
                <h3>
                  {station && station.name}
                </h3>
                {
                  station && this.props.currentUser.user_id === station.owner ?
                  <div className="primary-btn delete-or-leave-station" onClick={this.handleDeleteStation}>
                    Delete Station
                  </div> :
                  <div className="primary-btn delete-or-leave-station" onClick={this.handleLeaveStation}>
                    Leave Station
                  </div>
                }
              </div>
              <div className="station-description">
                {station && station.description}
              </div>
              <div className="station-details">
                <span className="volumes" onClick={this.props.openVolumesModal}><i className="fas fa-database"></i>{station && station.volumes.length} Volumes</span>
                <span onClick={this.setMode("Machines")}>
                  <i className="fas fa-chalkboard"></i>{station && station.machines.length} Landing Zones
                </span>
                <span onClick={this.setMode("Users")}>
                 <i className="fas fa-user"></i>{station && station.members.length} Launchers
                </span>
                  {
                    station && (station.admins.indexOf(this.props.currentUser.user_id) >= 0)
                      ? <span><i className="fas fa-lock-open-alt"></i>You are an Admin</span> :
                      <span><i className="fas fa-lock"></i>You are not an admin</span>
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
  if(!state.stations.stations[ownProps.match.params.id]){
    ownProps.history.push('/');
    window.location.reload(false);
    return({
      currentUser: state.users.currentUser,
      station: {},
      stationMachines: parseStationMachines([], {}),
      stationJobs: {}
    })
  }
  return({
    currentUser: state.users.currentUser,
    station: state.stations.stations[ownProps.match.params.id],
    stationMachines: parseStationMachines(state.stations.stations[ownProps.match.params.id].machines, state.machines.machines),
    stationJobs: state.jobs.stationJobs
  })
}

const mapDispatchToProps = (dispatch:Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) => dispatch(openNotificationModal(modal_name, text)),
  openMachineModal: () => dispatch(openModal('Add Machine')),
  openVolumesModal: () => dispatch(openModal('Volumes'))
})

export default connect(mapStateToProps, mapDispatchToProps)(Station);
