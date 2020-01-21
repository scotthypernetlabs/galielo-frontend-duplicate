import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { matchPath, match } from 'react-router';
import { openModal, closeModal, openNotificationModal } from '../../actions/modalActions';
import { HostPath, Station, Volume} from "../../business/objects/station";
import { Machine} from "../../business/objects/machine";
import {IStore} from "../../business/objects/store";
import {Dispatch} from "redux";
import {Dictionary} from "../../business/objects/dictionary";
import { User } from '../../business/objects/user';
import { parseStationMachines } from '../../reducers/stationSelector';
import { MyContext } from '../../MyContext';
import { context } from '../../context';

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<any> {
  currentUser: User;
  stations: Dictionary<Station>;
  station: Station;
  currentUserMachines: Machine[];
  stationMachines: Machine[];
  closeModal: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void;
}

type State = {
  machinesToModify: any;
  selectedMachine: any;
  mode: string;
  volumes: Volume;
  data_root: any;
}

class GroupMachineModal extends React.Component<Props, State>{
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      machinesToModify: {},
      selectedMachine: null,
      mode: 'machines',
      volumes: new class implements Volume {
        access: string;
        host_paths: HostPath[];
        mount_point: string;
        name: string;
        station_id: string;
        volume_id: string;
      },
      data_root: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleMachine = this.toggleMachine.bind(this);
    this.locateVolume= this.locateVolume.bind(this);
    this.handleSpecialSubmit = this.handleSpecialSubmit.bind(this);
    this.locateDataRoot = this.locateDataRoot.bind(this);
  }

  toggleMachine(machine: Machine){
    return () => {
      const { machinesToModify } = this.state;
      // Keeping track of what machines to modify the state of inside machinesToModify.
      // Toggle true/false based on whether or not it needs to be modified.
      if(machinesToModify[machine.mid]){
        let newMachinesToModify =
          Object.assign({}, machinesToModify, {[machine.mid]: !machinesToModify[machine.mid]});
        this.setState({
          machinesToModify: newMachinesToModify
        })
      }else{
        let newMachinesToModify =
          Object.assign({}, machinesToModify, {[machine.mid]: true});
        this.setState({
          machinesToModify: newMachinesToModify
        })
      }
    }
  }

  handleSubmit(e: any){
    e.preventDefault();
    const { machinesToModify } = this.state;
    const station = this.props.station;
    if(!station){
      return;
    }
    // this.context.stationService.addMachinesToStation(station.id, Object.keys(machinesToModify))
    let machinesToAdd: string[] = [];
    let machinesToRemove: string[] = [];
    Object.keys(machinesToModify).forEach(machine_id => {
      if(machinesToModify[machine_id]){
        if(station.machines.indexOf(machine_id) >= 0){
          machinesToRemove.push(machine_id);
        }else{
          machinesToAdd.push(machine_id);
        }
      }
    })
    if(machinesToAdd.length > 0){
      this.context.stationService.addMachinesToStation(station.id, machinesToAdd);
    }
    if(machinesToRemove.length > 0){
      this.context.stationService.removeMachinesFromStation(station.id, machinesToRemove);
    }
  }

  locateDataRoot(){
    let inputElement: HTMLInputElement = document.createElement('input');
    inputElement.type = "file";
    // @ts-ignore
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", () => {
      this.setState({
        // @ts-ignore
        data_root: inputElement.files[0].path
      })
    });
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  locateVolume(volume_name: string){
    return () => {
      let inputElement: HTMLInputElement = document.createElement('input');
      inputElement.type = "file";
      // @ts-ignore
      inputElement.webkitdirectory = true;
      inputElement.addEventListener("change", () => {
        // @ts-ignore
        let newVolumes = Object.assign({}, this.state.volumes, {[volume_name]: inputElement.files[0].path});
        this.setState({
          volumes: newVolumes
        })
      });
      inputElement.dispatchEvent(new MouseEvent("click"));
    }
  }

  handleSpecialSubmit(){
    const station = this.props.station;
    if(!station){
      return;
    }
    // Hard coded to only reach here if you only are adding one machine that is equal to current
    // machine
    // let volumeObject = {};
    // let volumeNames = Object.keys(station.volumes);
    // volumeNames.forEach((volume_name: string) => {
    //   volumeObject[volume_name] = "";
    // });
  }

  render(){
    const station = this.props.station;
    console.log(this.props);
    // if(this.state.mode === "volumes"){
    //   return(
    //     <div className="modal-style" onClick={(e) => e.stopPropagation()}>
    //       <div className="group-machine-modal-container">
    //         <div className="data-root-container">
    //           <button className="secondary-btn" onClick={this.locateDataRoot}>
    //             Data Root
    //           </button>
    //           <div>{this.state.data_root}</div>
    //         </div>
    //         <div> Please locate station volumes </div>
    //         <div>
    //           {
    //             station.volumes.map(volume => {
    //               return(
    //                 <>
    //                   <div className="locate-volume">
    //                     <div>
    //                       {volume.name}
    //                     </div>
    //                   </div>
    //                   <div className="machine-file-path">
    //                     {this.state.volumes[volume.name]}
    //                   </div>
    //                 </>
    //               )
    //             })
    //           }
    //         </div>
    //         <div className="group-machine-modal-buttons">
    //           <button className="secondary-btn" onClick={this.props.closeModal}>
    //             Cancel
    //           </button>
    //           <button className="primary-btn" onClick={this.handleSpecialSubmit}>
    //             Add
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }
    return(
      <div className="modal-style" onClick={(e) => e.stopPropagation()}>
        <div className="group-machine-modal-container">
          <div className="group-machine-modal">
            <div className="group-machine-modal-title">
              <span>Add Your Machines</span>
              <div onClick={this.props.closeModal}><i className="fal fa-times"/></div>
            </div>
            <div className="group-user-machine-container">
              {
                this.props.currentUserMachines.map((machine: Machine) => {
                  let inStation = false;
                  if(station.machines.indexOf(machine.mid) >= 0){
                    inStation = true;
                  }
                  if(this.state.machinesToModify[machine.mid]){
                    if(inStation === false){
                      inStation = true;
                    }else{
                      inStation = false;
                    }
                  }
                  let memory: number = 0;
                  let cores: number = 0;
                  if(machine.memory !== 'Unknown'){
                    memory = +(+machine.memory / 1e9).toFixed(1);
                  }
                  if(machine.cpu !== 'Unknown'){
                    cores = +machine.cpu;
                  }
                  return(
                    <div className="group-user-machine" key={machine.mid}>
                      <div>
                        <div className="machine-name">
                          {machine.machine_name}
                        </div>
                        <div className="machine-details">
                          <span><i className="fas fa-sd-card"/>{memory}GB</span>
                          <span><i className="fas fa-tachometer-fast"/>{cores} Cores</span>
                        </div>
                      </div>

                      <div>
                        <button className='in-group' onClick={this.toggleMachine(machine)}>
                          {inStation ? <i className="fas fa-check-circle"/> : <i className="far fa-check-circle"/>}
                        </button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="group-machine-modal-buttons">
              <button className="secondary-btn" onClick={this.props.closeModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={this.handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

GroupMachineModal.contextType = context;

const mapStateToProps = (store: IStore, ownProps:any) => {
  const match: match<MatchParams> = matchPath(ownProps.history.location.pathname, {
    path: '/stations/:id',
    exact: true,
    strict: false
  });
  let stations = store.stations.stations;
  let station = stations[match.params.id];
  return({
    machines: store.machines.machines,
    currentUser: store.users.currentUser,
    currentUserMachines: parseStationMachines(store.users.currentUser.mids, store.machines.machines),
    stationMachines: parseStationMachines(station.machines, store.machines.machines),
    stations: stations,
    station: station
  })
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  startLoading: () => dispatch(openModal('Loading')),
  openNotificationModal: (text: string) => dispatch(openNotificationModal('AddMachine', text))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupMachineModal));
