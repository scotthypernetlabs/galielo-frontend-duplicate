import { IMachineService } from '../interfaces/IMachineService';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import { Machine } from '../objects/machine';
import store from '../../store/store';
import { receiveMachine } from '../../actions/machineActions';
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
}
