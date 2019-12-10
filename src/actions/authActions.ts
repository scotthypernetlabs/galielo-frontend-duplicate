import { Action } from 'redux';

export const RECEIVE_AUTH = "RECEIVE_AUTH";
export type RECEIVE_AUTH = typeof RECEIVE_AUTH;

export interface IReceiveAuth extends Action {
  type: RECEIVE_AUTH;
  auth: any;
}

export type AuthActions = IReceiveAuth;

export const receiveAuth = (auth: any) => {
  return { type: RECEIVE_AUTH, auth };
}
