import { logService } from '../../components/Logger';
import { ISocket } from '../interfaces/ISocket';
import { IProviderRepository } from '../interfaces/IProviderRepository';
import { openNotificationModal } from '../../actions/modalActions';
import store from '../../store/store';
import { IOfferService } from '../../business/interfaces/IOfferService';

export class ProviderRepository implements IProviderRepository {
  public socket: ISocket;
  constructor(socket: ISocket, protected offerService: IOfferService){
    this.socket = socket;
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
        store.dispatch(openNotificationModal('Notifications', "Staked tokens successfully"));
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
      this.offerService.onUpdateOffers();
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
        store.dispatch(openNotificationModal("Notifications", "Offer created"));
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
        this.offerService.onUpdateOffers();
        logService.log("Offer deleted");
      })
  }
}
