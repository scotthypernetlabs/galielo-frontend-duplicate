import { logService } from '../components/Logger';
import { ISocket } from '../interfaces/ISocket';
import { IProviderRepository } from '../interfaces/IProviderRepository';
import { listOffers } from '../utils/api';

export class ProviderRepository implements IProviderRepository {
  public socket: ISocket;
  constructor(socket: ISocket){
    this.socket = socket;
  }
  public openSocketEndpoints(){
    this.socket.on('stake_tokens_request', (stake_id: string, hypertoken_amount: number) => {
      logService.log(`Token staked by ${stake_id} with amount ${hypertoken_amount}`);
    })
    this.socket.on('stake_tokens_status', (stake_dict: StakeTokenObject) => {
      logService.log(`Stake token status with stake_dict`, stake_dict);
    })
    this.socket.on('stake_tokens_success', (stake_dict: StakeTokenObject) => {
      logService.log(`Stake tokens success: dict=`, stake_dict);
      // store.dispatch(openNotificationModal('Notifications', `Stake tokens success: amount=${stake_dict.amount}`));
    })
    this.socket.on('stake_tokens_failure', (stake_id: string) => {
      logService.log(`${stake_id} failed to stake tokens`);
    })
    this.socket.on('get_wallet', (id: string) => {
      logService.log(`Get wallet: ${id}`);
    })
    this.socket.on('payment_received', (receipt_id: string) => {
      logService.log(`Payment received provider: ${receipt_id}`);
    })
    this.socket.on('create_offer_success', (status: string, offer_id: string) => {
      logService.log(`Create offer success: ${status} and ${offer_id}`);
      listOffers();
    })
    this.socket.on('create_offer_failure', (status: string) => {
      logService.log(`Create offer failure: ${status}`);
    })
    this.socket.on('offer_request_update', (offer_id: string, status: string) => {
      logService.log(`Offer request update with id=${offer_id} and status=${status}`);
      listOffers();
    })
    this.socket.on('offer_acceptance_status', (consumer_wallet_address: string, offerid: string, consumer_deposit_payment: number, status: string) => {
      logService.log(`Offer acceptance status provider`);
    });
    this.socket.on('open_channel_success', (consumer_wallet_address: string, payment_type: string) => {
      logService.log("Open channel success provider");
    })
  }
  public stakeTokensRequest(amount: number){
    amount = Math.floor(amount * 1e18);
    this.socket.emit('stake_tokens_request', amount)
      .then((response:any) => {
        logService.log("Stake tokens request", response);
      })
  }
  public stakeTokensStatus(stake_id: string, status:string, amount: number, receiptId: string){
    this.socket.emit('stake_tokens_status', stake_id, status, amount, receiptId)
      .then((response:any) => {
        logService.log("Stake tokens status", response);
      })
  }
  public stakeTokensSuccess(stake_id: string, receiptId: string){
    this.socket.emit('stake_tokens_success', stake_id, receiptId)
     .then(() => {
        logService.log("Emitted stake tokens success");
      });
  }
  public stakeTokensFailure(stake_id:string){
    this.socket.emit('stake_tokens_failure', stake_id)
      .then(() => {
        logService.log("Emitted stakeTokenFailure")
      })
  }
  public createOfferRequest(rate: number, pay_interval: number, max_acceptances: number, deposit_per_acceptance: number, mids: string[], expiration_date: number){
    // convert to python timestamp from javascript timestamp + 23:59:99
    expiration_date = (expiration_date / 1000) + 86399;
    logService.log(`Making offer with rate=${rate} pay_interval=${pay_interval} max_acceptances=${max_acceptances} deposit_per_acceptance=${deposit_per_acceptance} expiration_date=${expiration_date}`, mids);
    this.socket.emit('create_offer_request', rate, pay_interval, max_acceptances, deposit_per_acceptance, mids, expiration_date)
     .then(() => {
      listOffers();
      logService.log("Emitted create_offer_request");
    })
  }
  public getWallet(offer_id: string, total_stake_balance: number){
    this.socket.emit('wallet', offer_id, total_stake_balance)
     .then(() => {
       logService.log("Emitted wallet");
     })
  }
  public openChannelSuccessProvider(oaid: string, payment_type: string){
    this.socket.emit('open_channel_success', oaid, payment_type)
      .then(() => {
        logService.log("Open channel succeeded");
    })
  }
  public paymentReceived(receiptId: string){
    this.socket.emit('payment_received', receiptId)
      .then(() => {
        logService.log("Payment received");
      })
  }
  public deleteOffer(offerId: string){
    this.socket.emit('dekete', offerId)
      .then(() => {
        listOffers();
        logService.log("Offer deleted");
      })
  }
}

export interface StakeTokenObject {
  stake_id: string;
  status: string;
  amount: number;
}
