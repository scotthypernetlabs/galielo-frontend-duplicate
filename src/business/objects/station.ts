import { Dictionary } from './dictionary';

export interface IVolume {
  volume_id?: string;
  station_id?: string;
  name: string;
  mount_point: string;
  access: string;
  host_paths: IHostPath[];
}
export interface IHostPath {
  volume_host_path_id?: string;
  volume_id?: string;
  mid?: string;
  host_path?: string;
}

export interface IStation {
  readonly name: string;
  readonly description: string;
  readonly id: string;
  readonly owner: string;
  readonly members: string[];
  readonly admins: string[];
  readonly machines: string[];
  readonly volumes: IVolume[];
}

export interface IStationState {
  readonly stations: Dictionary<IStation>;
  readonly inputState: IStationInput;
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
