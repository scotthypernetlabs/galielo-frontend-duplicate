import { IUserRepository } from '../interfaces/IUserRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IMachineRepository } from '../interfaces/IMachineRepository';
import { IUser } from '../../business/objects/user';


export class UserRepository implements IUserRepository {
  protected backend: string;
  constructor(
    protected requestRepository:IRequestRepository,
    protected settings: ISettingsRepository,
    protected machineRepository: IMachineRepository
    ){
    this.backend = `${this.settings.getSettings().backend}/v0/marketplace`;
  }

  getCurrentUser(){
    return this.requestRepository.requestWithAuth(`${this.backend}/user`, 'GET')
      .then((response: IUser) => {
        return response;
      })
  }
}
