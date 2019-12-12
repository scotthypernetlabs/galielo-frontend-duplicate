import { IOffer } from '../../business/objects/offers';

export interface IOfferRepository {
  getOffers(): Promise<IOffer[]>;
}
