import {
  DELETE_MACHINE_PROGRESS,
  DELETE_STATION_PROGRESS,
  ProgressActions,
  UPLOAD_MACHINE_PROGRESS_UPDATE,
  UPLOAD_STATION_PROGRESS_UPDATE
} from "../actions/progressActions";
import { Dictionary } from "../api/objects/dictionary";
import { IProgressState } from "../business/objects/store";
import { Reducer } from "redux";
import { UploadObjectContainer } from "../business/objects/job";

class ProgressState implements IProgressState {
  constructor(
    public stationUploads: Dictionary<UploadObjectContainer> = {},
    public machineUploads: Dictionary<UploadObjectContainer> = {}
  ) {}
}

const progressReducer: Reducer<ProgressState, ProgressActions> = (
  state = new ProgressState(),
  action: ProgressActions
) => {
  switch (action.type) {
    case UPLOAD_STATION_PROGRESS_UPDATE:
      return Object.assign({}, state, {
        stationUploads: Object.assign({}, state.stationUploads, {
          [action.uploadProgress.station_id]: Object.assign(
            {},
            action.uploadProgress
          )
        })
      });
    case UPLOAD_MACHINE_PROGRESS_UPDATE:
      const newState = Object.assign({}, state, {
        machineUploads: Object.assign({}, state.machineUploads, {
          [action.uploadProgress.machine_id]: Object.assign(
            {},
            action.uploadProgress
          )
        })
      });
      return newState;
    case DELETE_MACHINE_PROGRESS:
      const newMachineState = Object.assign({}, state);
      delete newMachineState.machineUploads[action.mid];
      return Object.assign({}, newMachineState);
    case DELETE_STATION_PROGRESS:
      const newStationState = Object.assign({}, state);
      delete newStationState.stationUploads[action.station_id];
      return Object.assign({}, newStationState);
    default:
      return state;
  }
};

export default progressReducer;
