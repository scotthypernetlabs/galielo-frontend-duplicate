import { IUser } from '../../business/objects/user';

export interface IUserRepository {
  getCurrentUser(): Promise<IUser>;
}
