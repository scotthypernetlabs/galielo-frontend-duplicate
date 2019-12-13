import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../../data/interfaces/IUserRepository';
import { Logger } from '../../components/Logger';
import { IUser } from '../../business/objects/user';

import store from '../../store/store';
import { receiveCurrentUser } from '../../actions/userActions';

export class UserService implements IUserService {
  constructor(
    protected userRepository: IUserRepository,
    protected logService: Logger){

  }
  getCurrentUser(){
    this.userRepository.getCurrentUser()
      .then((current_user: IUser) => {
        store.dispatch(receiveCurrentUser(current_user));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
