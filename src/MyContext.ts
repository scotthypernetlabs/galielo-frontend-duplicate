import { ConsumerRepository } from "./data/implementations/consumerRepository";
import { GalileoApi } from "./api/implementations/GalileoApi";
import { IAuthService } from "./business/interfaces/IAuthService";
import { IConsumerRepository } from "./data/interfaces/IConsumerRepository";
import { IGalileoApi } from "./api/interfaces/IGalileoApi";
import { IJobRepository } from "./data/interfaces/IJobRepository";
import { IJobService } from "./business/interfaces/IJobService";
import { IMachineRepository } from "./data/interfaces/IMachineRepository";
import { IMachineService } from "./business/interfaces/IMachineService";
import { IOfferRepository } from "./data/interfaces/IOfferRepository";
import { IOfferService } from "./business/interfaces/IOfferService";
import { IProjectRepository } from "./data/interfaces/IProjectRepository";
import { IProviderRepository } from "./data/interfaces/IProviderRepository";
import { IRequestRepository } from "./data/interfaces/IRequestRepository";
import { ISettingsRepository } from "./data/interfaces/ISettingsRepository";
import { IStationRepository } from "./data/interfaces/IStationRepository";
import { IStationService } from "./business/interfaces/IStationService";
import { IUserRepository } from "./data/interfaces/IUserRepository";
import { IUserService } from "./business/interfaces/IUserService";
import { IUserStateRepository } from "./data/interfaces/IUserStateRepository";
import { JobRepository } from "./data/implementations/jobRepository";
import { JobService } from "./business/implementations/JobService";
import { Logger } from "./components/Logger";
import { MachineRepository } from "./data/implementations/machineRepository";
import { MachineService } from "./business/implementations/MachineService";
import { OfferRepository } from "./data/implementations/offerRepository";
import { OfferService } from "./business/implementations/OfferService";
import { ProjectRepository } from "./data/implementations/projectRepository";
import { ProviderRepository } from "./data/implementations/providerRepository";
import { RequestRepository } from "./data/implementations/requestRepository";
import { Socket } from "./data/implementations/socket";
import { StationRepository } from "./data/implementations/StationRepository";
import { StationService } from "./business/implementations/StationService";
import { UploadQueue } from "./business/objects/job";
import { UserRepository } from "./data/implementations/UserRepository";
import { UserService } from "./business/implementations/UserService";
import { UserStateRepository } from "./data/implementations/userStateRepository";

export class MyContext {
  public settings: ISettingsRepository;
  public auth_service: IAuthService;
  public logger: Logger;

  public providerRepository: IProviderRepository;
  public consumerRepository: IConsumerRepository;
  public machineRepository: IMachineRepository;
  public offerRepository: IOfferRepository;
  public requestRepository: IRequestRepository;
  public userStateRepository: IUserStateRepository;
  public userRepository: IUserRepository;
  public stationRepository: IStationRepository;
  public jobRepository: IJobRepository;
  public projectRepository: IProjectRepository;

  public offerService: IOfferService;
  public userService: IUserService;
  public machineService: IMachineService;
  public stationService: IStationService;
  public jobService: IJobService;

  public galileoAPI: IGalileoApi;
  public uploadQueue: UploadQueue;
  async initialize(settings: ISettingsRepository, auth_service: IAuthService) {
    this.settings = settings;
    this.auth_service = auth_service;
    this.uploadQueue = new UploadQueue();
    this.logger = new Logger(true);
    const token = await auth_service.getToken();
    const settingsValues = settings.getSettings();
    this.requestRepository = new RequestRepository(this.auth_service);
    this.userStateRepository = new UserStateRepository();
    this.machineRepository = new MachineRepository(
      this.requestRepository,
      this.settings
    );
    this.offerRepository = new OfferRepository(
      this.requestRepository,
      this.settings
    );
    this.userRepository = new UserRepository(
      this.requestRepository,
      this.settings,
      this.machineRepository
    );
    this.stationRepository = new StationRepository(
      this.requestRepository,
      this.settings
    );
    this.jobRepository = new JobRepository(
      this.requestRepository,
      this.settings
    );
    this.projectRepository = new ProjectRepository(
      this.requestRepository,
      this.settings
    );

    this.offerService = new OfferService(
      this.logger,
      this.offerRepository,
      this.machineRepository
    );
    this.machineService = new MachineService(
      this.machineRepository,
      this.logger
    );
    this.userService = new UserService(
      this.userRepository,
      this.logger,
      this.machineRepository
    );
    this.stationService = new StationService(
      this.stationRepository,
      this.machineRepository,
      this.userRepository,
      this.jobRepository,
      this.logger
    );
    this.jobService = new JobService(
      this.jobRepository,
      this.userRepository,
      this.machineRepository,
      this.requestRepository,
      this.projectRepository,
      this.logger
    );
    await this.initializeSockets();
  }
  initializeSockets() {
    return new Promise(async (resolve, reject) => {
      const token = await this.auth_service.getToken();
      if (token) {
        this.userService.getCurrentUser();
        const apiSocket = new Socket(
          `${this.settings.getSettings().backend}/galileo/user_interface/v1`,
          token
        );
        apiSocket.on("connect_error", (error: any) => {
          // console.log("Connect error");
          // console.log(error);
          apiSocket.close();
          this.initializeSockets();
        });
        apiSocket.on("connect", () => {
          // console.log("Connected");
        });
        apiSocket.on("disconnect", () => {
          // console.log("Disconnected");
        });
        this.providerRepository = new ProviderRepository(
          apiSocket,
          this.offerService
        );
        this.consumerRepository = new ConsumerRepository(apiSocket);
        this.galileoAPI = new GalileoApi(
          apiSocket,
          this.offerService,
          this.stationService,
          this.machineService,
          this.userService,
          this.jobService,
          this.logger
        );
        this.galileoAPI.initialize();
        resolve();
      } else {
        reject();
      }
    });
  }
}
