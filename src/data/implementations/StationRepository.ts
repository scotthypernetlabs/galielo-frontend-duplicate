import { Dictionary } from "../../business/objects/dictionary";
import { GetJobFilters } from "../../business/objects/job";
import { HostPath, Station, Volume } from "../../business/objects/station";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { IStation, IVolume, StationFilters } from "../../api/objects/station";
import { IStationRepository } from "../interfaces/IStationRepository";

interface ICreateStationResponse {
  station: IStation;
}
interface IGetStationResponse {
  stations: IStation[];
}

const generateStationUrl = (
  backend_url: string,
  filterOptions?: StationFilters
) => {
  const baseUrl = `${backend_url}/stations`;
  if (filterOptions == undefined) {
    return baseUrl;
  }
  const json = JSON.parse(JSON.stringify(filterOptions));
  let appendedUrl: string = "?";
  Object.keys(json).forEach((key: keyof StationFilters) => {
    if (json[key] == null) return;
    if (appendedUrl[appendedUrl.length - 1] != "?") {
      appendedUrl += "&";
    }
    switch (key) {
      case "page":
        appendedUrl += `${key}=${filterOptions[key]}`;
        break;
      case "items":
        appendedUrl += `${key}=${filterOptions[key]}`;
        break;
      default:
        // handles all instances where the key is a string[]
        filterOptions[key].forEach((value, idx) => {
          if (idx > 0) {
            appendedUrl += "&";
          }
          appendedUrl += `${key}=${value}`;
        });
        break;
    }
  });

  if (appendedUrl.length > 1) {
    return baseUrl + appendedUrl;
  }
  return baseUrl;
};

export function convertToBusinessVolume(volume: IVolume) {
  const hostPathsObject: Dictionary<HostPath> = {};
  const hostPaths: HostPath[] = volume.host_paths.map(host_path => {
    const hostPath = new HostPath(
      host_path.volumehostpathid,
      host_path.mid,
      host_path.host_path
    );
    hostPathsObject[host_path.mid] = hostPath;
    return hostPath;
  });
  return new Volume(
    volume.volumeid,
    volume.stationid,
    volume.name,
    volume.mount_point,
    volume.access,
    hostPathsObject
  );
}
export function convertToBusinessStation(station: IStation) {
  const owner: string[] = [];
  const admin_list: string[] = [];
  const members_list: string[] = [];
  const volumes: Volume[] = station.volumes.map(volume => {
    return convertToBusinessVolume(volume);
  });
  const invited_list: string[] = [];
  const pending_list: string[] = [];
  station.users.forEach(station_user => {
    if (station_user.status.toUpperCase() === "INVITED") {
      invited_list.push(station_user.userid);
    }
    if (station_user.status.toUpperCase() === "OWNER") {
      owner.push(station_user.userid);
      members_list.push(station_user.userid);
      admin_list.push(station_user.userid);
    }
    if (station_user.status.toUpperCase() === "ADMIN") {
      admin_list.push(station_user.userid);
      members_list.push(station_user.userid);
    }
    if (station_user.status.toUpperCase() === "MEMBER") {
      members_list.push(station_user.userid);
    }
    if (station_user.status.toUpperCase() === "PENDING") {
      members_list.push(station_user.userid);
    }
  });
  return new Station(
    station.stationid,
    owner,
    admin_list,
    members_list,
    station.name,
    station.description,
    station.mids,
    volumes,
    invited_list,
    pending_list,
    station.creation_timestamp,
    station.updated_timestamp
  );
}
export class StationRepository implements IStationRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }
  async getStations(filter?: StationFilters) {
    const url = generateStationUrl(this.backend, filter);
    console.log("url", url);
    const response: IGetStationResponse = await this.requestRepository.requestWithAuth(
      url,
      "GET"
    );
    return response.stations.map(station => {
      return convertToBusinessStation(station);
    });
  }
  getStationJobs(group_id: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/jobs/running/${group_id}`,
      "GET"
    );
  }
  async createStation(
    name: string,
    description: string,
    invitee_list: string[]
  ): Promise<string> {
    const response: ICreateStationResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/station`,
      "POST",
      { name, description, usernames: invitee_list }
    );
    return convertToBusinessStation(response.station).id;
  }
  async editStation(
    station_id: string,
    options: { name?: string; description?: string }
  ) {
    const response: {
      station: IStation;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}`,
      "PUT",
      options
    );
    return convertToBusinessStation(response.station);
  }
  destroyStation(station_id: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}`,
      "DELETE"
    );
  }
  inviteUsersToStation(station_id: string, user_ids: string[]) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/users/invite`,
      "POST",
      { userids: user_ids }
    );
  }
  respondToStationInvite(station_id: string, response: boolean) {
    // positive response
    if (response) {
      return this.requestRepository.requestWithAuth(
        `${this.backend}/station/${station_id}/users/accept`,
        "PUT"
      );
    } else {
      return this.requestRepository.requestWithAuth(
        `${this.backend}/station/${station_id}/users/reject`,
        "PUT"
      );
    }
  }
  applyToStation(station_id: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/users`,
      "POST"
    );
  }
  respondToStationApplication(
    station_id: string,
    user_id: string,
    response: boolean
  ) {
    if (response) {
      return this.requestRepository.requestWithAuth(
        `${this.backend}/station/${station_id}/users/approve`,
        "PUT",
        { station_id, userid: user_id }
      );
    } else {
      return this.requestRepository.requestWithAuth(
        `${this.backend}/station/${station_id}/users/reject`,
        "PUT",
        { station_id, userid: user_id }
      );
    }
  }
  leaveStation(station_id: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/user/withdraw`,
      "PUT"
    );
  }
  expelUser(station_id: string, user_id: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/user/${user_id}/delete`,
      "DELETE"
    );
  }
  addMachinesToStation(
    station_id: string,
    machine_ids: string[],
    volumes?: any,
    data_root?: any
  ) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/machines`,
      "POST",
      { mids: machine_ids }
    );
  }
  removeMachinesFromStation(station_id: string, machine_ids: string[]) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/machines`,
      "DELETE",
      { mids: machine_ids }
    );
  }
  updateMachineInGroup(
    station_id: string,
    machine_id: string,
    volume_details: string
  ) {
    // this.socket.emit('station_machine_update', station_id, machine_id, volume_details);
  }
  removeVolume(station_id: string, volumeid: string) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/volumes/${volumeid}`,
      "DELETE"
    );
  }
  addVolume(
    station_id: string,
    name: string,
    mount_point: string,
    access: string
  ) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/volumes`,
      "POST",
      { name, mount_point, access }
    );
  }
  async addHostPath(
    station_id: string,
    volume_id: string,
    mid: string,
    host_path: string
  ) {
    const response: {
      volume: IVolume;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/volumes/${volume_id}/host_paths`,
      "POST",
      { mid, host_path }
    );
    return convertToBusinessVolume(response.volume);
  }
  removeHostPath(
    station_id: string,
    volume_id: string,
    volume_host_path_id: string
  ) {
    return this.requestRepository.requestWithAuth(
      `${this.backend}/station/${station_id}/volumes/${volume_id}/host_paths/${volume_host_path_id}`,
      "DELETE"
    );
  }
}
