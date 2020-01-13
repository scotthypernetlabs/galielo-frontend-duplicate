import { IStation } from "../../business/objects/station";
import { IJob } from "../../business/objects/job";

export interface IStationRepository {
  getStations(): Promise<IStation[]>;
  getStationJobs(group_id:string): Promise<IJob[]>;
  createStation(name: string, description: string, invitee_list: string[], volumes:any): void;
  destroyStation(station_id: string): void;
  inviteUsersToStation(station_id: string, usernames: string[]): void;
  respondToStationInvite(station_id: string, response: boolean): void;
  applyToStation(station_id: string): void;
  respondToStationApplication(station_id: string, user_id: string, response: boolean): void;
  leaveStation(station_id: string): void;
  expelUser(station_id: string, user_id: string): void;
  addMachinesToStation(station_id: string, machine_ids: string[], volumes: any, data_root: any): void;
  removeMachineFromStation(station_id: string, machine_ids:string[]): void;
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string): void;
  addVolume(station_id: string, volume:any): void;
  removeVolume(station_id: string, volumeNameArray: string[]):void;

}
