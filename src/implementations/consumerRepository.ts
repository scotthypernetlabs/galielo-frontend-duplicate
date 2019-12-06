import { logService } from '../components/Logger';
import { ISocket } from '../interfaces/ISocket';
import { IConsumerRepository } from '../interfaces/IConsumerRepository';
import { openNotificationModal } from '../actions/modalActions';
import store from '../store/store';

export class ConsumerRepository implements IConsumerRepository {
  public socket: ISocket;
  constructor(socket: ISocket){
    this.socket = socket;
  }
  public openSocketEndpoints(){
    this.socket.on('get_wallet_request', (offer_id: string) => {
      logService.log(`Get wallet request listener ${offer_id}`);
     })
     this.socket.on('create_offer_success', (status: string, offer_id: string) => {
       logService.log(`Create offer success ${status}, ${offer_id}`);
     })
     this.socket.on('create_offer_failure', (status: string, offer_id: string) => {
       logService.log(`Create offer failure ${status}, ${offer_id}`);
     })
      this.socket.on('payment_received', (receipt_id: string) => {
        logService.log(`Payment received consumer: ${receipt_id}`);
      })
      this.socket.on('offer_acceptance_status', (consumer_wallet_address: string, offer_id: string, consumer_deposit_payment: number, status: string) => {
        logService.log(`Offer acceptance status, ${consumer_wallet_address}, ${offer_id}, ${consumer_deposit_payment}, ${status}`);
      })
      this.socket.on('offer_accept_success', (offerid: string) => {
        store.dispatch(openNotificationModal('Notificatons', "Your offer request has been accepted! You can now access this machine in Galileo"));
        logService.log(`Offer accept success ${offerid}`);
      })
    }
  public acceptOfferRequest(offer_id: string, deposit_payment: number, payment_type: string, mid: string){
    deposit_payment = Math.floor(deposit_payment * 1e18);
    logService.log(`Attempting to emit acceptOfferRequest from consumer socket offer_id=${offer_id} deposit_payment=${deposit_payment} mid=${mid}`);
    this.socket.emit('accept_offer_request', offer_id, deposit_payment, payment_type, mid)
      .then(() => {
        logService.log("Accept offer request");
    })
  }
  public channelIsOpen(offer_id: string, deposit_payment: string, payment_type: string, mid: string){
    this.socket.emit("channel_is_open", offer_id, deposit_payment, payment_type, mid)
      .then(() => {
          logService.log("Channel is open");
      })
  }
  public openChannelSuccessConsumer(oaid: string, payment_type: string){
    this.socket.emit('open_channel_success', oaid, payment_type)
      .then(() => {
          logService.log("Open channel succeeded");
      })
  }
  public depositIntoChannelSuccess(oaid: string, deposit_amount: string){
    this.socket.emit("deposit_into_channel_success", oaid, deposit_amount)
      .then(() => {
        logService.log("Deposit into channel success");
      })
  }
}
