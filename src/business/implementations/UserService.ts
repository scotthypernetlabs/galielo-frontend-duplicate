import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../../data/interfaces/IUserRepository';
import { Logger } from '../../components/Logger';
import { IUser } from '../../business/objects/user';

import store from '../../store/store';
import { receiveCurrentUser } from '../../actions/userActions';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import { IMachine } from '../objects/machine';
import { receiveMachine } from '../../actions/machineActions';

export class UserService implements IUserService {
  constructor(
    protected userRepository: IUserRepository,
    protected logService: Logger,
    protected machineRepository: IMachineRepository){

  }
  getCurrentUser(){
    this.userRepository.getCurrentUser()
      .then((current_user: IUser) => {
        store.dispatch(receiveCurrentUser(current_user));
        current_user.mids.forEach((mid:string) => {
          this.machineRepository.getMachine(mid)
            .then((machine: IMachine) => {
              store.dispatch(receiveMachine(machine));
            })
            .catch((err: Error) => {
              this.logService.log(err);
            })
        })
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
