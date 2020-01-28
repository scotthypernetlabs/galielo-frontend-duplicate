import { Station, Volume } from "../objects/station";

export interface IStationService {
  refreshStations(): Promise<void>;
  updateStation(station: Station): void;
  removeStation(station_id: string): void;
  createStation(name: string, description: string, invitee_list: string[], volumes: any): Promise<void>;
  destroyStation(station_id: string): Promise<void>;
  inviteUsersToStation(station_id: string, user_ids: string[]): Promise<void>;
  respondToStationInvite(station_id: string, response: boolean): Promise<void>;
  applyToStation(station_id: string): Promise<void>;
  respondToStationApplication(station_id: string, user_id: string, response: boolean): Promise<void>;
  leaveStation(station_id: string): Promise<void>;
  expelUser(station_id: string, user_id: string): Promise<void>;
  addMachinesToStation(station_id: string, machine_ids: string[], volumes?: any, data_root?: any): Promise<void>;
  removeMachinesFromStation(station_id: string, machine_ids:string[]): Promise<void>;
  addVolume(station_id: string, name: string, mount_point: string, access: string): Promise<void>;
  removeVolume(station_id: string, volumeid: string):Promise<void>;
  modifyHostPath(station_id: string, volume: Volume, mid: string, host_path: string): Promise<void>;
}
