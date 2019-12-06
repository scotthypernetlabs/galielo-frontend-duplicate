import { Reducer } from 'redux';
import { UserActions, RECEIVE_CURRENT_USER } from '../actions/userActions';
import { IUserState, IUser } from '../business/objects/user';

class UserState implements IUserState {
  constructor(
    public currentUser: IUser = {username: 'Demo'}){

    }
}

const usersReducer: Reducer<UserState, UserActions> = (state = new UserState(), action:UserActions) => {
  switch(action.type){
    case RECEIVE_CURRENT_USER:
      return new UserState(action.currentUser as IUser);
    default:
      return state;
  }
}

export default usersReducer;
