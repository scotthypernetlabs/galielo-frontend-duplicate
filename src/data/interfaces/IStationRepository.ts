import { IStation } from "../../business/objects/station";
import { IJob } from "../../business/objects/job";

export interface IStationRepository {
  getStations(): Promise<IStation[]>;
  getStationJobs(group_id:string): Promise<IJob[]>;
  createStation(name: string, description: string, invitee_list: string[], volumes:any): Promise<void>;
  destroyStation(station_id: string): Promise<void>;
  inviteUsersToStation(station_id: string, usernames: string[]): Promise<void>;
  respondToStationInvite(station_id: string, response: boolean): Promise<void>;
  applyToStation(station_id: string): Promise<void>;
  respondToStationApplication(station_id: string, user_id: string, response: boolean): Promise<void>;
  leaveStation(station_id: string): Promise<void>;
  expelUser(station_id: string, user_id: string): Promise<void>;
  addMachinesToStation(station_id: string, machine_ids: string[], volumes: any, data_root: any): Promise<void>;
  removeMachinesFromStation(station_id: string, machine_ids:string[]): Promise<void>;
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string): void;
  addVolume(station_id: string, volume:any): Promise<void>;
  removeVolume(station_id: string, volumeNameArray: string[]):Promise<void>;

}
