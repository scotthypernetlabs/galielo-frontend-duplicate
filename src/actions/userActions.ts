import { Action } from 'redux';
import { IUser } from '../business/objects/user';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export type RECEIVE_CURRENT_USER = typeof RECEIVE_CURRENT_USER;


export interface IReceiveCurrentUser extends Action {
  type: RECEIVE_CURRENT_USER;
  currentUser: IUser;
}

export type UserActions = IReceiveCurrentUser;

export const receiveCurrentUser = (currentUser: IUser): IReceiveCurrentUser => {
  return { type: RECEIVE_CURRENT_USER, currentUser };
}
