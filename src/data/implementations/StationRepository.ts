import { IStationRepository } from "../interfaces/IStationRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { Station, Volume, HostPath } from "../../business/objects/station";
import { IStation, IVolume } from "../../api/objects/station";
import { Dictionary } from "../../business/objects/dictionary";

interface ICreateStationResponse {
  station: IStation;
}
interface IGetStationResponse {
  stations: IStation[];
}
export function convertToBusinessVolume(volume: IVolume){
  let hostPathsObject:Dictionary<HostPath> = {};
  let hostPaths:HostPath[] = volume.host_paths.map(host_path => {
    let hostPath = new HostPath(host_path.volumehostpathid, host_path.mid, host_path.host_path);
    hostPathsObject[host_path.mid] = hostPath;
    return hostPath;
  })
  return new Volume(
    volume.volumeid, volume.stationid, volume.name,
    volume.mount_point, volume.access, hostPathsObject);
}
export function convertToBusinessStation(station: IStation){
  let owner: string = '';
  let admin_list: string[] = [];
  let members_list: string[] = [];
  let volumes:Volume[] = station.volumes.map(volume => {
    return convertToBusinessVolume(volume)
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
    return convertToBusinessStation(response.station).id;
  }
  async editStation(station_id: string, options: {name?: string, description?: string}){
    let response:{station: IStation} = await this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}`, 'PUT', options)
    console.log(response);
    return convertToBusinessStation(response.station);
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
  addMachinesToStation(station_id: string, machine_ids: string[], volumes?: any, data_root?: any){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/machines`, 'POST', { mids: machine_ids });
  }
  removeMachinesFromStation(station_id: string, machine_ids: string[]){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/machines`, 'DELETE', { mids: machine_ids });
  }
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string){
    // this.socket.emit('station_machine_update', station_id, machine_id, volume_details);
  }
  removeVolume(station_id: string, volumeid: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/volumes/${volumeid}`, 'DELETE')
  }
  addVolume(station_id: string, name: string, mount_point: string, access: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/volumes`, 'POST', {name, mount_point, access})
  }
  addHostPath(station_id: string, volume_id: string, mid: string, host_path: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/volumes/${volume_id}/host_paths`, 'POST', { mid, host_path })
  }
  removeHostPath(station_id: string, volume_id: string, volume_host_path_id: string){
    return this.requestRepository.requestWithAuth(`${this.backend}/station/${station_id}/volumes/${volume_id}/host_paths/${volume_host_path_id}`, 'DELETE')
  }
}
