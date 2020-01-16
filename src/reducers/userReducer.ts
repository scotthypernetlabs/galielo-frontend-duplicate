import { Reducer } from 'redux';
import { UserActions, RECEIVE_CURRENT_USER } from '../actions/userActions';
import { User } from '../business/objects/user';
import { IUserState } from '../business/objects/store';

class UserState implements IUserState {
  constructor(
    public currentUser: User = {username: 'Demo'}){

    }
}

const usersReducer: Reducer<UserState, UserActions> = (state = new UserState(), action:UserActions) => {
  switch(action.type){
    case RECEIVE_CURRENT_USER:
      return new UserState(action.currentUser as User);
    default:
      return state;
  }
}

export default usersReducer;
