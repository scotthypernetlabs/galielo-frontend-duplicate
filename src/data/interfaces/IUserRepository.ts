import { User } from '../../business/objects/user';

export interface IUserRepository {
  getCurrentUser(): Promise<User>;
  getUsers(filterOptions:any): Promise<User[]>;
}
