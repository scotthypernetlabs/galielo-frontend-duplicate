import { IOfferRepository } from '../interfaces/IOfferRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IOffer } from '../../business/objects/offers';

export class OfferRepository implements IOfferRepository {
  protected backend: string;
  constructor(protected requestRepository:IRequestRepository, protected settings:ISettingsRepository){
    this.backend = this.settings.getSettings().backend;
  }
  public getOffers(){
    return this.requestRepository.request(`${this.backend}/offers`)
      .then((response:IGetOfferResponse) => {
        return response.data.offers;
      });
  }
}

export interface IGetOfferResponse {
  data: { offers: IOffer[]};
}
