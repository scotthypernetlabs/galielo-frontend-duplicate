import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../../data/interfaces/IUserRepository';
import { Logger } from '../../components/Logger';
import { User } from '../../business/objects/user';

import store from '../../store/store';
import { receiveCurrentUser, receiveUsers } from '../../actions/userActions';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import { Machine } from '../objects/machine';
import { receiveMachine } from '../../actions/machineActions';

export class UserService implements IUserService {
  constructor(
    protected userRepository: IUserRepository,
    protected logService: Logger,
    protected machineRepository: IMachineRepository){

  }
  getCurrentUser(){
    return this.userRepository.getCurrentUser()
      .then((current_user: User) => {
        console.log(current_user);
        store.dispatch(receiveCurrentUser(current_user));
        return this.machineRepository.getMachines(current_user.mids)
          .then((machines: Machine[]) => {
            machines.forEach(machine => {
              store.dispatch(receiveMachine(machine));
            })
          })
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
  getUsers(filterOptions:any){
    return this.userRepository.getUsers(filterOptions)
      .then((user_list: User[]) => {
        store.dispatch(receiveUsers(user_list));
      })
  }
}
