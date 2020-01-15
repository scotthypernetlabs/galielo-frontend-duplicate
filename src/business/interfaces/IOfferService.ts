export interface IOfferService {
  updateOffers(filters?: any, offer_id?: string, status?: string): Promise<void>;
}
