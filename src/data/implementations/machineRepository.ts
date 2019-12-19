import { IMachineRepository } from '../interfaces/IMachineRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IMachine } from '../../business/objects/machine';

export class MachineRepository implements IMachineRepository {
  protected backend: string;

  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository) {
    this.backend = `${this.settings.getSettings().backend}/v0/marketplace`;
  }

  getMachine(mid: string) {
    return this.requestRepository.request(`${this.backend}/machines/${mid}`, 'GET')
      .then((response: IGetMachineResponse) => {
        return response.machine
      })
  }
  getMachines(mids: string[]){
    let machineArray:IMachine[] = [];
    mids.forEach(async(mid) => {
      let machine = await this.getMachine(mid);
      machineArray.push(machine);
    })
    return Promise.resolve(machineArray);
  }
}

export interface IGetMachineResponse {
  machine: IMachine;
}
