import { Reducer } from 'redux';
import { UserActions, RECEIVE_CURRENT_USER, RECEIVE_USERS, RECEIVE_SEARCHED_USERS, RECEIVE_STATION_INVITES, REMOVE_STATION_INVITE } from '../actions/userActions';
import { User } from '../business/objects/user';
import { IUserState } from '../business/objects/store';
import { Dictionary } from '../business/objects/dictionary';

class UserState implements IUserState {
  constructor(
    public currentUser: User = {username: 'Demo', user_id: 'meme', mids:[], wallets: []},
    public users: Dictionary<User> = {},
    public searchedUsers: User[] = [],
    public receivedStationInvites: string[] = []){

    }
}

const usersReducer: Reducer<UserState, UserActions> = (state = new UserState(), action:UserActions) => {
  switch(action.type){
    case RECEIVE_CURRENT_USER:
      return Object.assign({}, state, action.currentUser);
    case RECEIVE_USERS:
      let usersObject:Dictionary<User> = {};
      action.users.forEach(user => {
        usersObject[user.user_id] = user;
      })
      return Object.assign({}, state, {users: Object.assign({}, state.users, usersObject)});
    case RECEIVE_SEARCHED_USERS:
      return Object.assign({}, state, { searchedUsers: action.users });
    case RECEIVE_STATION_INVITES:
      return Object.assign({}, state, { receivedStationInvites: action.station_ids })
    case REMOVE_STATION_INVITE:
      let updateInviteList = Object.assign({}, state).receivedStationInvites;
      updateInviteList.filter(station_id => station_id !== action.station_id);
      return Object.assign({}, state, { receivedStationInvites: updateInviteList});
    default:
      return state;
  }
}

export default usersReducer;
