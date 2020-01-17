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

export class GalileoApi implements IGalileoApi {
  constructor(
    protected socket: ISocket,
    protected offerService: IOfferService,
    protected stationService: IStationService,
    protected logService: Logger,
  ){

  }
  initialize(){
    this.openProviderEndpoints(this.socket);
    this.openConsumerEndpoints(this.socket);
    this.openStationEndpoints(this.socket, this.stationService);
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
    console.log(station);
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
      if(station_user.status === "invited"){
        invited_list.push(station_user.userid);
      }
      if(station_user.status === "owner"){
        owner = station_user.userid;
      }
      if(station_user.status === "admin"){
        admin_list.push(station_user.userid);
      }
      if(station_user.status === "member"){
        members_list.push(station_user.userid);
      }
      if(station_user.status === "pending"){
        members_list.push(station_user.userid);
      }
    })
    return new Station(
      station.stationid, owner, admin_list, members_list,
      station.name, station.description, station.machines, volumes, invited_list, pending_list);
  }
  protected openStationEndpoints(socket: ISocket, service: IStationService){
    // A station was created that includes user
    /*
    station = {
      owner: string;
      admin_list: string[];
      members_list: string[];
      name: string;
      description: string;
      machine_ids: string[];
      volumes: volumes[];
      invited_list: string[];
      pending_list: string[];
    }
    */
    socket.on('new_station', (station: IStation) => {
      let businessStation = this.convertToBusinessStation(station);
      service.updateStation(businessStation);
    })
    // A station was destroyed that includes user
    socket.on('station_admin_destroyed', (station_id: string) => {
      service.removeStation(station_id);
    })
    socket.on('station_member_destroyed', (station_id: string) => {
      service.removeStation(station_id);
    })
    // Invites & Reqyests
    socket.on('station_admin_invite_sent', () => {
      // used for notifying admins
    })
    socket.on('station_admin_invite_accepted', () => {

    })
    socket.on('station_admin_invite_rejected', () => {

    })
    socket.on('station_admin_request_received', () => {

    })
    socket.on('station_admin_request_accepted', () => {

    })
    socket.on('station_admin_request_rejected', () => {

    })
    socket.on('station_user_invite_received', () => {

    })
    socket.on('station_user_invite_rejected', () => {

    })
    socket.on('station_user_request_sent', () => {

    })
    socket.on('station_user_request_rejected', () => {

    })
    socket.on('station_user_request_accepted', () => {

    })
    socket.on('station_user_invite_destroyed', () => {

    })
    socket.on('station_user_request_destroyed', () => {

    })
    // Member Addition / Removal
    socket.on('station_member_member_added', () => {

    })
    socket.on('station_member_member_removed', () => {

    })
    socket.on('station_user_withdrawn', () => {

    })
    socket.on('station_admin_member_removed', () => {

    })
    socket.on('station_user_expelled', () => {

    })
    socket.on('station_member_destroyed', () => {

    })
    socket.on('station_admin_destroyed', () => {

    })
    // Machine addition / removal
    socket.on('station_admin_machine_removed', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    socket.on('station_admin_machine_added', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    socket.on('station_member_machine_removed', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    socket.on('station_admin_machine_removed', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    // Volumes
    socket.on('station_admin_volume_added', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    socket.on('station_admin_volume_removed', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    socket.on('station_member_volume_added', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })
    socket.on('station_member_volume_removed', (station: IStation) => {
      service.updateStation(this.convertToBusinessStation(station));
    })

  }

  protected convertToBusinessJob(job: JobObject) {
    return new Job( '', job.name, job.senderid, job.receiverid, job.jobid, job.total_runtime, job.time_created, job.status);
  }

  protected openJobEndpoints(socket: ISocket, service: IJobService){
    socket.on('job_landing_zone_updated', (resultsid: string, status: string) => {
    });

    socket.on('job_launcher_updated', (resultsid: string, status: string) => {
    });

    socket.on('job_landing_zone_submitted', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    socket.on('job_launcher_submitted', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    // @param status = 'Stop Requested', 'Pause Requested', 'Start Requested', 'Completed', 'Terminated', 'Stopped', 'Paused'
    socket.on('updated', (job: JobObject, status: string) => {
      this.convertToBusinessJob(job);
    });

    socket.on('stopped', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    socket.on('started', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    socket.on('completed', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    socket.on('group_job_updated', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    socket.on('top', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });

    socket.on('logs', (job: JobObject) => {
      this.convertToBusinessJob(job);
    });
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
