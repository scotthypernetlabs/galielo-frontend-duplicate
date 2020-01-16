import { Reducer } from 'redux';
import { MachineActions, RECEIVE_MACHINE, RECEIVE_CURRENT_USER_MACHINES, RECEIVE_MACHINES } from '../actions/machineActions';
import { Machine } from '../business/objects/machine';
import { Dictionary } from '../business/objects/dictionary';
import { IMachineState } from '../business/objects/store';

class MachineState implements IMachineState {
  constructor(public machines: Dictionary<Machine> = {}){

  }
}

const machinesReducer: Reducer<MachineState, MachineActions> = (state = new MachineState(), action:MachineActions) => {
  switch(action.type){
    case RECEIVE_MACHINE:
      return Object.assign({}, state, {machines: Object.assign({}, state.machines, {[action.machine.mid]: action.machine })});
    case RECEIVE_MACHINES:
      let machinesObject:Dictionary<Machine> = {};
      action.machines.forEach(machine => {
        machinesObject[machine.mid] = machine;
      })
      return Object.assign({}, state, { machines: Object.assign({}, state.machines, machinesObject)})
    case RECEIVE_CURRENT_USER_MACHINES:
      return state;
    default:
      return state;
  }
}

export default machinesReducer;
