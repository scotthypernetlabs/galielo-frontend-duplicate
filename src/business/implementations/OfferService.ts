import { IOfferService } from '../interfaces/IOfferService';
import request from 'request-promise';
import { Logger } from '../../components/Logger';
import { ISettingsRepository } from '../../data/interfaces/ISettingsRepository';
import { IOfferRepository } from '../../data/interfaces/IOfferRepository';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import store from '../../store/store';
import { receiveOffers } from '../../actions/offerActions';
import { Offer } from '../objects/offers';
import { receiveMachine } from '../../actions/machineActions';
import { Machine, GetMachinesFilter } from '../objects/machine';

export class OfferService implements IOfferService {
  protected backend: string;
  constructor(
    protected logService: Logger,
    protected offerRepository: IOfferRepository,
    protected machineRepository: IMachineRepository){
  }
  public updateOffers(filters?: any, offer_id?: string, status?: string){
    return this.offerRepository.getOffers(filters)
        .then((offers:Offer[]) => {
            store.dispatch(receiveOffers(offers));
            offers.forEach((offer:Offer) => {
              return this.machineRepository.getMachines(new GetMachinesFilter(offer.offer_machines))
                .then((response:Machine[]) => {
                  response.forEach((machine:Machine) => {
                    store.dispatch(receiveMachine(machine));
                  })
                })
              })
        }).catch( (err:Error) => {
            this.logService.log(err);
        })
  }
}
