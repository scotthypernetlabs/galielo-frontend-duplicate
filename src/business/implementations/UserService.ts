import { IUserRepository } from "../../data/interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";
import { Logger } from "../../components/Logger";
import { User, UserFilterOptions } from "../../business/objects/user";

import { Dictionary } from "../../api/objects/dictionary";
import { GetMachinesFilter, Machine } from "../objects/machine";
import { IMachineRepository } from "../../data/interfaces/IMachineRepository";
import { Station } from "../objects/station";
import { openNotificationModal } from "../../actions/modalActions";
import {
  receiveCurrentUser,
  receiveSearchedUsers,
  receiveStationInvites,
  receiveUsers
} from "../../actions/userActions";
import { receiveMachines } from "../../actions/machineActions";
import { receiveStations } from "../../actions/stationActions";
import store from "../../store/store";

export class UserService implements IUserService {
  constructor(
    protected userRepository: IUserRepository,
    protected logService: Logger,
    protected machineRepository: IMachineRepository
  ) {}
  getCurrentUser() {
    return this.userRepository
      .getCurrentUser()
      .then((current_user: User) => {
        store.dispatch(receiveCurrentUser(current_user));
        if (current_user.mids.length > 0) {
          return this.machineRepository
            .getMachines(new GetMachinesFilter(current_user.mids))
            .then((machines: Machine[]) => {
              store.dispatch(receiveMachines(machines));
            });
        }
      })
      .catch((err: Error) => {
        store.dispatch(openNotificationModal("Notifications", err.message));
      });
  }
  getUsers(filterOptions: UserFilterOptions, extraFunction?: Function) {
    return this.userRepository
      .getUsers(filterOptions)
      .then((user_list: User[]) => {
        store.dispatch(receiveUsers(user_list));
        if (extraFunction) {
          extraFunction();
        }
      });
  }
  searchByUsername(filterOptions: UserFilterOptions) {
    return this.userRepository
      .getUsers(filterOptions)
      .then((user_list: User[]) => {
        store.dispatch(receiveSearchedUsers(user_list));
      });
  }
  getStationInvites() {
    return this.userRepository
      .getStationInvites()
      .then(async (stations: Station[]) => {
        const station_ids: string[] = [];
        const machinesList: Dictionary<boolean> = {};
        const usersList: Dictionary<boolean> = {};
        stations.forEach(station => {
          station_ids.push(station.id);
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
        if (Object.keys(usersList).length > 0) {
          const users: User[] = await this.userRepository.getUsers(
            new UserFilterOptions(Object.keys(usersList))
          );
          store.dispatch(receiveUsers(users));
        }
        console.log("receive stations in users", stations);
        store.dispatch(receiveStations(stations));
        store.dispatch(receiveStationInvites(station_ids));
      });
  }
}
