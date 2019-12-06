import { Action } from 'redux';
import { IMachine } from '../business/objects/machine';

export const RECEIVE_MACHINE = "RECEIVE_MACHINE";
export type RECEIVE_MACHINE = typeof RECEIVE_MACHINE;

export const RECEIVE_CURRENT_USER_MACHINES = "RECEIVE_CURRENT_USER_MACHINES";
export type RECEIVE_CURRENT_USER_MACHINES = typeof RECEIVE_CURRENT_USER_MACHINES;


export interface IReceiveMachine extends Action {
  type: RECEIVE_MACHINE;
  machine: IMachine;
}

export interface IReceiveCurrentUserMachines extends Action {
  type: RECEIVE_CURRENT_USER_MACHINES;
  machines: IMachine[];
}

export type MachineActions = IReceiveMachine | IReceiveCurrentUserMachines;

export const receiveMachine = (machine: IMachine): IReceiveMachine => {
  return { type: RECEIVE_MACHINE, machine }
}
export const receiveCurrentUserMachines = (machines: IMachine[]): IReceiveCurrentUserMachines => {
  return { type: RECEIVE_CURRENT_USER_MACHINES, machines };
}
