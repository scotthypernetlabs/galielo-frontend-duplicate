import { Dictionary } from "../objects/dictionary";
import { EditStationParams, Station, Volume } from "../objects/station";
import { GetJobFilters, Job } from "../objects/job";
import { GetMachinesFilter, Machine } from "../objects/machine";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { IMachineRepository } from "../../data/interfaces/IMachineRepository";
import { IStationRepository } from "../../data/interfaces/IStationRepository";
import { IStationService } from "../interfaces/IStationService";
import { IUserRepository } from "../../data/interfaces/IUserRepository";
import { Logger } from "../../components/Logger";
import { StationFilters } from "../../api/objects/station";
import { User, UserFilterOptions } from "../objects/user";
import { closeModal, openNotificationModal } from "../../actions/modalActions";
import { receiveMachines } from "../../actions/machineActions";
import {
  receiveSearchedStations,
  receiveStation,
  receiveStationInput,
  receiveStations,
  removeStation
} from "../../actions/stationActions";
import { receiveStationJobs } from "../../actions/jobActions";
import { receiveUsers } from "../../actions/userActions";
import store from "../../store/store";

export class StationService implements IStationService {
  constructor(
    protected stationRepository: IStationRepository,
    protected machineRepository: IMachineRepository,
    protected userRepository: IUserRepository,
    protected jobRepository: IJobRepository,
    protected logService: Logger
  ) {}
  refreshStations(stations?: Station[], filter?: StationFilters) {
    if (stations) {
      console.log("loading up station", stations);
      store.dispatch(receiveStations(stations));
      return Promise.resolve<void>(null);
    } else {
      return this.stationRepository
        .getStations(filter)
        .then(async (stations: Station[]) => {
          await this.loadStationData(stations);
        })
        .catch((err: Error) => {
          this.logService.log(err);
        });
    }
  }
  async searchStationName(filters?: StationFilters) {
    const stations: Station[] = await this.stationRepository.getStations(
      filters
    );
    store.dispatch(receiveSearchedStations(stations));
  }
  async loadStationData(stations: Station[]) {
    const machinesList: Dictionary<boolean> = {};
    const usersList: Dictionary<boolean> = {};
    stations.forEach(station => {
      station.machines.forEach(mid => {
        machinesList[mid] = true;
      });
      station.members.forEach(user_id => {
        usersList[user_id] = true;
      });
    });
    if (Object.keys(machinesList).length > 0) {
      const machines: Machine[] = await this.machineRepository.getMachines(
        new GetMachinesFilter(Object.keys(machinesList))
      );
      store.dispatch(receiveMachines(machines));
    }
    const numUsers = Object.keys(usersList).length;
    const users_list = Object.keys(usersList);
    if (numUsers > 0) {
      for (let i = 0; i < numUsers; i += 25) {
        let end = i + 25;
        if (numUsers - i <= 25) {
          end = numUsers;
        }
        const users: User[] = await this.userRepository.getUsers(
          new UserFilterOptions(users_list.slice(i, end))
        );
        store.dispatch(receiveUsers(users));
      }
    }
    console.log("requesting stations", stations);
    store.dispatch(receiveStations(stations));
  }
  editStation(station_id: string, editParams: EditStationParams) {
    return this.stationRepository.editStation(station_id, editParams);
  }
  updateStation(station: Station) {
    store.dispatch(receiveStation(station));
  }
  removeStation(station_id: string) {
    store.dispatch(removeStation(station_id));
  }
  handleError(err: Error) {
    store.dispatch(
      openNotificationModal("Notifications", "An error has occurred")
    );
    // store.dispatch(openNotificationModal("Notifications", err.message));
  }
  createStation(
    name: string,
    description: string,
    invitee_list: string[],
    volumes: any[]
  ) {
    return this.stationRepository
      .createStation(name, description, invitee_list)
      .then((station_id: string) => {
        if (volumes.length > 0) {
          volumes.forEach(volume => {
            this.addVolume(
              station_id,
              volume.name,
              volume.mount_point,
              volume.access ? "rw" : "r"
            );
          });
        }
        // reset input values to default after creation
        store.dispatch(
          receiveStationInput({
            stationName: "",
            stationNameError: false,
            description: "",
            descriptionError: false,
            charsLeft: 200,
            volumeScreen: false,
            helpMode: false,
            mountPathErrors: [],
            context: "",
            volumes: []
          })
        );
        store.dispatch(closeModal());
      })
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  destroyStation(station_id: string) {
    return this.stationRepository
      .destroyStation(station_id)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  inviteUsersToStation(station_id: string, user_ids: string[]) {
    return this.stationRepository
      .inviteUsersToStation(station_id, user_ids)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  respondToStationInvite(station_id: string, response: boolean) {
    return this.stationRepository
      .respondToStationInvite(station_id, response)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  applyToStation(station_id: string) {
    return this.stationRepository
      .applyToStation(station_id)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  respondToStationApplication(
    station_id: string,
    user_id: string,
    response: boolean
  ) {
    return this.stationRepository
      .respondToStationApplication(station_id, user_id, response)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  leaveStation(station_id: string) {
    return this.stationRepository
      .leaveStation(station_id)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  expelUser(station_id: string, user_id: string) {
    return this.stationRepository
      .expelUser(station_id, user_id)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  addMachinesToStation(
    station_id: string,
    machine_ids: string[],
    volumes?: any,
    data_root?: any
  ) {
    return this.stationRepository
      .addMachinesToStation(station_id, machine_ids, volumes, data_root)
      .then(() => {
        store.dispatch(closeModal());
      })
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  removeMachinesFromStation(station_id: string, machine_ids: string[]) {
    return this.stationRepository
      .removeMachinesFromStation(station_id, machine_ids)
      .then(() => {
        store.dispatch(closeModal());
      })
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  addVolume(
    station_id: string,
    name: string,
    mount_point: string,
    access: string
  ) {
    return this.stationRepository
      .addVolume(station_id, name, mount_point, access)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  removeVolume(station_id: string, volumeid: string) {
    return this.stationRepository
      .removeVolume(station_id, volumeid)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  getJobsByStationId(station_id: string) {
    return this.jobRepository
      .getJobs(new GetJobFilters(null, null, null, [station_id]))
      .then((jobs: Job[]) => {
        store.dispatch(receiveStationJobs(station_id, jobs));
      })
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
  async modifyHostPath(
    station_id: string,
    volume: Volume,
    mid: string,
    host_path: string
  ) {
    this.logService.log(
      `Modify host path station_id=${station_id}, mid=${mid}, host_path=${host_path}`,
      volume
    );
    if (volume.host_paths[mid]) {
      try {
        const boolean = await this.stationRepository.removeHostPath(
          station_id,
          volume.volume_id,
          volume.host_paths[mid].volume_host_path_id
        );
        return this.stationRepository.addHostPath(
          station_id,
          volume.volume_id,
          mid,
          host_path
        );
      } catch (err) {
        this.handleError(err);
      }
    } else {
      try {
        return this.stationRepository.addHostPath(
          station_id,
          volume.volume_id,
          mid,
          host_path
        );
      } catch (err_2) {
        this.handleError(err_2);
      }
    }
  }
}
