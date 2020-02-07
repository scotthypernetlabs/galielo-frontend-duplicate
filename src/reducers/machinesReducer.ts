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
  constructor(
    public machines: Dictionary<Machine> = {},
    public uploadProgress: Dictionary<Dictionary<number>> = {},
    public currentUserMachines: Machine[] = [],
    public progressTracker: Dictionary<number> = {}
    )
    {}
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
      return Object.assign({}, state, { currentUserMachines: action.machines })
    case UPLOAD_PROGRESS:
      const progressDictionary = {[action.mid]: {[action.filename]:action.progress}};
      if(action.progress === 100){
          let progress = (state.progressTracker[action.mid] !== undefined ? state.progressTracker[action.mid] : 1);
          let fileProgDict = state.uploadProgress[action.mid];
          if(fileProgDict){
            if(fileProgDict[action.filename] !== 100){
              progress += 1;
            }
          }
          return Object.assign({}, state, {
            uploadProgress: Object.assign({}, state.uploadProgress,progressDictionary),
            progressTracker: Object.assign({}, state.progressTracker,{[action.mid]: progress})
          });
      }
      return Object.assign({}, state, {
          uploadProgress: Object.assign({}, state.uploadProgress, progressDictionary)
        });
    case DELETE_PROGRESS:
      const newState = Object.assign({}, state);
      delete newState.uploadProgress[action.mid];
      delete newState.progressTracker[action.mid];
      return Object.assign({}, newState);
    default:
      return state;
  }
};

export default machinesReducer;
