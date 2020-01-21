import { IStationService } from "../interfaces/IStationService";
import { IStationRepository } from "../../data/interfaces/IStationRepository";
import { Logger } from "../../components/Logger";
import { Station } from "../objects/station";
import { receiveStations, receiveStationInput, receiveStation, removeStation } from "../../actions/stationActions";
import store from "../../store/store";
import { openNotificationModal, closeModal } from "../../actions/modalActions";
import { IMachineRepository } from "../../data/interfaces/IMachineRepository";
import { Dictionary } from "../objects/dictionary";
import { IUserRepository } from "../../data/interfaces/IUserRepository";
import { UserFilterOptions, User } from "../objects/user";
import { Machine, GetMachinesFilter } from "../objects/machine";
import { receiveMachines } from "../../actions/machineActions";
import { receiveUsers } from "../../actions/userActions";

export class StationService implements IStationService {
  constructor(
    protected stationRepository: IStationRepository,
    protected machineRepository: IMachineRepository,
    protected userRepository: IUserRepository,
    protected logService: Logger
  ){

  }
  refreshStations(stations?: Station[]){
    if(stations){
      store.dispatch(receiveStations(stations));
      return Promise.resolve<void>(null);
    }else{
      return this.stationRepository.getStations()
        .then(async(stations: Station[]) => {
          store.dispatch(receiveStations(stations));
          let machinesList:Dictionary<boolean> = {};
          let usersList:Dictionary<boolean> = {};
          stations.forEach(station => {
            station.machines.forEach(mid => {
              machinesList[mid] = true;
            })
            station.members.forEach(user_id => {
              usersList[user_id] = true;
            })
          })
          if(Object.keys(machinesList).length > 0){
            let machines:Machine[] = await this.machineRepository.getMachines(new GetMachinesFilter(Object.keys(machinesList)));
            store.dispatch(receiveMachines(machines));
          }
          let users:User[] = await this.userRepository.getUsers(new UserFilterOptions(Object.keys(usersList)));
          store.dispatch(receiveUsers(users));
        })
        .catch((err:Error) => {
          this.logService.log(err);
        })
    }
  }
  updateStation(station: Station){
    store.dispatch(receiveStation(station));
  }
  removeStation(station_id: string){
    store.dispatch(removeStation(station_id));
  }
  handleError(err:Error){
    store.dispatch(openNotificationModal("Notifications", err.message));
  }
  createStation(name: string, description: string, invitee_list: string[], volumes: any[]){
    return this.stationRepository.createStation(name, description, invitee_list)
      .then((station_id:string) => {
        if(volumes.length > 0){
          volumes.forEach(volume => {
            this.addVolume(station_id, volume);
          })
        }
        // reset input values to default after creation
        store.dispatch(receiveStationInput({
          stationName: '',
          stationNameError: false,
          description: '',
          descriptionError: false,
          charsLeft: 200,
          volumeScreen: false,
          helpMode: false,
          mountPathErrors: [],
          context: '',
          volumes: []
        }))
        store.dispatch(closeModal());
      })
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  destroyStation(station_id:string){
    return this.stationRepository.destroyStation(station_id)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  inviteUsersToStation(station_id: string, user_ids: string[]){
    return this.stationRepository.inviteUsersToStation(station_id, user_ids)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  respondToStationInvite(station_id: string, response: boolean){
    return this.stationRepository.respondToStationInvite(station_id, response)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  applyToStation(station_id:string){
    return this.stationRepository.applyToStation(station_id)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  respondToStationApplication(station_id: string, user_id: string, response: boolean){
    return this.stationRepository.respondToStationApplication(station_id, user_id, response)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  leaveStation(station_id: string){
    return this.stationRepository.leaveStation(station_id)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  expelUser(station_id: string, user_id: string){
    return this.stationRepository.expelUser(station_id, user_id)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  addMachinesToStation(station_id: string, machine_ids: string[], volumes?: any, data_root?: any){
    return this.stationRepository.addMachinesToStation(station_id, machine_ids, volumes, data_root)
      .then(() => {
        store.dispatch(closeModal());
      })
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  removeMachinesFromStation(station_id: string, machine_ids: string[]){
    return this.stationRepository.removeMachinesFromStation(station_id, machine_ids)
      .then(() => {
        store.dispatch(closeModal());
      })
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  addVolume(station_id: string, volume: any){
    return this.stationRepository.addVolume(station_id, volume)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  removeVolume(station_id: string, volumeNameArray: string[]){
    return this.stationRepository.removeVolume(station_id, volumeNameArray)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
}
