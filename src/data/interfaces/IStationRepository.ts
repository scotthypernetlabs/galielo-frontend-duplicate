import { Station } from "../../business/objects/station";
import { Job } from "../../business/objects/job";

export interface IStationRepository {
  getStations(): Promise<Station[]>;
  getStationJobs(group_id:string): Promise<Job[]>;
  createStation(name: string, description: string, invitee_list: string[]): Promise<string>;
  destroyStation(station_id: string): Promise<void>;
  inviteUsersToStation(station_id: string, user_ids: string[]): Promise<void>;
  respondToStationInvite(station_id: string, response: boolean): Promise<void>;
  applyToStation(station_id: string): Promise<void>;
  respondToStationApplication(station_id: string, user_id: string, response: boolean): Promise<void>;
  leaveStation(station_id: string): Promise<void>;
  expelUser(station_id: string, user_id: string): Promise<void>;
  addMachinesToStation(station_id: string, machine_ids: string[], volumes?: any, data_root?: any): Promise<void>;
  removeMachinesFromStation(station_id: string, machine_ids:string[]): Promise<void>;
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string): void;
  addVolume(station_id: string, name: string, mount_point: string, access: string): Promise<void>;
  removeVolume(station_id: string, volumeid: string):Promise<void>;
  addHostPath(station_id: string, volume_id: string, mid: string, host_path: string): Promise<void>;
  removeHostPath(station_id: string, volume_id: string, volume_host_path_id: string): Promise<boolean>;
}
