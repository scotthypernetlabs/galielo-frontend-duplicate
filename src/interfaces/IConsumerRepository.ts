import { ISocket } from './ISocket';

export interface IConsumerRepository {
  socket: ISocket;
  openSocketEndpoints: () => void;
  acceptOfferRequest: (offer_id: string, deposit_payment: number, payment_type: string, mid: string) => void;
  channelIsOpen: (offer_id: string, deposit_payment: string, payment_type: string, mid: string) => void;
  openChannelSuccessConsumer: (oaid: string, payment_type: string) => void;
  depositIntoChannelSuccess: (oaid: string, deposit_amount: string) => void;
}
