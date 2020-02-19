import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../../data/interfaces/IUserRepository';
import { Logger } from '../../components/Logger';
import { User, UserFilterOptions } from '../../business/objects/user';

import store from '../../store/store';
import { receiveCurrentUser, receiveUsers, receiveSearchedUsers, receiveStationInvites } from '../../actions/userActions';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import { Machine, GetMachinesFilter } from '../objects/machine';
import { receiveMachines } from '../../actions/machineActions';
import { Station } from '../objects/station';
import { receiveStations } from '../../actions/stationActions';
import { openNotificationModal } from '../../actions/modalActions';

export class UserService implements IUserService {
  constructor(
    protected userRepository: IUserRepository,
    protected logService: Logger,
    protected machineRepository: IMachineRepository){

  }
  getCurrentUser(){
    return this.userRepository.getCurrentUser()
      .then((current_user: User) => {
        store.dispatch(receiveCurrentUser(current_user));
        if(current_user.mids.length > 0){
          return this.machineRepository.getMachines(new GetMachinesFilter(current_user.mids))
            .then((machines: Machine[]) => {
              store.dispatch(receiveMachines(machines));
            })
        }
      })
      .catch((err:Error) => {
        store.dispatch(openNotificationModal('Notifications', err.message))
      })
  }
  getUsers(filterOptions:UserFilterOptions, extraFunction?: Function){
    return this.userRepository.getUsers(filterOptions)
      .then((user_list: User[]) => {
        store.dispatch(receiveUsers(user_list));
        if(extraFunction){
          extraFunction();
        }
      })
  }
  searchByUsername(filterOptions:UserFilterOptions){
    return this.userRepository.getUsers(filterOptions)
      .then((user_list:User[]) => {
        store.dispatch(receiveSearchedUsers(user_list));
      })
  }
  getStationInvites(){
    return this.userRepository.getStationInvites()
      .then((stations: Station[]) => {
        let station_ids:string[] = [];
        stations.forEach(station => {
          station_ids.push(station.id);
        })
        store.dispatch(receiveStations(stations));
        store.dispatch(receiveStationInvites(station_ids));
      })
  }
}
