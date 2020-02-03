import { Action } from 'redux';
import { Machine } from '../business/objects/machine';
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;
import {Dictionary} from "../api/objects/dictionary";

export const RECEIVE_MACHINE = "RECEIVE_MACHINE";
export type RECEIVE_MACHINE = typeof RECEIVE_MACHINE;

export const RECEIVE_MACHINES = "RECEIVE_MACHINES";
export type RECEIVE_MACHINES = typeof RECEIVE_MACHINES;

export const RECEIVE_CURRENT_USER_MACHINES = "RECEIVE_CURRENT_USER_MACHINES";
export type RECEIVE_CURRENT_USER_MACHINES = typeof RECEIVE_CURRENT_USER_MACHINES;

export const UPLOAD_PROGRESS = "UPLOAD_PROGRESS";
export type UPLOAD_PROGRESS = typeof UPLOAD_PROGRESS;

export const DELETE_PROGRESS = "DELETE_PROGRESS";
export type DELETE_PROGRESS = typeof DELETE_PROGRESS;


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

export interface IUploadProgress extends Action {
  type: UPLOAD_PROGRESS;
  mid: string;
  filename: string;
  progress: number;
}

export interface IDeleteProgress extends Action {
  type: DELETE_PROGRESS;
  mid: string;
}

export type MachineActions = IReceiveMachine | IReceiveCurrentUserMachines | IReceiveMachines | IUploadProgress | IDeleteProgress;

export const receiveMachine = (machine: Machine): IReceiveMachine => {
  return { type: RECEIVE_MACHINE, machine }
}

export const receiveMachines = (machines: Machine[]): IReceiveMachines => {
  return { type: RECEIVE_MACHINES, machines }
}

export const receiveCurrentUserMachines = (machines: Machine[]): IReceiveCurrentUserMachines => {
  return { type: RECEIVE_CURRENT_USER_MACHINES, machines };
}

export const updateUploadProgress = (mid: string, filename: string, progress: number): IUploadProgress => {
  return { type: UPLOAD_PROGRESS, mid, filename, progress}
};

export const deleteProgress = (mid: string): IDeleteProgress => {
  return { type: DELETE_PROGRESS, mid}
};
