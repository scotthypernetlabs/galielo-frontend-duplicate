import {
  DockerLog,
  EJobRunningStatus,
  EJobStatus,
  EPaymentStatus,
  Job,
  JobStatus
} from "../../business/objects/job";
import { HostPath, Station, Volume } from "../../business/objects/station";
import { IGalileoApi, JobsLog, JobsTop } from "../interfaces/IGalileoApi";
import { IOfferService } from "../../business/interfaces/IOfferService";
import { ISocket } from "../../data/interfaces/ISocket";
import { IStation, IVolume } from "../objects/station";
import { IStationService } from "../../business/interfaces/IStationService";
import { Logger } from "../../components/Logger";
import { openNotificationModal } from "../../actions/modalActions";
import store from "../../store/store";
import DateTimeFormat = Intl.DateTimeFormat;
import { Dictionary } from "../../business/objects/dictionary";
import {
  GetMachinesFilter,
  convertToBusinessMachine
} from "../../business/objects/machine";
import { IJob } from "../objects/job";
import { IJobService } from "../../business/interfaces/IJobService";
import { IMachine } from "../objects/machine";
import { IMachineService } from "../../business/interfaces/IMachineService";
import { IUserService } from "../../business/interfaces/IUserService";
import { TypedEvent } from "../../business/objects/TypedEvent";
import { UserFilterOptions } from "../../business/objects/user";
import {
  receiveMachine,
  updateMachineStatus
} from "../../actions/machineActions";
import {
  receiveReceivedJobs,
  receiveStationJob,
  receiveStationJobs
} from "../../actions/jobActions";
import { receiveStation, updateStation } from "../../actions/stationActions";
import {
  receiveStationInvite,
  removeStationInvite,
  updateCurrentUser
} from "../../actions/userActions";

