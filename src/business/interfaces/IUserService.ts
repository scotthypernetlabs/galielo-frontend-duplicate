export interface IUserService {
  getCurrentUser(): Promise<void>;
  getUsers(filterOptions: any): Promise<void>;
}
