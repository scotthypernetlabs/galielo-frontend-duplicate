import { IOfferService } from '../interfaces/IOfferService';
import request from 'request-promise';
import { Logger } from '../../components/Logger';
import { ISettingsRepository } from '../../data/interfaces/ISettingsRepository';
import { IOfferRepository } from '../../data/interfaces/IOfferRepository';
import { IMachineRepository } from '../../data/interfaces/IMachineRepository';
import store from '../../store/store';
import { receiveOffers } from '../../actions/offerActions';
import { IOffer } from '../objects/offers';
import { receiveMachine } from '../../actions/machineActions';
import { IMachine } from '../objects/machine';

export class OfferService implements IOfferService {
  protected backend: string;
  constructor(
    protected logService: Logger,
    protected offerRepository: IOfferRepository,
    protected machineRepository: IMachineRepository){
  }
  public updateOffers(filters?: any, offer_id?: string, status?: string){
    return this.offerRepository.getOffers(filters)
        .then((offers:IOffer[]) => {
            store.dispatch(receiveOffers(offers));
            offers.forEach((offer:IOffer) => {
              return this.machineRepository.getMachines(offer.offer_machines)
                .then((response:IMachine[]) => {
                  console.log(response);
                  response.forEach((machine:IMachine) => {
                    store.dispatch(receiveMachine(machine));
                  })
                })
              })
        }).catch( (err:Error) => {
            this.logService.log(err);
        })
  }
}
