import { Action } from 'redux';
import { User } from '../business/objects/user';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export type RECEIVE_CURRENT_USER = typeof RECEIVE_CURRENT_USER;

export const RECEIVE_USERS = "RECEIVE_USERS";
export type RECEIVE_USERS = typeof RECEIVE_USERS;

export const RECEIVE_SEARCHED_USERS = "RECEIVE_SEARCHED_USERS";
export type RECEIVE_SEARCHED_USERS = typeof RECEIVE_SEARCHED_USERS;

export const RECEIVE_STATION_INVITES = "RECEIVE_STATION_INVITES";
export type RECEIVE_STATION_INVITES = typeof RECEIVE_STATION_INVITES;

export const RECEIVE_STATION_INVITE = "RECEIVE_STATION_INVITE";
export type RECEIVE_STATION_INVITE = typeof RECEIVE_STATION_INVITE;

export const REMOVE_STATION_INVITE = "REMOVE_STATION_INVITE";
export type REMOVE_STATION_INVITE = typeof REMOVE_STATION_INVITE;

export interface IReceiveCurrentUser extends Action {
  type: RECEIVE_CURRENT_USER;
  currentUser: User;
}

export interface IReceiveUsers extends Action {
  type: RECEIVE_USERS;
  users: User[];
}

export interface IReceiveSearchedUsers extends Action {
  type: RECEIVE_SEARCHED_USERS;
  users: User[];
}

export interface IReceiveStationInvites extends Action {
  type: RECEIVE_STATION_INVITES;
  station_ids: string[];
}

export interface IRemoveStationInvite extends Action {
  type: REMOVE_STATION_INVITE;
  station_id: string;
}

export interface IReceiveStationInvite extends Action {
  type: RECEIVE_STATION_INVITE;
  station_id: string;
}

export type UserActions = IReceiveCurrentUser | IReceiveUsers
| IReceiveSearchedUsers | IReceiveStationInvites | IRemoveStationInvite | IReceiveStationInvite;

export const receiveCurrentUser = (currentUser: User): IReceiveCurrentUser => {
  return { type: RECEIVE_CURRENT_USER, currentUser };
}

export const receiveUsers = (users: User[]): IReceiveUsers => {
  return { type: RECEIVE_USERS, users }
}

export const receiveSearchedUsers = (users: User[]):IReceiveSearchedUsers => {
  return { type: RECEIVE_SEARCHED_USERS, users }
}

export const receiveStationInvites = (station_ids: string[]):IReceiveStationInvites => {
  return { type: RECEIVE_STATION_INVITES, station_ids }
}

export const removeStationInvite = (station_id: string):IRemoveStationInvite => {
  return { type: REMOVE_STATION_INVITE, station_id }
}

export const receiveStationInvite = (station_id: string):IReceiveStationInvite => {
  return { type: RECEIVE_STATION_INVITE, station_id }
}
