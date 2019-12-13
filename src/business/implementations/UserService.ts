import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../../data/interfaces/IUserRepository';
import { Logger } from '../../components/Logger';
import { IUser } from '../../business/objects/user';

import store from '../../store/store';
import { receiveCurrentUser } from '../../actions/userActions';
import { IMachineService } from '../interfaces/IMachineService';

export class UserService implements IUserService {
  constructor(
    protected userRepository: IUserRepository,
    protected logService: Logger,
    protected machineService: IMachineService){

  }
  getCurrentUser(){
    this.userRepository.getCurrentUser()
      .then((current_user: IUser) => {
        store.dispatch(receiveCurrentUser(current_user));
        current_user.mids.forEach((mid:string) => {
          this.machineService.getMachine(mid);
        })
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
