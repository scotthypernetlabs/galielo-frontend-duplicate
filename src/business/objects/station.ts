import { Dictionary } from './dictionary';

export interface IVolume {
  name: string;
  mnt_point: string;
  access: boolean;
}
export interface IVolumes {
  volumes: Dictionary<IVolume>
}
export interface IStation {
  readonly name: string;
  readonly description: string;
  readonly id: string;
  readonly owner: string;
  readonly members: string[];
  readonly admins: string[];
  readonly machines: string[];
  readonly volumes: IVolumes;
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
