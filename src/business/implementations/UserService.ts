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
    return this.userRepository.getCurrentUser()
      .then((current_user: IUser) => {
        store.dispatch(receiveCurrentUser(current_user));
        return this.machineRepository.getMachines(current_user.mids)
          .then((machines: IMachine[]) => {
            machines.forEach(machine => {
              store.dispatch(receiveMachine(machine));
            })
          })
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
