import { Dictionary } from './dictionary';

export interface IVolume {
  volumeid: string;
  stationid: string;
  name: string;
  mount_point: string;
  access: string;
  host_paths: IHostPath[];
}
export interface IHostPath {
  volumehostpathid: string;
  mid: string;
  host_path: string;
}

export interface IStation {
  readonly name: string;
  readonly description: string;
  readonly stationid: string;
  readonly users: IStationUser[];
  readonly mids: string[];
  readonly volumes: IVolume[];
}

export interface IStationUser {
  readonly stationuserid: string;
  readonly userid: string;
  readonly status: string; // invited, blocked, owner, admin, member, pending
}

export interface IStationInput {
  stationName?: string;
  stationNameError?: boolean;
  description?: string;
  descriptionError?: boolean;
  charsLeft?: number;
  volumeScreen?: boolean;
  helpMode?: boolean;
  context?: string;
  mountPathErrors?: number[];
  volumes?: IVolume[];
}