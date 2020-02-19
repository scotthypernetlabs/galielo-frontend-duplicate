import {Reducer} from 'redux';
import {
  MachineActions,
  RECEIVE_CURRENT_USER_MACHINES,
  RECEIVE_MACHINE,
  RECEIVE_MACHINES,
  UPDATE_MACHINE_STATUS,
} from '../actions/machineActions';
import {Machine} from '../business/objects/machine';
import {Dictionary} from '../business/objects/dictionary';
import {IMachineState} from '../business/objects/store';

class MachineState implements IMachineState {
  constructor(
    public machines: Dictionary<Machine> = {},
    public currentUserMachines: Machine[] = [],
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
    case UPDATE_MACHINE_STATUS:
      let updatedMachine = Object.assign({}, state.machines[action.mid]);
      updatedMachine.status = action.status;
      return Object.assign({}, state, {
        machines: Object.assign({}, state.machines, {[action.mid]: Object.assign({}, updatedMachine)})
      })
    default:
      return state;
  }
};

export default machinesReducer;
