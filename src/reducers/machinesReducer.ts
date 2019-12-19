import { Reducer } from 'redux';
import { MachineActions, RECEIVE_MACHINE, RECEIVE_CURRENT_USER_MACHINES } from '../actions/machineActions';
import { IMachineState, IMachine } from '../business/objects/machine';
import { Dictionary } from '../business/objects/dictionary';

class MachineState implements IMachineState {
  constructor(public machines: Dictionary<IMachine> = {}){

  }
}

const machinesReducer: Reducer<MachineState, MachineActions> = (state = new MachineState(), action:MachineActions) => {
  switch(action.type){
    case RECEIVE_MACHINE:
      return Object.assign({}, state, {machines: Object.assign({}, state.machines, {[action.machine.mid]: action.machine })});
    case RECEIVE_CURRENT_USER_MACHINES:
      return state;
    default:
      return state;
  }
}

export default machinesReducer;
