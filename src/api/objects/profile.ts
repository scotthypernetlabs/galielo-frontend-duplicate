export interface IUser {
  user_id: string;
  username: string;
  wallets: Wallet[];
}

export interface Wallet {
  address: string;
  public_key: string;
  profilewalletid: string;
}
