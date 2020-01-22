import {Reducer} from 'redux';
import {
  DELETE_PROGRESS,
  MachineActions,
  RECEIVE_CURRENT_USER_MACHINES,
  RECEIVE_MACHINE,
  RECEIVE_MACHINES,
  UPLOAD_PROGRESS
} from '../actions/machineActions';
import {Machine} from '../business/objects/machine';
import {Dictionary} from '../business/objects/dictionary';
import {IMachineState} from '../business/objects/store';

class MachineState implements IMachineState {
  constructor(public machines: Dictionary<Machine> = {}, public uploadProgress: Dictionary<number> = {}) {}
}

const machinesReducer: Reducer<MachineState, MachineActions> = (state = new MachineState(), action:MachineActions) => {
  switch(action.type){
    case RECEIVE_MACHINE:
      return Object.assign({}, state, {machines: Object.assign({}, state.machines, {[action.machine.mid]: action.machine })});
    case RECEIVE_MACHINES:
      let machinesObject:Dictionary<Machine> = {};
      action.machines.forEach(machine => {
        machinesObject[machine.mid] = machine;
      });
      return Object.assign({}, state, { machines: Object.assign({}, state.machines, machinesObject)});
    case RECEIVE_CURRENT_USER_MACHINES:
      return state;
    case UPLOAD_PROGRESS:
      return Object.assign({}, state, Object.assign({}, state.uploadProgress, { uploadProgress: action.uploadProgress }));
    case DELETE_PROGRESS:
      const newState = Object.assign({}, state);
      delete newState.uploadProgress[action.mid];
      return newState;
    default:
      return state;
  }
};

export default machinesReducer;
