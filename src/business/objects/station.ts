import { Dictionary } from "./dictionary";

export class Volume {
  constructor(
    public volume_id: string,
    public station_id: string,
    public name: string,
    public mount_point: string,
    public access: string,
    public host_paths: Dictionary<HostPath>
  ) {}
}
export class HostPath {
  constructor(
    public volume_host_path_id: string,
    public mid: string,
    public host_path: string
  ) {}
}

export class Station {
  constructor(
    public id: string,
    public owner: string[],
    public admins: string[],
    public name: string,
    public description: string,
    public invited_list: string[],
    public pending_list: string[],
    public creation_timestamp: string,
    public updated_timestamp: string,
    public members?: string[],
    public machines?: string[],
    public volumes?: Volume[],
    public user_count?: string,
    public mid_count?: string,
    public volume_count?: string
  ) {}
}

export class StationInput {
  stationName?: string;
  stationNameError?: boolean;
  description?: string;
  descriptionError?: boolean;
  charsLeft?: number;
  nameCharsLeft?: number;
  volumeScreen?: boolean;
  helpMode?: boolean;
  context?: string;
  mountPathErrors?: number[];
  volumes?: Volume[];
}

export class EditStationParams {
  constructor(public name: string, public description: string) {}
}
