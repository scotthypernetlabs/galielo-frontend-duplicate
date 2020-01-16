import { IUserRepository } from '../interfaces/IUserRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IMachineRepository } from '../interfaces/IMachineRepository';
import { User } from '../../business/objects/user';


export class UserRepository implements IUserRepository {
  protected backend: string;
  constructor(
    protected requestRepository:IRequestRepository,
    protected settings: ISettingsRepository,
    protected machineRepository: IMachineRepository
    ){
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }

  getCurrentUser(){
    return this.requestRepository.requestWithAuth(`${this.backend}/users/self`, 'GET')
  }
}
