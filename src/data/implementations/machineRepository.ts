import { IMachineRepository } from '../interfaces/IMachineRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IMachine } from '../../business/objects/machine';

export class MachineRepository implements IMachineRepository {
  protected backend: string;

  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository) {
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }

  getMachine(mid: string) {
    return this.requestRepository.request(`${this.backend}/machines/${mid}`, 'GET')
      .then((response: IGetMachineResponse) => {
        return response.machine
      })
  }
  getMachines(mids: string[]){
    let machineArray:Promise<IMachine>[] = [];
    mids.forEach((mid) => {
      let machine = this.getMachine(mid);
      machineArray.push(machine);
    })
    return Promise.all(machineArray);
  }
}

export interface IGetMachineResponse {
  machine: IMachine;
}
