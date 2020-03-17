import { Offer } from "../../business/objects/offers";

export interface IOfferRepository {
  getOffers(filters?: any): Promise<Offer[]>;
}
