import { User } from '../../business/objects/user';
import { Station } from '../../business/objects/station';

export interface IUserRepository {
  getCurrentUser(): Promise<User>;
  getUsers(filterOptions:any): Promise<User[]>;
  getStationInvites(): Promise<Station[]>;
}
