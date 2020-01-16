import { IGalileoApi } from '../interfaces/IGalileoApi';
import { ISocket } from '../../data/interfaces/ISocket';
import { IOfferService } from '../../business/interfaces/IOfferService';
import { Logger } from '../../components/Logger';
import { openNotificationModal } from '../../actions/modalActions';
import store from '../../store/store';

export class GalileoApi implements IGalileoApi {
  constructor(
    protected socket: ISocket,
    protected offerService: IOfferService,
    protected logService: Logger,
  ){

  }
  initialize(){
    this.openProviderEndpoints(this.socket);
    this.openConsumerEndpoints(this.socket);
    this.openStationEndpoints(this.socket);
  }
  protected openProviderEndpoints(socket: ISocket){
    socket.on('stake_tokens_request', (stake_id: string, hypertoken_amount: number) => {
      this.logService.log(`Token staked by ${stake_id} with amount ${hypertoken_amount}`);
    })
    socket.on('stake_tokens_status', (stake_dict: StakeTokenObject) => {
      this.logService.log(`Stake token status with stake_dict`, stake_dict);
    })
    socket.on('stake_tokens_success', (stake_dict: StakeTokenObject) => {
      this.logService.log(`Stake tokens success: dict=`, stake_dict);
      store.dispatch(openNotificationModal('Notifications', `Stake tokens success: amount=${stake_dict.amount}`));
    })
    socket.on('stake_tokens_failure', (stake_id: string) => {
      this.logService.log(`${stake_id} failed to stake tokens`);
    })
    socket.on('get_wallet', (id: string) => {
      this.logService.log(`Get wallet: ${id}`);
    })
    socket.on('payment_received', (receipt_id: string) => {
      this.logService.log(`Payment received provider: ${receipt_id}`);
    })
    socket.on('create_offer_success', (status: string, offer_id: string) => {
      this.logService.log(`Create offer success: ${status} and ${offer_id}`);
      this.offerService.updateOffers(offer_id, status);
    })
    socket.on('create_offer_failure', (status: string) => {
      this.logService.log(`Create offer failure: ${status}`);
    })
    socket.on('offer_request_update', (offer_id: string, status: string) => {
      this.logService.log(`Offer request update with id=${offer_id} and status=${status}`);
      this.offerService.updateOffers(offer_id, status);
    })
    socket.on('offer_acceptance_status', (consumer_wallet_address: string, offerid: string, consumer_deposit_payment: number, status: string) => {
      this.logService.log(`Offer acceptance status provider`);
    });
    socket.on('open_channel_success', (consumer_wallet_address: string, payment_type: string) => {
      this.logService.log("Open channel success provider");
    })
  }
  protected openConsumerEndpoints(socket:ISocket){
    socket.on('get_wallet_request', (offer_id: string) => {
      this.logService.log(`Get wallet request listener ${offer_id}`);
    })
    socket.on('create_offer_success', (status: string, offer_id: string) => {
      this.logService.log(`Create offer success ${status}, ${offer_id}`);
    })
   socket.on('create_offer_failure', (status: string, offer_id: string) => {
     this.logService.log(`Create offer failure ${status}, ${offer_id}`);
   })
   socket.on('payment_received', (receipt_id: string) => {
     this.logService.log(`Payment received consumer: ${receipt_id}`);
   })
   socket.on('offer_acceptance_status', (consumer_wallet_address: string, offer_id: string, consumer_deposit_payment: number, status: string) => {
     this.logService.log(`Offer acceptance status, ${consumer_wallet_address}, ${offer_id}, ${consumer_deposit_payment}, ${status}`);
   })
   socket.on('offer_accept_success', (offerid: string) => {
     store.dispatch(openNotificationModal('Notifications', "Your offer request has been accepted! You can now access this machine in Galileo"));
     this.logService.log(`Offer accept success ${offerid}`);
    })
  }
  protected openStationEndpoints(socket: ISocket){
    // A station was created that includes user
    socket.on('station_creation', (station_id: string) => {
      // getstations()
    })
    // A station was destroyed that includes user
    socket.on('station_destruction', (station_id: string) => {
      // getstations();
    })
    socket.on('station_destruction_member', (station_id: string) => {
      // updatestation(station_id:string);
    })
    // receive station invite
    socket.on('station_invite', (station_id: string) => {
      // getstationInvitesReceived();
    })
    socket.on('station_invite_owner', (station_id: string, user_id: string) => {
      // whatever i need to do when i'm the owner and i made the station
      // getstationInvitesSent(station_id:string);
    })
    // station invite response
    socket.on('station_invite_response', (station_id:string, user_id:string, response:boolean) => {
      // if(response === "accept"){
      //   updatestation(station_id:string);
      // }
      // getstationInvitesSent(station_id:string);
    })
    socket.on('station_invite_response_user', (station_id: string, response:boolean) => {
      // if(response === "accept"){
      //   updatestation(station_id:string);
      // }
      // getstationInvitesReceived();
    })
    // station invite you received was revoked
    socket.on('station_invite_destruction', (station_id:string) => {
      // getstationInvitesReceived();
    })
    //when a user has requested to join a station that you administrate
    socket.on('station_request', (station_id:string, requester_id:string) => {
      // getstationApplicationsReceived();
    })
    //when an admin has responded to your request to join a station
    socket.on('station_request_response', (station_id:string, response:boolean) => {
      // if(response === "accept"){
      //   getstations();
      // }
      // getstationRequestsSent();
    })
    //when some _other_ admin has responded to someone's request to join a station that you administrate
    socket.on('station_request_removed', (station_id: string, requester_id: string) => {
      // getstationApplicationsReceived();
    })
    socket.on('station_expulsion', (station_id: string) => {
      // getstations();
      // getstationMachines(station_id:string);
    })
    //when some user has been added to a station
    socket.on('station_member_added', (station_id:string, new_member_id:string) => {
      // updatestation(station_id:string);
    })
    //when some user has been removed from a station
    socket.on('station_member_removed', (station_id:string, member_id:string) => {
      // updatestation(station_id:string);
      // getstationMachines(station_id:string);
    })
    // when someone has added one of their machines to the station's pool
    socket.on('station_machine_addition', (station_id:string, machine_id: string) => {
      // getstationMachines(station_id:string);
    })
    // when someone has removed one of their machines from the station's pool (edited)
    socket.on('station_machine_removal', (station_id:string, machine_id:string) => {
      // getstationMachines(station_id:string);
    })
    socket.on('station_withdrawn', (station_id:string) => {
      // getstations();
    })
    socket.on('station_machine_updated', (station_id:string, machine_id: string) => {
      // getstationMachines(station_id:string);
    })
    socket.on('station_volume_added', (station_id:string) => {
      // updatestation(station_id:string);
    })
    socket.on('station_volume_removed', (station_id:string) => {
      // updatestation(station_id:string);
    })
    socket.on('station_job_updated', (station_id:string) => {
      // getStationJobs(station_id:string);
    })
  }
  protected openJobEndpoints(socket: ISocket){
    socket.on('sent_job_update', (job:any) => {
      // store.dispatch(updateSentJob(job));
    })
    socket.on('received_job_update', (job:any) => {
      // store.dispatch(updateReceivedJob(job));
    })
    socket.on('job_hidden', (job_id:any) => {
      // refreshJobData();
    })
    socket.on('sent_job_logs', (log_text:string) => {
      // ipcRenderer.send('log', "Sent_job_logs");
      // let logWindow = window.open('', 'modal');
      // let logTextArray = log_text.split(/\r?\n/g);
      // let renderedText = '';
      // logTextArray.forEach(line => {
      //   renderedText += `<div>${line}</div>`;
      // })
      // logWindow.document.write(`
      //   <div style="height: 23px; -webkit-app-region: drag; position: relative; top:0; left:0; background: #354962; width: 100%; z-index: 10; margin: 0px; padding: 0px; overflow: hidden">
      //   </div>
      //     <div style="height: calc(100% -23px); overflow-y: scroll">
      //     ${renderedText}
      //     </div>
      //   </div>
      //   <style>
      //   body {
      //     padding: 0px;
      //     margin: 0px;
      //     height: 100%;
      //   }
      //   </style>
      //   `
      // );
    })
    socket.on('sent_job_top', (proc_info:any) => {
      // ipcRenderer.send('log', "Sent_job_top");
      // console.log(proc_info);
      // if(!proc_info){
      //   return;
      // }
      // let procLogWindow = window.open('', 'modal');
      // let allProcesses = '';
      // let titles = proc_info.Titles;
      // let renderedTitles = '';
      // let column_percent = Math.floor(100 / titles.length);
      // let columns = '';
      // titles.forEach(title => {
      //   renderedTitles += `<div>${title}</div>`;
      //   columns += `${column_percent}% `
      // })
      // proc_info.Processes.forEach(process_array => {
      //   let renderedProcesses = '';
      //   process_array.forEach(process => {
      //     renderedProcesses += `<div>${process}</div>`;
      //   })
      //   allProcesses += `<div style="display: grid; grid-template-columns:${columns};">`;
      //   allProcesses += renderedProcesses;
      //   allProcesses += `</div>`
      // })
      // procLogWindow.document.write(`
      //   <div style="height: 23px; -webkit-app-region: drag; position: relative; top:0; left:0; background: #354962; width: 100%; z-index: 10;padding: 0px; margin: 0px;">
      //   </div>
      //   <div style="display: grid; grid-template-columns:${columns};">
      //     ${renderedTitles}
      //   </div>
      //   ${allProcesses}
      //   <style>
      //   body {
      //     padding: 0px;
      //     margin: 0px;
      //   }
      //   </style>
      //   `);
    })
  }
}

export interface StakeTokenObject {
  stake_id: string;
  status: string;
  amount: number;
}
