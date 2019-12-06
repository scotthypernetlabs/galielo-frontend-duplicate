export interface IUser {
  readonly mids?: string[];
  readonly public_key?: string;
  readonly user_id?: number;
  readonly username?: string;
  readonly wallet?: string;
}

export interface IUserState {
  readonly currentUser: IUser;
}