export class GalileoApi implements IGalileoApi {
  public onJobsTop = new TypedEvent<JobsTop>();
  public onJobsLog = new TypedEvent<JobsLog>();
  constructor(
    protected socket: ISocket,
    protected offerService: IOfferService,
    protected stationService: IStationService,
    protected machineService: IMachineService,
    protected userService: IUserService,
    protected jobService: IJobService,
    protected logService: Logger
  ) {}
  initialize() {
    this.openProviderEndpoints(this.socket);
    this.openConsumerEndpoints(this.socket);
    this.openStationEndpoints(this.socket, this.stationService);
    this.openJobEndpoints(this.socket, this.jobService);
    this.openMachineEndpoints(this.socket, this.machineService);
  }
  protected openProviderEndpoints(socket: ISocket) {
    socket.on(
      "stake_tokens_request",
      (stake_id: string, hypertoken_amount: number) => {
        this.logService.log(
          `Token staked by ${stake_id} with amount ${hypertoken_amount}`
        );
      }
    );
    socket.on("stake_tokens_status", (stake_dict: StakeTokenObject) => {
      this.logService.log(`Stake token status with stake_dict`, stake_dict);
    });
    socket.on("stake_tokens_success", (stake_dict: StakeTokenObject) => {
      this.logService.log(`Stake tokens success: dict=`, stake_dict);
      store.dispatch(
        openNotificationModal(
          "Notifications",
          `Stake tokens success: amount=${stake_dict.amount}`
        )
      );
    });
    socket.on("stake_tokens_failure", (stake_id: string) => {
      this.logService.log(`${stake_id} failed to stake tokens`);
    });
    socket.on("get_wallet", (id: string) => {
      this.logService.log(`Get wallet: ${id}`);
    });
    socket.on("payment_received", (receipt_id: string) => {
      this.logService.log(`Payment received provider: ${receipt_id}`);
    });
    socket.on("create_offer_success", (status: string, offer_id: string) => {
      this.logService.log(`Create offer success: ${status} and ${offer_id}`);
      this.offerService.updateOffers(offer_id, status);
    });
    socket.on("create_offer_failure", (status: string) => {
      this.logService.log(`Create offer failure: ${status}`);
    });
    socket.on("offer_request_update", (offer_id: string, status: string) => {
      this.logService.log(
        `Offer request update with id=${offer_id} and status=${status}`
      );
      this.offerService.updateOffers(offer_id, status);
    });
    socket.on(
      "offer_acceptance_status",
      (
        consumer_wallet_address: string,
        offerid: string,
        consumer_deposit_payment: number,
        status: string
      ) => {
        this.logService.log(`Offer acceptance status provider`);
      }
    );
    socket.on(
      "open_channel_success",
      (consumer_wallet_address: string, payment_type: string) => {
        this.logService.log("Open channel success provider");
      }
    );
  }
  protected openConsumerEndpoints(socket: ISocket) {
    socket.on("get_wallet_request", (offer_id: string) => {
      this.logService.log(`Get wallet request listener ${offer_id}`);
    });
    socket.on("create_offer_success", (status: string, offer_id: string) => {
      this.logService.log(`Create offer success ${status}, ${offer_id}`);
    });
    socket.on("create_offer_failure", (status: string, offer_id: string) => {
      this.logService.log(`Create offer failure ${status}, ${offer_id}`);
    });
    socket.on("payment_received", (receipt_id: string) => {
      this.logService.log(`Payment received consumer: ${receipt_id}`);
    });
    socket.on(
      "offer_acceptance_status",
      (
        consumer_wallet_address: string,
        offer_id: string,
        consumer_deposit_payment: number,
        status: string
      ) => {
        this.logService.log(
          `Offer acceptance status, ${consumer_wallet_address}, ${offer_id}, ${consumer_deposit_payment}, ${status}`
        );
      }
    );
    socket.on("offer_accept_success", (offerid: string) => {
      store.dispatch(
        openNotificationModal(
          "Notifications",
          "Your offer request has been accepted! You can now access this machine in Galileo"
        )
      );
      this.logService.log(`Offer accept success ${offerid}`);
    });
  }
  protected convertToBusinessVolume(volume: IVolume) {
    const hostPathsObject: Dictionary<HostPath> = {};
    const hostPaths: HostPath[] = volume.host_paths.map(host_path => {
      const hostPath = new HostPath(
        host_path.volumehostpathid,
        host_path.mid,
        host_path.host_path
      );
      hostPathsObject[host_path.mid] = hostPath;
      return hostPath;
    });
    return new Volume(
      volume.volumeid,
      volume.stationid,
      volume.name,
      volume.mount_point,
      volume.access,
      hostPathsObject
    );
  }
  protected convertToBusinessStation(station: IStation) {
    if (station.mids.length > 0) {
      this.machineService.getMachines(new GetMachinesFilter(station.mids));
    }
    const owner: string[] = [];
    const admin_list: string[] = [];
    const members_list: string[] = [];
    const volumes: Volume[] = station.volumes.map(volume => {
      return this.convertToBusinessVolume(volume);
    });
    const invited_list: string[] = [];
    const pending_list: string[] = [];
    station.users.forEach(station_user => {
      if (station_user.status.toUpperCase() === "INVITED") {
        invited_list.push(station_user.userid);
      }
      if (station_user.status.toUpperCase() === "OWNER") {
        members_list.push(station_user.userid);
        admin_list.push(station_user.userid);
        owner.push(station_user.userid);
      }
      if (station_user.status.toUpperCase() === "ADMIN") {
        members_list.push(station_user.userid);
        admin_list.push(station_user.userid);
      }
      if (station_user.status.toUpperCase() === "MEMBER") {
        members_list.push(station_user.userid);
      }
      if (station_user.status.toUpperCase() === "PENDING") {
        members_list.push(station_user.userid);
      }
    });
    return new Station(
      station.stationid,
      owner,
      admin_list,
      station.name,
      station.description,
      invited_list,
      pending_list,
      station.creation_timestamp,
      station.updated_timestamp,
      members_list,
      station.mids,
      volumes
    );
  }
  protected openStationEndpoints(socket: ISocket, service: IStationService) {
    socket.on("new_station", (response: { station: IStation }) => {
      this.logService.log("new_station", response);
      const businessStation = this.convertToBusinessStation(response.station);
      service.updateStation(businessStation);
    });
    // A station was destroyed that includes user
    socket.on("station_admin_destroyed", (response: { stationid: string }) => {
      this.logService.log("station_admin_destroyed", response);
      service.removeStation(response.stationid);
    });
    socket.on("station_member_destroyed", (response: { stationid: string }) => {
      this.logService.log("station_member_destroyed", response);
      service.removeStation(response.stationid);
    });
    // Invites & Reqyests
    socket.on(
      "station_admin_invite_sent",
      (response: { stationid: string; userids: string[] }) => {
        // used for notifying admins

        this.logService.log("station_admin_invite_sent emitted", response);
        response.userids.map(user_id => {
          store.dispatch(
            updateStation(response.stationid, "invited_list", user_id)
          );
        });
      }
    );
    socket.on(
      "station_admin_invite_accepted",
      (response: { stationid: string; userid: string }) => {
        this.logService.log("station_admin_invite_accepted", response);
        if (store.getState().users.users[response.userid]) {
          store.dispatch(
            updateStation(response.stationid, "accept_invite", response.userid)
          );
        } else {
          this.userService.getUsers(
            new UserFilterOptions([response.userid]),
            () => {
              store.dispatch(
                updateStation(
                  response.stationid,
                  "accept_invite",
                  response.userid
                )
              );
            }
          );
        }
      }
    );
    socket.on(
      "station_admin_invite_rejected",
      (response: { stationid: string; userid: string }) => {
        this.logService.log("station_admin_invite_rejected", response);
        store.dispatch(
          updateStation(response.stationid, "reject_invite", response.userid)
        );
      }
    );
    socket.on("station_admin_request_received", () => {});
    socket.on("station_admin_request_accepted", () => {});
    socket.on(
      "station_admin_request_rejected",
      (response: { stationid: string; userid: string }) => {
        this.logService.log("station_admin_request_rejected", response);
        store.dispatch(
          updateStation(response.stationid, "reject_invite", response.userid)
        );
      }
    );
    socket.on(
      "station_user_invite_received",
      (response: { station: IStation }) => {
        this.logService.log("station_user_invite_received", response);
        const station = this.convertToBusinessStation(response.station);
        // service.loadStationData([station]);
        store.dispatch(receiveStation(station));
        store.dispatch(receiveStationInvite(station.id));
      }
    );
    socket.on(
      "station_user_invite_accepted",
      (response: { stationid: string; userid: string }) => {
        this.logService.log("station_user_invite_accepted", response);
        // store.dispatch(updateStation(response.stationid, 'accept_invite', response.userid));
        store.dispatch(removeStationInvite(response.stationid));
      }
    );
    socket.on(
      "station_user_invite_rejected",
      (response: { stationid: string; userids: string[] }) => {
        this.logService.log("station_user_invite_rejected", response);
        response.userids.forEach(userid => {
          store.dispatch(
            updateStation(response.stationid, "reject_invite", userid)
          );
        });
        store.dispatch(removeStationInvite(response.stationid));
      }
    );
    socket.on("station_user_request_sent", () => {});
    socket.on("station_user_request_rejected", () => {});
    socket.on("station_user_request_accepted", () => {});
    socket.on(
      "station_user_invite_destroyed",
      (response: { stationid: string }) => {
        store.dispatch(removeStationInvite(response.stationid));
      }
    );
    socket.on("station_user_request_destroyed", () => {
      this.logService.log("station_user_request_destroyed");
    });
    // Member Addition / Removal
    socket.on(
      "station_member_member_added",
      (response: { stationid: string; userid: string }) => {
        this.logService.log("station_member_member_added", response);

        if (store.getState().users.users[response.userid]) {
          store.dispatch(
            updateStation(response.stationid, "accept_invite", response.userid)
          );
        } else {
          this.userService.getUsers(
            new UserFilterOptions([response.userid]),
            () => {
              store.dispatch(
                updateStation(
                  response.stationid,
                  "accept_invite",
                  response.userid
                )
              );
            }
          );
        }
      }
    );
    socket.on(
      "station_member_member_removed",
      (response: { stationid: string; userids: string[] }) => {
        this.logService.log("station_member_member_removed", response);
        store.dispatch(
          updateStation(response.stationid, "remove_member", response.userids)
        );
      }
    );
    socket.on(
      "station_user_withdrawn",
      (response: { stationid: string; mids: string[]; userids: string[] }) => {
        this.logService.log("station_user_withdrawn", response);
        const currentUserId = store.getState().users.currentUser.user_id;
        if (response.userids.includes(currentUserId)) {
          service.removeStation(response.stationid);
        }
      }
    );
    socket.on(
      "station_admin_member_removed",
      (response: { stationid: string; userids: string[] }) => {
        this.logService.log("station_admin_member_removed", response);
        store.dispatch(
          updateStation(response.stationid, "remove_member", response.userids)
        );
      }
    );
    socket.on("station_user_expelled", (response: { stationid: string }) => {
      this.logService.log("station_user_expelled", response);
      service.removeStation(response.stationid);
    });
    // Machine addition / removal
    socket.on(
      "station_admin_machine_removed",
      (response: { stationid: string; mids: string[] }) => {
        this.logService.log("station_admin_machine_removed", response);
        store.dispatch(
          updateStation(response.stationid, "remove_machines", response.mids)
        );
      }
    );
    socket.on(
      "station_admin_machine_added",
      async (response: { stationid: string; mids: string[] }) => {
        this.logService.log("station_admin_machine_added", response);
        await this.machineService.getMachines(
          new GetMachinesFilter(response.mids)
        );
        store.dispatch(
          updateStation(response.stationid, "add_machines", response.mids)
        );
      }
    );
    socket.on(
      "station_member_machine_removed",
      (response: { stationid: string; mids: string[] }) => {
        this.logService.log("station_member_machine_removed", response);
        store.dispatch(
          updateStation(response.stationid, "remove_machines", response.mids)
        );
      }
    );
    socket.on(
      "station_member_machine_added",
      async (response: { stationid: string; mids: string[] }) => {
        this.logService.log("station_admin_machine_removed", response);
        await this.machineService.getMachines(
          new GetMachinesFilter(response.mids)
        );
        store.dispatch(
          updateStation(response.stationid, "add_machines", response.mids)
        );
      }
    );
    // Volumes
    socket.on(
      "station_admin_volume_added",
      (response: { stationid: string; volumes: Dictionary<IVolume> }) => {
        this.logService.log("station_admin_volume_added", response);
        const volumes = Object.keys(response.volumes).map(volumeid => {
          return this.convertToBusinessVolume(response.volumes[volumeid]);
        });
        store.dispatch(
          updateStation(response.stationid, "add_volume", volumes)
        );
      }
    );
    socket.on(
      "station_admin_volume_removed",
      (response: { stationid: string; volume_names: string[] }) => {
        this.logService.log("station_admin_volume_removed", response);
        store.dispatch(
          updateStation(
            response.stationid,
            "remove_volume",
            response.volume_names
          )
        );
      }
    );
    socket.on(
      "station_member_volume_added",
      (response: { stationid: string; volumes: Dictionary<IVolume> }) => {
        this.logService.log("station_member_volume_added", response);
        const volumes = Object.keys(response.volumes).map(volumeid => {
          return this.convertToBusinessVolume(response.volumes[volumeid]);
        });
        store.dispatch(
          updateStation(response.stationid, "add_volume", volumes)
        );
      }
    );
    socket.on(
      "station_member_volume_removed",
      (response: { stationid: string; volume_names: string[] }) => {
        this.logService.log("station_member_volume_removed", response);
        store.dispatch(
          updateStation(
            response.stationid,
            "remove_volume",
            response.volume_names
          )
        );
      }
    );
    socket.on(
      "station_admin_volume_host_path_added",
      (response: { stationid: string; volumes: Dictionary<IVolume> }) => {
        this.logService.log("station_admin_volume_host_path_added", response);
        const volumes = Object.keys(response.volumes).map(volumeid => {
          return this.convertToBusinessVolume(response.volumes[volumeid]);
        });
        const volumesObject: Dictionary<Volume> = {};
        volumes.forEach(volume => {
          volumesObject[volume.volume_id] = volume;
        });
        store.dispatch(
          updateStation(response.stationid, "update_volume", volumesObject)
        );
      }
    );
    socket.on(
      "station_member_volume_host_path_added",
      (response: { stationid: string; volumes: Dictionary<IVolume> }) => {
        this.logService.log("station_member_volume_host_path_added", response);
        const volumes = Object.keys(response.volumes).map(volumeid => {
          return this.convertToBusinessVolume(response.volumes[volumeid]);
        });
        const volumesObject: Dictionary<Volume> = {};
        volumes.forEach(volume => {
          volumesObject[volume.volume_id] = volume;
        });
        store.dispatch(
          updateStation(response.stationid, "update_volume", volumesObject)
        );
      }
    );
    socket.on("station_admin_volume_host_path_removed", (response: any) => {
      this.logService.log("station_admin_volume_host_path_removed", response);
    });
    socket.on("station_member_volume_host_path_removed", (response: any) => {
      this.logService.log("station_member_volume_host_path_removed", response);
    });
    // Station updates
    socket.on(
      "station_member_station_updated",
      (response: { station: IStation }) => {
        this.logService.log("station_member_station_updated", response);
        store.dispatch(
          receiveStation(this.convertToBusinessStation(response.station))
        );
      }
    );
    socket.on(
      "station_admin_station_updated",
      (response: { station: IStation }) => {
        this.logService.log("station_admin_station_updated", response);
        store.dispatch(
          receiveStation(this.convertToBusinessStation(response.station))
        );
      }
    );
  }

