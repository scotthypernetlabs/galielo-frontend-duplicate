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
import { OfferService } from "./business/implementations/offerService";
import { Logger } from "./components/Logger";
import { IUserStateRepository } from "./data/interfaces/IUserStateRepository";
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

    public offerService: IOfferService;

    initialize(settings: ISettingsRepository,
        auth_service: IAuthService
    ) {
        this.settings = settings;
        this.auth_service = auth_service;
        
        this.logger = new Logger(true);
        let token = auth_service.getToken();
        if (token) {
            let settingsValues = settings.getSettings();
            let providerClass = new Socket(`${settingsValues.backend}/marketplace/provider`, token);
            let consumerClass = new Socket(`${settingsValues.backend}/marketplace/consumer`, token);
            this.providerRepository = new ProviderRepository(providerClass);
            this.consumerRepository = new ConsumerRepository(consumerClass);
        }

        this.requestRepository = new RequestRepository(this.auth_service);
        this.userStateRepository = new UserStateRepository();
        this.machineRepository = new MachineRepository(this.requestRepository,
            this.settings);
        this.offerRepository = new OfferRepository(this.requestRepository, 
            this.settings);

        this.offerService = new OfferService(this.logger,
            this.offerRepository, 
            this.machineRepository);
    }
}

