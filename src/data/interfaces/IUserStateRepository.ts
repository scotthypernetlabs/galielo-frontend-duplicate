
export interface IUserStateRepository {
    loggedIn(resolve: Function, reject: Function): void;
    hasWallet(resolve: Function, reject: Function): void;
}