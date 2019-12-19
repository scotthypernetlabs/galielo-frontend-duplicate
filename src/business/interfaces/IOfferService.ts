export interface IOfferService {
  updateOffers(offer_id?: string, status?: string): Promise<void>;
}
