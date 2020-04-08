import { Dictionary } from "../business/objects/dictionary";
import { IMachineState } from "../business/objects/store";
import { Machine } from "../business/objects/machine";
import {
  MachineActions,
  RECEIVE_CURRENT_USER_MACHINES,
  RECEIVE_MACHINE,
  RECEIVE_MACHINES,
  RECEIVE_SEARCHED_MACHINES,
  UPDATE_MACHINE_STATUS
} from "../actions/machineActions";
import { Reducer } from "redux";

class MachineState implements IMachineState {
  constructor(
    public machines: Dictionary<Machine> = {},
    public currentUserMachines: Machine[] = [],
    public searchedMachines: Machine[] = []
  ) {}
}

const machinesReducer: Reducer<MachineState, MachineActions> = (
  state = new MachineState(),
  action: MachineActions
) => {
  switch (action.type) {
    case RECEIVE_MACHINE:
      return Object.assign({}, state, {
        machines: Object.assign({}, state.machines, {
          [action.machine.mid]: action.machine
        })
      });
    case RECEIVE_MACHINES:
      const machinesObject: Dictionary<Machine> = {};
      action.machines.forEach(machine => {
        machinesObject[machine.mid] = machine;
      });
      return Object.assign({}, state, {
        machines: Object.assign({}, state.machines, machinesObject)
      });
    case RECEIVE_CURRENT_USER_MACHINES:
      return Object.assign({}, state, { currentUserMachines: action.machines });
    case UPDATE_MACHINE_STATUS:
      const updatedMachine = Object.assign({}, state.machines[action.mid]);
      updatedMachine.status = action.status;
      return Object.assign({}, state, {
        machines: Object.assign({}, state.machines, {
          [action.mid]: Object.assign({}, updatedMachine)
        })
      });
    case RECEIVE_SEARCHED_MACHINES:
      return Object.assign({}, state, { searchedMachines: action.machines });
    default:
      return state;
  }
};

export default machinesReducer;
