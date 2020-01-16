import { Action } from 'redux';
import { User } from '../business/objects/user';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export type RECEIVE_CURRENT_USER = typeof RECEIVE_CURRENT_USER;


export interface IReceiveCurrentUser extends Action {
  type: RECEIVE_CURRENT_USER;
  currentUser: User;
}

export type UserActions = IReceiveCurrentUser;

export const receiveCurrentUser = (currentUser: User): IReceiveCurrentUser => {
  return { type: RECEIVE_CURRENT_USER, currentUser };
}
