import { IConsumerRepository } from "./data/interfaces/IConsumerRepository";
import { IAuthService } from "./business/interfaces/IAuthService";
import { ISettingsRepository } from "./data/interfaces/ISettingsRepository";
import { IProviderRepository } from "./data/interfaces/IProviderRepository";
import { ProviderRepository } from "./data/implementations/providerRepository";
import { ConsumerRepository } from "./data/implementations/consumerRepository";
import { Socket } from "./data/implementations/socket";
import { IMachineRepository } from "./data/interfaces/IMachineRepository";
import { IOfferRepository } from "./data/interfaces/IOfferRepository";
import { MachineRepository } from "./data/implementations/machineRepository";
import { IRequestRepository } from "./data/interfaces/IRequestRepository";
import { RequestRepository } from "./data/implementations/requestRepository";
import { OfferRepository } from "./data/implementations/offerRepository";
import { IOfferService } from "./business/interfaces/IOfferService";
import { OfferService } from "./business/implementations/OfferService";
import { Logger } from "./components/Logger";
import { IUserStateRepository } from "./data/interfaces/IUserStateRepository";
import { UserStateRepository } from "./data/implementations/userStateRepository";
import { IUserService } from './business/interfaces/IUserService';
import { UserService } from './business/implementations/UserService';
import { IUserRepository } from './data/interfaces/IUserRepository';
import { UserRepository } from './data/implementations/UserRepository';
import { IMachineService } from "./business/interfaces/IMachineService";
import { MachineService } from "./business/implementations/MachineService";
import { IStationRepository } from "./data/interfaces/IStationRepository";
import { StationRepository } from "./data/implementations/StationRepository";
import { IGalileoApi } from "./api/interfaces/IGalileoApi";
import { GalileoApi } from "./api/implementations/GalileoApi";
import { IStationService } from "./business/interfaces/IStationService";
import { StationService } from "./business/implementations/StationService";

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

    public offerService: IOfferService;
    public userService: IUserService;
    public machineService: IMachineService;
    public stationService: IStationService;

    public galileoAPI: IGalileoApi;

    initialize(settings: ISettingsRepository,
        auth_service: IAuthService
    ) {
        this.settings = settings;
        this.auth_service = auth_service;

        this.logger = new Logger(true);
        let token = auth_service.getToken();
        let settingsValues = settings.getSettings();
        this.requestRepository = new RequestRepository(this.auth_service);
        this.userStateRepository = new UserStateRepository();
        this.machineRepository = new MachineRepository(this.requestRepository,
          this.settings);
        this.offerRepository = new OfferRepository(this.requestRepository,
          this.settings);
        this.userRepository = new UserRepository(this.requestRepository, this.settings, this.machineRepository);
        this.stationRepository = new StationRepository(this.requestRepository, this.settings);

        this.offerService = new OfferService(this.logger,
          this.offerRepository,
          this.machineRepository);
        this.machineService = new MachineService(this.machineRepository, this.logger);
        this.userService = new UserService(this.userRepository, this.logger, this.machineRepository);
        this.stationService = new StationService(this.stationRepository, this.logger);
        if (token) {
          this.userService.getCurrentUser();
          let providerClass = new Socket(`${settingsValues.backend}/marketplace/provider`, token);
          let consumerClass = new Socket(`${settingsValues.backend}/marketplace/consumer`, token);
          this.providerRepository = new ProviderRepository(providerClass, this.offerService);
          this.consumerRepository = new ConsumerRepository(consumerClass);
          this.galileoAPI = new GalileoApi(providerClass, consumerClass, this.offerService, this.logger);
          this.galileoAPI.initialize();
        }

    }
}
