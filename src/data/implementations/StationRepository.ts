import { IStationRepository } from "../interfaces/IStationRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { Station } from "../../business/objects/station";

interface ICreateStationResponse {
  stationid: string;
}
export class StationRepository implements IStationRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository,
  ){
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }
  getStations(){
    return this.requestRepository.requestWithAuth(`backend`, 'GET')
  }
  getStationJobs(group_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/jobs/running/${group_id}`, 'GET')
  }
  async createStation(name: string, description: string, invitee_list: string[]): Promise<string>{
    var response:ICreateStationResponse = await this.requestRepository.requestWithAuth(`${this.backend}/station`, 'POST', { name, description, usernames: invitee_list})
    return response.stationid;
  }
  destroyStation(station_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}`, 'DELETE');
  }
  inviteUsersToStation(station_id: string, usernames: string[]){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users/invite`, 'POST', { station_id, usernames })
  }
  respondToStationInvite(station_id: string, response: boolean){
    // positive response
    if(response){
      return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users/accept`, 'PUT');
    }else{
      return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users/reject`, 'PUT');
    }
  }
  applyToStation(station_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users`, 'POST');
  }
  respondToStationApplication(station_id: string, user_id: string, response: boolean){
    if(response){
      return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users/approve`, 'PUT', {station_id, userid: user_id});
    }else{
      return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users/reject`, 'PUT', { station_id, userid: user_id});
    }
  }
  leaveStation(station_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/user/withdraw`, 'PUT');
  }
  expelUser(station_id: string, user_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/user/${user_id}/delete`, 'DELETE');
  }
  addMachinesToStation(station_id: string, machine_ids: string[], volumes: any, data_root: any){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/machines`, 'POST', { station_id, machine_ids });
  }
  removeMachinesFromStation(station_id: string, machine_ids: string[]){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/machines`, 'DELETE', {station_id, machine_ids });
  }
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string){
    // this.socket.emit('station_machine_update', station_id, machine_id, volume_details);
  }
  addVolume(station_id: string, volume:any){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/volumes`, 'POST', {station_id, volume});
  }
  removeVolume(station_id: string, volumeNameArray: string[]){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/volumes`, 'DELETE', { station_id, volumes: volumeNameArray})
  }
}
