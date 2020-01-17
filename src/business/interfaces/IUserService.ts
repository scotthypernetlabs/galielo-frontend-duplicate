import { UserFilterOptions } from "../objects/user";

export interface IUserService {
  getCurrentUser(): Promise<void>;
  getUsers(filterOptions: any): Promise<void>;
  searchByUsername(filterOptions: UserFilterOptions): Promise<void>
}
