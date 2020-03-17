import { GetMachinesFilter, Machine } from "../objects/machine";
import { IMachineRepository } from "../../data/interfaces/IMachineRepository";
import { IOfferRepository } from "../../data/interfaces/IOfferRepository";
import { IOfferService } from "../interfaces/IOfferService";
import { ISettingsRepository } from "../../data/interfaces/ISettingsRepository";
import { Logger } from "../../components/Logger";
import { Offer } from "../objects/offers";
import { receiveMachine } from "../../actions/machineActions";
import { receiveOffers } from "../../actions/offerActions";
import request from "request-promise";
import store from "../../store/store";

export class OfferService implements IOfferService {
  protected backend: string;
  constructor(
    protected logService: Logger,
    protected offerRepository: IOfferRepository,
    protected machineRepository: IMachineRepository
  ) {}
  public updateOffers(filters?: any, offer_id?: string, status?: string) {
    return this.offerRepository
      .getOffers(filters)
      .then((offers: Offer[]) => {
        store.dispatch(receiveOffers(offers));
        offers.forEach((offer: Offer) => {
          return this.machineRepository
            .getMachines(new GetMachinesFilter(offer.offer_machines))
            .then((response: Machine[]) => {
              response.forEach((machine: Machine) => {
                store.dispatch(receiveMachine(machine));
              });
            });
        });
      })
      .catch((err: Error) => {
        this.logService.log(err);
      });
  }
}
