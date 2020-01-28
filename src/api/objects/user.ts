export interface IUser {
  userid: string;
  username: string;
  mids: string[];
  wallets: IWallet[];
}

export interface IWallet {
  profilewalletid: string;
  wallet: string;
  public_key: string;
}
