import { Dictionary } from "./dictionary";

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
  readonly creation_timestamp: string;
  readonly updated_timestamp: string;
  readonly user_count: string;
  readonly mid_count: string;
  readonly volume_count: string;
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

export enum StationsSortOptions {
  created = "Date Created",
  name = "Name",
  launchers = "# of Launchers",
  machines = "# of Machines",
  last_used = "Last Used"
}

export enum EStationSortBy {
  "Date Created" = "created",
  "Name" = "station_name",
  "# of Launchers" = "number_of_launchers",
  "# of Machines" = "number_of_machines",
  "Last Used" = "last_used"
}

export class StationFilters {
  constructor(
    public partial_names?: string[],
    public page?: number,
    public items?: number,
    public summary_view?: boolean,
    public stationids?: string[],
    public sort_by?: EStationSortBy[],
    public sort_order?: "asc" | "desc"
  ) {}
}