  protected convertToBusinessJob(job: IJob) {
    const statusHistory = job.status_history.map(status_history => {
      return new JobStatus(
        status_history.jobid,
        status_history.jobstatusid,
        status_history.status,
        status_history.timestamp
      );
    });
    return new Job(
      job.container,
      job.jobid,
      job.last_updated,
      job.name,
      job.oaid,
      job.pay_interval,
      job.pay_status,
      job.receiverid,
      job.userid,
      job.state,
      job.stationid,
      job.status,
      statusHistory,
      job.time_created,
      job.total_runtime,
      job.archived
    );
  }

  protected openJobEndpoints(socket: ISocket, service: IJobService) {
    socket.on("job_landing_zone_submitted", (job: IJob) => {
      this.logService.log("job_landing_zone_submitted", job);
      service.updateReceivedJob(this.convertToBusinessJob(job));
    });

    socket.on("job_launcher_submitted", (response: { job: IJob }) => {
      this.logService.log("job_launcher_submitted", response);
      service.updateSentJob(this.convertToBusinessJob(response.job));
    });

    socket.on("job_launcher_updated", (response: { job: IJob }) => {
      this.logService.log("job_launcher_updated", response);
      service.updateSentJob(this.convertToBusinessJob(response.job));
    });

    socket.on("job_landing_zone_updated", (response: { job: IJob }) => {
      this.logService.log("job_landing_zone_updated", response);
      service.updateReceivedJob(this.convertToBusinessJob(response.job));
    });

    socket.on("station_job_updated", (response: { job: IJob }) => {
      this.logService.log("station_job_updated", response);
      const job = this.convertToBusinessJob(response.job);
      const currentUser = store.getState().users.currentUser;
      store.dispatch(receiveStationJob(response.job.stationid, job));
      if (currentUser.mids.includes(job.landing_zone)) {
        // TODO: FIX THIS
        // store.dispatch(receiveReceivedJobs({ [job.id]: job }));
      }
    });

    // socket.on("top", (response: { job: IJob; logs: DockerLog }) => {
    //   this.logService.log("top", response);
    //   this.onJobsTop.emit(new JobsTop(response.job, response.logs));
    // });
    //
    // socket.on("logs", (response: { job: IJob; container_logs: string }) => {
    //   this.logService.log("logs", response);
    //   // this.convertToBusinessJob(job);
    //   // store.dispatch(openNotificationModal("Job Log", response.container_logs));
    //   this.onJobsLog.emit(new JobsLog(response.job, response.container_logs));
    // });
  }
  protected openMachineEndpoints(socket: ISocket, service: IMachineService) {
    socket.on(
      "machine/status_updated",
      (response: { mid: string; status: string }) => {
        this.logService.log("machine/status_updated", response);
        store.dispatch(updateMachineStatus(response.mid, response.status));
      }
    );
    socket.on("machine/registered", (response: { machine: IMachine }) => {
      this.logService.log("machine/registered", response);
      const machine = convertToBusinessMachine([response.machine])[0];
      store.dispatch(receiveMachine(machine));
      store.dispatch(updateCurrentUser("mids", machine));
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
  status: EJobStatus;
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
