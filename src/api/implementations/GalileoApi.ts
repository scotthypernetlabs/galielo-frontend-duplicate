import { IGalileoApi } from '../interfaces/IGalileoApi';
import { ISocket } from '../../data/interfaces/ISocket';
import { IOfferService } from '../../business/interfaces/IOfferService';
import { Logger } from '../../components/Logger';
import { openNotificationModal } from '../../actions/modalActions';
import store from '../../store/store';
import { IStationService } from '../../business/interfaces/IStationService';
import { IStation } from '../objects/station';
import { Station, Volume, HostPath } from '../../business/objects/station';
import {EJobRunningStatus, EJobStatus, Job, JobStatus, EPaymentStatus} from "../../business/objects/job";
import DateTimeFormat = Intl.DateTimeFormat;
import {IJobService} from "../../business/interfaces/IJobService";
import { IMachineService } from '../../business/interfaces/IMachineService';
import { updateStation, receiveStation } from '../../actions/stationActions';
import { removeStationInvite, receiveStationInvite } from '../../actions/userActions';
import { IUserService } from '../../business/interfaces/IUserService';
import { UserFilterOptions } from '../../business/objects/user';
import { IJob } from '../objects/job';

export class GalileoApi implements IGalileoApi {
  constructor(
    protected socket: ISocket,
    protected offerService: IOfferService,
    protected stationService: IStationService,
    protected machineService:IMachineService,
    protected userService: IUserService,
    protected jobService: IJobService,
    protected logService: Logger,
  ){

  }
  initialize(){
    this.openProviderEndpoints(this.socket);
    this.openConsumerEndpoints(this.socket);
    this.openStationEndpoints(this.socket, this.stationService);
    this.openJobEndpoints(this.socket, this.jobService);
    this.openMachineEndpoints(this.socket, this.machineService);
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
  protected convertToBusinessStation(station: IStation){
    if(station.mids.length > 0){
      this.machineService.getMachines(station.mids);
    }
    let owner: string = '';
    let admin_list: string[] = [];
    let members_list: string[] = [];
    let volumes:Volume[] = station.volumes.map(volume => {
      let hostPaths:HostPath[] = volume.host_paths.map(host_path => {
        return new HostPath(host_path.host_path, host_path.volume_host_path_id, host_path.volume_id, host_path.mid);
      })
      return new Volume(
        volume.name, volume.mount_point, volume.access,
        hostPaths, volume.volume_id, volume.station_id);
    });
    let invited_list: string[] = [];
    let pending_list: string[] = [];
    station.users.forEach(station_user => {
      if(station_user.status.toUpperCase() === "INVITED"){
        invited_list.push(station_user.userid);
      }
      if(station_user.status.toUpperCase() === "OWNER"){
        members_list.push(station_user.userid);
        admin_list.push(station_user.userid);
        owner = station_user.userid;
      }
      if(station_user.status.toUpperCase() === "ADMIN"){
        members_list.push(station_user.userid);
        admin_list.push(station_user.userid);
      }
      if(station_user.status.toUpperCase() === "MEMBER"){
        members_list.push(station_user.userid);
      }
      if(station_user.status.toUpperCase() === "PENDING"){
        members_list.push(station_user.userid);
      }
    })
    return new Station(
      station.stationid, owner, admin_list, members_list,
      station.name, station.description, station.mids, volumes, invited_list, pending_list);
  }
  protected openStationEndpoints(socket: ISocket, service: IStationService){
    socket.on('new_station', (response: { station: IStation }) => {
      this.logService.log('new_station', response);
      let businessStation = this.convertToBusinessStation(response.station);
      service.updateStation(businessStation);
    })
    // A station was destroyed that includes user
    socket.on('station_admin_destroyed', (response: {stationid: string}) => {
      service.removeStation(response.stationid);
    })
    socket.on('station_member_destroyed', (response: {stationid: string}) => {
      service.removeStation(response.stationid);
    })
    // Invites & Reqyests
    socket.on('station_admin_invite_sent', (response: {stationid: string, userids: string[]}) => {
      // used for notifying admins
      console.log("station_admin_invite_sent emitted");
      response.userids.map(user_id => {
        store.dispatch(updateStation(response.stationid, 'invited_list', user_id));
      })
    })
    socket.on('station_admin_invite_accepted', (response:{stationid: string, userid:string}) => {
      this.logService.log('station_admin_invite_accepted', response);
      if(store.getState().users.users[response.userid]){
        store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
      }else{
        this.userService.getUsers(new UserFilterOptions([response.userid]), () => {
          store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
        });
      }
    })
    socket.on('station_admin_invite_rejected', (response:{stationid: string, userid: string}) => {
      this.logService.log('station_admin_invite_rejected', response);
      store.dispatch(updateStation(response.stationid, 'reject_invite', response.userid));
    })
    socket.on('station_admin_request_received', () => {

    })
    socket.on('station_admin_request_accepted', () => {

    })
    socket.on('station_admin_request_rejected', (response: { stationid: string, userid: string}) => {
      this.logService.log('station_admin_request_rejected', response);
      store.dispatch(updateStation(response.stationid, 'reject_invite', response.userid));
    })
    socket.on('station_user_invite_received', (response: {station: IStation}) => {
      this.logService.log("station_user_invite_received", response);
      let station = this.convertToBusinessStation(response.station)
      store.dispatch(receiveStationInvite(station.id));
      store.dispatch(receiveStation(station));
    })
    socket.on('station_user_invite_accepted', (response: { stationid: string, userid: string}) => {
      this.logService.log('station_user_invite_accepted', response);

      store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
      store.dispatch(removeStationInvite(response.stationid));
    })
    socket.on('station_user_invite_rejected', (response:{stationid: string, userid: string}) => {
      this.logService.log('station_user_invite_rejected', response);
      store.dispatch(updateStation(response.stationid, 'reject_invite', response.userid));
      store.dispatch(removeStationInvite(response.stationid));
    })
    socket.on('station_user_request_sent', () => {

    })
    socket.on('station_user_request_rejected', () => {

    })
    socket.on('station_user_request_accepted', () => {

    })
    socket.on('station_user_invite_destroyed', (response: {stationid: string}) => {
      store.dispatch(removeStationInvite(response.stationid));
    })
    socket.on('station_user_request_destroyed', () => {
      this.logService.log('station_user_request_destroyed');
    })
    // Member Addition / Removal
    socket.on('station_member_member_added', (response:{stationid: string, userid: string}) => {
      this.logService.log('station_member_member_added', response);
      if(store.getState().users.users[response.userid]){
        store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
      }else{
        this.userService.getUsers(new UserFilterOptions([response.userid]), () => {
          store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
        });
      }
      // this.userService.getUsers(new UserFilterOptions([response.userid]));
      // store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
    })
    socket.on('station_member_member_removed', (response: {stationid: string, userids: string[] }) => {
      this.logService.log('station_member_member_removed', response);
      store.dispatch(updateStation(response.stationid, 'remove_member', response.userids));
    })
    socket.on('station_user_withdrawn', (response: {stationid: string, mids: string[]}) => {
      this.logService.log('station_user_withdrawn', response);
      service.removeStation(response.stationid);
    })
    socket.on('station_admin_member_removed', (response: {stationid: string, userids: string[]}) => {
      this.logService.log('station_admin_member_removed', response);
      store.dispatch(updateStation(response.stationid, 'remove_member', response.userids));
    })
    socket.on('station_user_expelled', (response:{stationid: string}) => {
      this.logService.log('station_user_expelled', response);
      service.removeStation(response.stationid);
    })
    // Machine addition / removal
    socket.on('station_admin_machine_removed', (response: { stationid: string, mids: string[] }) => {
      this.logService.log('station_admin_machine_removed', response);
      store.dispatch(updateStation(response.stationid, "remove_machines", response.mids))
    })
    socket.on('station_admin_machine_added', (response: { stationid:string, mids: string[] }) => {
      this.logService.log('station_admin_machine_added', response);
      store.dispatch(updateStation(response.stationid, "add_machines", response.mids))
    })
    socket.on('station_member_machine_removed', (response: { stationid:string, mids: string[] }) => {
      this.logService.log('station_member_machine_removed', response);
      store.dispatch(updateStation(response.stationid, "remove_machines", response.mids))
    })
    socket.on('station_member_machine_added', (response: { stationid:string, mids: string[] }) => {
      this.logService.log('station_admin_machine_removed', response);
      store.dispatch(updateStation(response.stationid, "add_machines", response.mids))
    })
    // Volumes
    socket.on('station_admin_volume_added', (response: { stationid: string, volume_names: string[] }) => {
    })
    socket.on('station_admin_volume_removed', (response: { stationid: string, volume_names: string[] }) => {
    })
    socket.on('station_member_volume_added', (response: { stationid: string, volume_names: string[] }) => {
    })
    socket.on('station_member_volume_removed', (response: { stationid: string, volume_names: string[] }) => {
    })

  }

  protected convertToBusinessJob(job: IJob){
    let statusHistory = job.status_history.map(status_history => {
      return new JobStatus(status_history.jobid, status_history.jobstatusid, status_history.status, status_history.timestamp);
    })
    return new Job(job.container,
      job.jobid, job.last_updated, job.name, job.oaid, job.pay_interval,
      job.pay_status, job.receiverid, job.userid, job.state, job.stationid,
      job.status, statusHistory, job.time_created, job.total_runtime)
  }

  protected openJobEndpoints(socket: ISocket, service: IJobService){
    socket.on('job_landing_zone_submitted', (job: IJob) => {
      this.logService.log('job_landing_zone_submitted', job);
      service.updateReceivedJob(this.convertToBusinessJob(job));
    });

    socket.on('job_launcher_submitted', (response: { job: IJob }) => {
      this.logService.log('job_launcher_submitted', response);
      service.updateSentJob(this.convertToBusinessJob(response.job));
    });

    socket.on('job_launcher_updated', (response: { job: IJob }) => {
      this.logService.log('job_launcher_updated', response);
      service.updateSentJob(this.convertToBusinessJob(response.job));
    });

    socket.on('job_landing_zone_updated', (response: { job: IJob }) => {
      this.logService.log('job_landing_zone_updated', response);
      service.updateReceivedJob(this.convertToBusinessJob(response.job));
    });

    socket.on('station_job_updated', (response:any) => {
      this.logService.log('station_job_updated', response);
    })

    socket.on('top', (response: any) => {
      this.logService.log('top', response);
      // this.convertToBusinessJob(job);
    });

    socket.on('logs', (response: any) => {
      this.logService.log('logs', response);
      // this.convertToBusinessJob(job);
    });
  }
  protected openMachineEndpoints(socket: ISocket, service: IMachineService){
    
  }
}

export interface StakeTokenObject {
  stake_id: string;
  status: string;
  amount: number;
}

export interface JobObject {
  userid: string;
  senderid: string;
  receiverid: string;
  time_created: DateTimeFormat;
  last_updated: DateTimeFormat;
  status: EJobStatus,
  container: string;
  name: string;
  stationId?: string;
  state: EJobRunningStatus;
  oaid?: string;
  pay_status: EPaymentStatus;
  pay_interval: number;
  total_runtime: number;
  status_history: JobStatus;
  jobid?: string;
}
