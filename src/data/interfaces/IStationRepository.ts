import { IStation } from "../../business/objects/station";

export interface IStationRepository {
  getStations(): Promise<IStation[]>;
  createStation(name: string, description: string, invitee_list: string[], volumes:any): void;
  destroyStation(station_id: string): void;
  inviteUserToStation(station_id: string, user_id: string): void;
  respondToStationInvite(station_id: string, response: boolean): void;
  applyToStation(station_id: string): void;
  respondToStationApplication(station_id: string, user_id: string, response: boolean): void;
  leaveStation(station_id: string): void;
  expelUser(station_id: string, user_id: string): void;
  addMachineToStation(station_id: string, machine_id: string, volumes: any, data_root: any): void;
  removeMachineFromStation(station_id: string, machine_id:string): void;
  updateMachineInGroup(station_id:string, machine_id:string, volume_details: string): void;
  addVolume(station_id: string, volume:any): void;
  removeVolume(station_id: string, volumeNameArray: string[]):void;
}
