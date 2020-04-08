import { Action } from "redux";
import { Machine } from "../business/objects/machine";
import { Simulate } from "react-dom/test-utils";
import progress = Simulate.progress;
import { Dictionary } from "../api/objects/dictionary";

export const RECEIVE_MACHINE = "RECEIVE_MACHINE";
export type RECEIVE_MACHINE = typeof RECEIVE_MACHINE;

export const RECEIVE_MACHINES = "RECEIVE_MACHINES";
export type RECEIVE_MACHINES = typeof RECEIVE_MACHINES;

export const RECEIVE_CURRENT_USER_MACHINES = "RECEIVE_CURRENT_USER_MACHINES";
export type RECEIVE_CURRENT_USER_MACHINES = typeof RECEIVE_CURRENT_USER_MACHINES;

export const UPDATE_MACHINE_STATUS = "UPDATE_MACHINE_STATUS";
export type UPDATE_MACHINE_STATUS = typeof UPDATE_MACHINE_STATUS;

export const RECEIVE_SEARCHED_MACHINES = "RECEIVE_SEARCHED_MACHINES";
export type RECEIVE_SEARCHED_MACHINES = typeof RECEIVE_SEARCHED_MACHINES;

export interface IReceiveMachine extends Action {
  type: RECEIVE_MACHINE;
  machine: Machine;
}

export interface IReceiveCurrentUserMachines extends Action {
  type: RECEIVE_CURRENT_USER_MACHINES;
  machines: Machine[];
}

export interface IReceiveMachines extends Action {
  type: RECEIVE_MACHINES;
  machines: Machine[];
}

export interface IReceiveSearchedMachines extends Action {
  type: RECEIVE_SEARCHED_MACHINES;
  machines: Machine[];
}

export interface IUpdateMachineStatus extends Action {
  type: UPDATE_MACHINE_STATUS;
  mid: string;
  status: string;
}

export type MachineActions =
  | IReceiveMachine
  | IReceiveCurrentUserMachines
  | IReceiveMachines
  | IUpdateMachineStatus
  | IReceiveSearchedMachines;

export const receiveMachine = (machine: Machine): IReceiveMachine => {
  return { type: RECEIVE_MACHINE, machine };
};

export const receiveMachines = (machines: Machine[]): IReceiveMachines => {
  return { type: RECEIVE_MACHINES, machines };
};

export const receiveCurrentUserMachines = (
  machines: Machine[]
): IReceiveCurrentUserMachines => {
  return { type: RECEIVE_CURRENT_USER_MACHINES, machines };
};

export const receiveSearchedMachines = (
  machines: Machine[]
): IReceiveSearchedMachines => {
  return { type: RECEIVE_SEARCHED_MACHINES, machines };
};

export const updateMachineStatus = (mid: string, status: string) => {
  return { type: UPDATE_MACHINE_STATUS, mid, status };
};
