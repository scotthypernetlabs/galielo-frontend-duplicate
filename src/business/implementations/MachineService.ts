import { IMachineService } from '../interfaces/IMachineService';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import { IMachine } from '../objects/machine';
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
    this.machineRepository.getMachine(mid)
      .then((machine: IMachine) => {
        console.log(machine);
        store.dispatch(receiveMachine(machine));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
