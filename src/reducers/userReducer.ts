import { Reducer } from 'redux';
import { UserActions, RECEIVE_CURRENT_USER, RECEIVE_USERS, RECEIVE_SEARCHED_USERS } from '../actions/userActions';
import { User } from '../business/objects/user';
import { IUserState } from '../business/objects/store';
import { Dictionary } from '../business/objects/dictionary';

class UserState implements IUserState {
  constructor(
    public currentUser: User = {username: 'Demo', user_id: 'meme', mids:[], wallets: []},
    public users: Dictionary<User> = {},
    public searchedUsers: User[] = []){

    }
}

const usersReducer: Reducer<UserState, UserActions> = (state = new UserState(), action:UserActions) => {
  switch(action.type){
    case RECEIVE_CURRENT_USER:
      return new UserState(action.currentUser as User);
    case RECEIVE_USERS:
      let usersObject:Dictionary<User> = {};
      action.users.forEach(user => {
        usersObject[user.user_id] = user;
      })
      return Object.assign({}, state, {users: Object.assign({}, state.users, usersObject)});
    case RECEIVE_SEARCHED_USERS:
      return Object.assign({}, state, { searchedUsers: action.users });
    default:
      return state;
  }
}

export default usersReducer;
