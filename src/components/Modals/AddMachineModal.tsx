import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { matchPath, match } from 'react-router';
import { openModal, closeModal, openNotificationModal } from '../../actions/ModalActions';
import {IHostPath, IStation, IVolume} from "../../business/objects/station";
import {IMachine} from "../../business/objects/machine";
import {IStore} from "../../business/objects/store";
import {Dispatch} from "redux";
import {Dictionary} from "../../business/objects/dictionary";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<any> {
  // username: string; // TODO: refactor to IUser
  stations: Dictionary<IStation>;
  // machines: ;
  closeModal: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void;
}

type State = {
  machinesToModify: any;
  selectedMachine: any;
  mode: string;
  volumes: IVolume;
  data_root: any;
}

class GroupMachineModal extends React.Component<Props, State>{
  constructor(props: Props){
    super(props);
    this.state = {
      machinesToModify: {},
      selectedMachine: null,
      mode: 'machines',
      volumes: new class implements IVolume {
        access: string;
        host_paths: IHostPath[];
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

  toggleMachine(machine: IMachine){
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
    const match: match<MatchParams> = matchPath(this.props.history.location.pathname, {
      path: '/stations/:id',
      exact: true,
      strict: false
    });
    const station = this.props.stations[match.params.id];
    if(!station){
      return;
    }

    // TODO: need to use IUser object instead of currentUser
    // let keys = Object.keys(machinesToModify);
    // if(keys.length === 1 && !group.machines.includes(keys[0]) && keys[0] === this.props.currentUser.id && Object.keys(group.volumes).length > 0){
    //   this.setState({
    //     mode: 'volumes',
    //   });
    //   return;
    // }
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
    const match: match<MatchParams> = matchPath(this.props.history.location.pathname, {
      path: '/stations/:id',
      exact: true,
      strict: false
    });
    const station = this.props.stations[match.params.id];
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
    const match: match<MatchParams> = matchPath(this.props.history.location.pathname, {
      path: '/stations/:id',
      exact: true,
      strict: false
    });
    const station = this.props.stations[match.params.id];
    if(this.state.mode === "volumes"){
      return(
        <div className="modal-style" onClick={(e) => e.stopPropagation()}>
          <div className="group-machine-modal-container">
            <div className="data-root-container">
              <button className="secondary-btn" onClick={this.locateDataRoot}>
                Data Root
              </button>
              <div>{this.state.data_root}</div>
            </div>
            <div> Please locate station volumes </div>
            <div>
              {/*TODO: refactor to new Volumes*/}
              {/*{*/}
              {/*  Object.keys(station.volumes).map(volume_name => {*/}
              {/*    return(*/}
              {/*      <>*/}
              {/*        <div className="locate-volume">*/}
              {/*          <div>*/}
              {/*            {volume_name}*/}
              {/*          </div>*/}
              {/*          <button onClick={this.locateVolume(volume_name)}>*/}
              {/*            Locate*/}
              {/*          </button>*/}
              {/*        </div>*/}
              {/*        <div className="madchine-file-path">*/}
              {/*          {this.state.volumes[volume_name]}*/}
              {/*        </div>*/}
              {/*      </>*/}
              {/*    )*/}
              {/*  })*/}
              {/*}*/}
            </div>
            <div className="group-machine-modal-buttons">
              <button className="secondary-btn" onClick={this.props.closeModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={this.handleSpecialSubmit}>
                Add
              </button>
            </div>
          </div>
        </div>
      )
    }
    return(
      <div className="modal-style" onClick={(e) => e.stopPropagation()}>
        <div className="group-machine-modal-container">
          <div className="group-machine-modal">
            <div className="group-machine-modal-title">
              <span>Add Your machines</span>
              <div onClick={this.props.closeModal}><i className="fal fa-times"/></div>
            </div>
            <div className="group-user-machine-container">
              {
                // this.props.machines.map((machine: IMachine) => {
                //   let inStation = false;
                //   if(station.machines.includes(machine.mid)){
                //     inStation = true;
                //   }
                //   if(this.state.machinesToModify[machine.mid]){
                //     if(inStation === false){
                //       inStation = true;
                //     }else{
                //       inStation = false;
                //     }
                //   }
                //   let memory: number = 0;
                //   let cores: number = 0;
                //   if(machine.memory !== 'Unknown'){
                //     memory = +(+machine.memory / 1e9).toFixed(1);
                //   }
                //   if(machine.cpu !== 'Unknown'){
                //     cores = +machine.cpu;
                //   }
                //   return(
                //     <div className="group-user-machine" key={machine.mid}>
                //       <div>
                //         <div className="machine-name">
                //           {machine.machine_name}
                //         </div>
                //         <div className="machine-details">
                //           <span><i className="fas fa-sd-card"/>{memory}GB</span>
                //           <span><i className="fas fa-tachometer-fast"/>{cores} Cores</span>
                //         </div>
                //       </div>
                //
                //       <div>
                //         <button className='in-group' onClick={this.toggleMachine(machine)}>
                //           {inStation ? <i className="fas fa-check-circle"/> : <i className="far fa-check-circle"/>}
                //         </button>
                //       </div>
                //     </div>
                //   )
                // })
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

const mapStateToProps = (store: IStore) => ({
  // selectedGroup: store.modal.userViewMode.selectedGroup,
  // currentUser: ,
  // currentUserMachines: ,
  // stationMachines: store.stations.groupMachines,
  stations: store.stations.stations
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  startLoading: () => dispatch(openModal('Loading')),
  openNotificationModal: (text: string) => dispatch(openNotificationModal('AddMachine', text))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupMachineModal));
