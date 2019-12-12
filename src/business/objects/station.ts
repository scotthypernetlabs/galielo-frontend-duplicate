import { Dictionary } from './dictionary';

export interface IVolume {
  mnt_point: string;
  access: string;
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
}
