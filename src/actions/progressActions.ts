import { Action } from "redux";
import { UploadObjectContainer } from "../business/objects/job";

export const UPLOAD_STATION_PROGRESS_UPDATE = "UPLOAD_STATION_PROGRESS_UPDATE";
export type UPLOAD_STATION_PROGRESS_UPDATE = typeof UPLOAD_STATION_PROGRESS_UPDATE;

export const UPLOAD_MACHINE_PROGRESS_UPDATE = "UPLOAD_MACHINE_PROGRESS_UPDATE";
export type UPLOAD_MACHINE_PROGRESS_UPDATE = typeof UPLOAD_MACHINE_PROGRESS_UPDATE;

export const DELETE_MACHINE_PROGRESS = "DELETE_MACHINE_PROGRESS";
export type DELETE_MACHINE_PROGRESS = typeof DELETE_MACHINE_PROGRESS;

export const DELETE_STATION_PROGRESS = "DELETE_STATION_PROGRESS";
export type DELETE_STATION_PROGRESS = typeof DELETE_STATION_PROGRESS;

export interface IReceiveStationUploadProgress extends Action {
  type: UPLOAD_STATION_PROGRESS_UPDATE;
  uploadProgress: UploadObjectContainer;
}

export interface IReceiveMachineUploadProgress extends Action {
  type: UPLOAD_MACHINE_PROGRESS_UPDATE;
  uploadProgress: UploadObjectContainer;
}

export interface IDeleteMachineProgress extends Action {
  type: DELETE_MACHINE_PROGRESS;
  mid: string;
}

export interface IDeleteStationProgress extends Action {
  type: DELETE_STATION_PROGRESS;
  station_id: string;
}

export type ProgressActions =
  | IReceiveStationUploadProgress
  | IReceiveMachineUploadProgress
  | IDeleteMachineProgress
  | IDeleteStationProgress;

export const updateStationUploadProgress = (
  container: UploadObjectContainer
) => {
  return { type: UPLOAD_STATION_PROGRESS_UPDATE, uploadProgress: container };
};

export const updateMachineUploadProgress = (
  container: UploadObjectContainer
) => {
  return { type: UPLOAD_MACHINE_PROGRESS_UPDATE, uploadProgress: container };
};

export const deleteMachineProgress = (mid: string) => {
  return { type: DELETE_MACHINE_PROGRESS, mid };
};

export const deleteStationProgress = (station_id: string) => {
  return { type: DELETE_STATION_PROGRESS, station_id };
};
