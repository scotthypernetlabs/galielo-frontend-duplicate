import { IOffer } from '../../business/objects/offers';

export interface IOfferRepository {
  getOffers(filters?: any): Promise<IOffer[]>;
}
