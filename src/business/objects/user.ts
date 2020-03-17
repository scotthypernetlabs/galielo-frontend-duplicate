export class User {
  constructor(
    public user_id: string,
    public username: string,
    public mids: string[],
    public wallets: Wallet[]
  ) {}
}

export class Wallet {
  constructor(
    public profile_wallet_id: string,
    public wallet: string,
    public public_key: string
  ) {}
}

export class StationInvite {
  constructor(public station_id: string) {}
}

export class UserFilterOptions {
  constructor(
    public userids?: string[],
    public partial_username?: string,
    public usernames?: string[],
    public wallets?: string[],
    public public_keys?: string[]
  ) {}
}
