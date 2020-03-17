import { UserFilterOptions } from "../objects/user";

export interface IUserService {
  getCurrentUser(): Promise<void>;
  getUsers(
    filterOptions: UserFilterOptions,
    extraFunction?: Function
  ): Promise<void>;
  searchByUsername(filterOptions: UserFilterOptions): Promise<void>;
  getStationInvites(): Promise<void>;
}
