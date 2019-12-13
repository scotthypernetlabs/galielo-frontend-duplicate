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

export class OfferService implements IOfferService {
  protected backend: string;
  constructor(
    protected logService: Logger,
    protected offerRepository: IOfferRepository,
    protected machineRepository: IMachineRepository){
  }
  public onUpdateOffers(offer_id?: string, status?: string){
    // this.logService.log(`Offer request update with id=${offer_id} and status=${status}`);
    this.offerRepository.getOffers()
        .then( (offers:IOffer[]) => {
            store.dispatch(receiveOffers(offers));
            offers.forEach((offer:IOffer) => {
              offer.offer_machines.forEach( (mid:string) => {
                this.machineRepository.getMachine(mid)
                  .then((response:any) => {
                    store.dispatch(receiveMachine(response.machine));
                  })
                  .catch((err:Error) => {
                    this.logService.log(err);
                  })
              })
            })
        }).catch( (err:Error) => {
            this.logService.log(err);
        })
  }
}
