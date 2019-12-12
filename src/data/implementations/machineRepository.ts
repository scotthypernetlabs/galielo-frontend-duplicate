import { IMachineRepository } from '../interfaces/IMachineRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IMachine } from '../../business/objects/machine';

export class MachineRepository implements IMachineRepository {
  protected backend: string;
  constructor(protected requestRepository:IRequestRepository, protected settings: ISettingsRepository){
    this.backend = this.settings.getSettings().backend;
  }
  getMachine(mid: string){
    return this.requestRepository.request(`${this.backend}/machines/${mid}`, 'GET')
      .then((response:IGetMachineResponse) => {
        return response.machine
      })
  }
}

export interface IGetMachineResponse {
  machine: IMachine[];
}
