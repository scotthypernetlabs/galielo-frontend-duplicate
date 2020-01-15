import { IStationService } from "../interfaces/IStationService";
import { IStationRepository } from "../../data/interfaces/IStationRepository";
import { Logger } from "../../components/Logger";
import { IStation } from "../objects/station";
import { receiveStations, receiveStationInput } from "../../actions/stationActions";
import store from "../../store/store";
import { openNotificationModal } from "../../actions/modalActions";

export class StationService implements IStationService {
  constructor(
    protected stationRepository: IStationRepository,
    protected logService: Logger
  ){

  }
  refreshStations(stations?: IStation[]){
    if(stations){
      store.dispatch(receiveStations(stations));
      return Promise.resolve<void>(null);
    }else{
      return this.stationRepository.getStations()
      .then((stations: IStation[]) => {
        store.dispatch(receiveStations(stations));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
    }
  }
  handleError(err:Error){
    store.dispatch(openNotificationModal("Notifications", err.message));
  }
  createStation(name: string, description: string, invitee_list: string[], volumes: string[]){
    return this.stationRepository.createStation(name, description, invitee_list, volumes)
      .then(() => {
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
  inviteUsersToStation(station_id: string, usernames: string[]){
    return this.stationRepository.inviteUsersToStation(station_id, usernames)
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
  addMachinesToStation(station_id: string, machine_ids: string[], volumes: any, data_root: any){
    return this.stationRepository.addMachinesToStation(station_id, machine_ids, volumes, data_root)
      .catch((err:Error) => {
        this.handleError(err);
      })
  }
  removeMachinesFromStation(station_id: string, machine_ids: string[]){
    return this.stationRepository.removeMachinesFromStation(station_id, machine_ids)
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
