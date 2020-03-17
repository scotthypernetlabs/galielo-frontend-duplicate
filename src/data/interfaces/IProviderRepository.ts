import { ISocket } from "./ISocket";

export interface IProviderRepository {
  socket: ISocket;
  stakeTokensRequest(amount: number): void;
  stakeTokensStatus(
    stake_id: string,
    status: string,
    amount: number,
    receiptId: string
  ): void;
  stakeTokensSuccess(stake_id: string, receiptId: string): void;
  stakeTokensFailure(stake_id: string): void;
  createOfferRequest(
    rate: number,
    pay_interval: number,
    max_acceptances: number,
    deposit_per_acceptance: number,
    mids: string[],
    expiration_date: number
  ): void;
  getWallet(offer_id: string, total_stake_balance: number): void;
  openChannelSuccessProvider(oaid: string, payment_type: string): void;
  paymentReceived(receiptId: string): void;
  deleteOffer(offerId: string): void;
}
