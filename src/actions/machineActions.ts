import { Action } from 'redux';
import { Machine } from '../business/objects/machine';

export const RECEIVE_MACHINE = "RECEIVE_MACHINE";
export type RECEIVE_MACHINE = typeof RECEIVE_MACHINE;

export const RECEIVE_CURRENT_USER_MACHINES = "RECEIVE_CURRENT_USER_MACHINES";
export type RECEIVE_CURRENT_USER_MACHINES = typeof RECEIVE_CURRENT_USER_MACHINES;


export interface IReceiveMachine extends Action {
  type: RECEIVE_MACHINE;
  machine: Machine;
}

export interface IReceiveCurrentUserMachines extends Action {
  type: RECEIVE_CURRENT_USER_MACHINES;
  machines: Machine[];
}

export type MachineActions = IReceiveMachine | IReceiveCurrentUserMachines;

export const receiveMachine = (machine: Machine): IReceiveMachine => {
  return { type: RECEIVE_MACHINE, machine }
}
export const receiveCurrentUserMachines = (machines: Machine[]): IReceiveCurrentUserMachines => {
  return { type: RECEIVE_CURRENT_USER_MACHINES, machines };
}
