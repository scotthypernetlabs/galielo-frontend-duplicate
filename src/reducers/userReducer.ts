import { Dictionary } from "../business/objects/dictionary";
import { IUserState } from "../business/objects/store";
import {
  RECEIVE_CURRENT_USER,
  RECEIVE_SEARCHED_USERS,
  RECEIVE_STATION_INVITE,
  RECEIVE_STATION_INVITES,
  RECEIVE_USERS,
  REMOVE_STATION_INVITE,
  UPDATE_CURRENT_USER,
  UserActions
} from "../actions/userActions";
import { Reducer } from "redux";
import { User } from "../business/objects/user";

class UserState implements IUserState {
  constructor(
    public currentUser: User = {
      username: "Demo",
      user_id: "meme",
      mids: [],
      wallets: []
    },
    public users: Dictionary<User> = {},
    public searchedUsers: User[] = [],
    public receivedStationInvites: string[] = []
  ) {}
}

const usersReducer: Reducer<UserState, UserActions> = (
  state = new UserState(),
  action: UserActions
) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return Object.assign({}, state, { currentUser: action.currentUser });
    case RECEIVE_USERS:
      const usersObject: Dictionary<User> = {};
      action.users.forEach(user => {
        usersObject[user.user_id] = user;
      });
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, usersObject)
      });
    case RECEIVE_SEARCHED_USERS:
      return Object.assign({}, state, { searchedUsers: action.users });
    case RECEIVE_STATION_INVITES:
      return Object.assign({}, state, {
        receivedStationInvites: action.station_ids
      });
    case REMOVE_STATION_INVITE:
      let updateInviteList = [...state.receivedStationInvites];
      updateInviteList = updateInviteList.filter(
        station_id => station_id !== action.station_id
      );
      return Object.assign({}, state, {
        receivedStationInvites: updateInviteList
      });
    case RECEIVE_STATION_INVITE:
      const updatedInvitesArray: string[] = [...state.receivedStationInvites];
      updatedInvitesArray.push(action.station_id);
      return Object.assign({}, state, {
        receivedStationInvites: updatedInvitesArray
      });
    case UPDATE_CURRENT_USER:
      const updateCurrentUser = Object.assign({}, state.currentUser);
      switch (action.key) {
        case "mids":
          updateCurrentUser.mids.push(action.value.mid);
          break;
        default:
          break;
      }
      return Object.assign({}, state, { currentUser: updateCurrentUser });
    default:
      return state;
  }
};

export default usersReducer;
