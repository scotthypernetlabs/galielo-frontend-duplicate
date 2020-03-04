import { IMachineService } from '../interfaces/IMachineService';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import { Machine, GetMachinesFilter } from '../objects/machine';
import store from '../../store/store';
import { receiveMachine, receiveMachines } from '../../actions/machineActions';
import { Logger } from '../../components/Logger';

export class MachineService implements IMachineService {
  constructor(
    protected machineRepository: IMachineRepository,
    protected logService: Logger
  ){

  }
  getMachine(mid: string){
    return this.machineRepository.getMachine(mid)
      .then((machine: Machine) => {
        store.dispatch(receiveMachine(machine));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
  getMachines(filterOptions?: GetMachinesFilter){
    return this.machineRepository.getMachines(filterOptions)
      .then((machines: Machine[]) => {
        store.dispatch(receiveMachines(machines));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
  modifyMachineQueueLimit(mid: string, running_job_limit: number){
    return this.machineRepository.modifyMachineQueueLimit(mid, running_job_limit)
      .then((machine: Machine) => {
        store.dispatch(receiveMachine(machine));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
