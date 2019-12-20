import { IStationRepository } from "../interfaces/IStationRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { IStation } from "../../business/objects/station";
import { ISocket } from "../interfaces/ISocket";

export class StationRepository implements IStationRepository {
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository,
    protected socket: ISocket
  ){
  }
  getStations(){
    return this.requestRepository.requestWithAuth(`backend`, 'GET')
  }
  createStation(name: string, description: string, invitee_list: string[], volumes:any){
    this.socket.emit('station_creation', name, description, invitee_list, volumes)
  }
  destroyStation(station_id: string){
    this.socket.emit('station_destruction', station_id)
  }
  inviteUserToStation(station_id: string, user_id: string){
    this.socket.emit('station_invite', station_id, user_id)
  }
  respondToStationInvite(station_id: string, response: boolean){
    this.socket.emit('station_invite_response', station_id, response)
  }
  applyToStation(station_id: string){
    this.socket.emit('station_request', station_id)
  }
  respondToStationApplication(station_id: string, user_id: string, response: boolean){
    this.socket.emit('station_request_response', station_id, user_id, response);
  }
  leaveStation(station_id: string){
    this.socket.emit('station_withdrawal', station_id)
  }
  expelUser(station_id: string, user_id: string){
    this.socket.emit('station_expulsion', station_id, user_id)
  }
  addMachineToStation(station_id: string, machine_id: string, volumes: any, data_root: any){
    this.socket.emit('station_machine_addition', station_id, machine_id, volumes, data_root)
  }
  removeMachineFromStation(station_id: string, machine_id: string){
    this.socket.emit('station_machine_removal', station_id, machine_id);
  }
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string){
    this.socket.emit('station_machine_update', station_id, machine_id, volume_details);
  }
  addVolume(station_id: string, volume:any){
    this.socket.emit('station_volume_addition', station_id, volume);
  }
  removeVolume(station_id: string, volumeNameArray: string[]){
    this.socket.emit('station_volume_removal', station_id, volumeNameArray);
  }
}
