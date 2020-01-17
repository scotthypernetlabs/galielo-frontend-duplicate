import { IStationRepository } from "../interfaces/IStationRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { Station, Volume, HostPath } from "../../business/objects/station";
import { IStation } from "../../api/objects/station";

interface ICreateStationResponse {
  stationid: string;
}
interface IGetStationResponse {
  stations: IStation[];
}
function convertToBusinessStation(station: IStation){
  console.log(station);
  let owner: string = '';
  let admin_list: string[] = [];
  let members_list: string[] = [];
  let volumes:Volume[] = station.volumes.map(volume => {
    let hostPaths:HostPath[] = volume.host_paths.map(host_path => {
      return new HostPath(host_path.host_path, host_path.volume_host_path_id, host_path.volume_id, host_path.mid);
    })
    return new Volume(
      volume.name, volume.mount_point, volume.access,
      hostPaths, volume.volume_id, volume.station_id);
  });
  let invited_list: string[] = [];
  let pending_list: string[] = [];
  station.users.forEach(station_user => {
    if(station_user.status.toUpperCase() === "INVITED"){
      invited_list.push(station_user.userid);
    }
    if(station_user.status.toUpperCase() === "OWNER"){
      owner = station_user.userid;
      members_list.push(station_user.userid);
      admin_list.push(station_user.userid);
    }
    if(station_user.status.toUpperCase() === "ADMIN"){
      admin_list.push(station_user.userid);
      members_list.push(station_user.userid);
    }
    if(station_user.status.toUpperCase() === "MEMBER"){
      members_list.push(station_user.userid);
    }
    if(station_user.status.toUpperCase() === "PENDING"){
      members_list.push(station_user.userid);
    }
  })
  return new Station(
    station.stationid, owner, admin_list, members_list,
    station.name, station.description, station.mids, volumes, invited_list, pending_list);
}
export class StationRepository implements IStationRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository,
  ){
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }
  async getStations(options?: any){
    /*
    page
    items
    stationids
    names
    mids
    user_roles
    volumeids
    descriptions
    */
    var response:IGetStationResponse = await this.requestRepository.requestWithAuth(`${this.backend}/stations`, 'GET')
    return response.stations.map(station => {
      return convertToBusinessStation(station);
    });
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
  inviteUsersToStation(station_id: string, user_ids: string[]){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/users/invite`, 'POST', { userids: user_ids })
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
