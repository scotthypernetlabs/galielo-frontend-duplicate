export interface IUserStateRepository {
    loggedIn(): Promise<boolean>;
    hasWallet(): Promise<boolean>;
}
