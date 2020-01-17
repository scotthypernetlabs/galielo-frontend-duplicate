import { Action } from 'redux';
import { User } from '../business/objects/user';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export type RECEIVE_CURRENT_USER = typeof RECEIVE_CURRENT_USER;

export const RECEIVE_USERS = "RECEIVE_USERS";
export type RECEIVE_USERS = typeof RECEIVE_USERS;


export interface IReceiveCurrentUser extends Action {
  type: RECEIVE_CURRENT_USER;
  currentUser: User;
}

export interface IReceiveUsers extends Action {
  type: RECEIVE_USERS;
  users: User[];
}

export type UserActions = IReceiveCurrentUser | IReceiveUsers;

export const receiveCurrentUser = (currentUser: User): IReceiveCurrentUser => {
  return { type: RECEIVE_CURRENT_USER, currentUser };
}

export const receiveUsers = (users: User[]): IReceiveUsers => {
  return { type: RECEIVE_USERS, users }
}
