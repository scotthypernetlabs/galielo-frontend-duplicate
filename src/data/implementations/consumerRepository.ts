import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { ISocket } from "../interfaces/ISocket";
import { logService } from "../../components/Logger";
import store from "../../store/store";

export class ConsumerRepository implements IConsumerRepository {
  public socket: ISocket;
  constructor(socket: ISocket) {
    this.socket = socket;
  }
  public acceptOfferRequest(
    offer_id: string,
    deposit_payment: number,
    payment_type: string,
    mid: string
  ) {
    deposit_payment = Math.floor(deposit_payment * 1e18);
    logService.log(
      `Attempting to emit acceptOfferRequest from consumer socket offer_id=${offer_id} deposit_payment=${deposit_payment} mid=${mid}`
    );
    this.socket
      .emit(
        "accept_offer_request",
        offer_id,
        deposit_payment,
        payment_type,
        mid
      )
      .then(() => {
        logService.log("Accept offer request");
      });
  }
  public channelIsOpen(
    offer_id: string,
    deposit_payment: string,
    payment_type: string,
    mid: string
  ) {
    this.socket
      .emit("channel_is_open", offer_id, deposit_payment, payment_type, mid)
      .then(() => {
        logService.log("Channel is open");
      });
  }
  public openChannelSuccessConsumer(oaid: string, payment_type: string) {
    this.socket.emit("open_channel_success", oaid, payment_type).then(() => {
      logService.log("Open channel succeeded");
    });
  }
  public depositIntoChannelSuccess(oaid: string, deposit_amount: string) {
    this.socket
      .emit("deposit_into_channel_success", oaid, deposit_amount)
      .then(() => {
        logService.log("Deposit into channel success");
      });
  }
}
