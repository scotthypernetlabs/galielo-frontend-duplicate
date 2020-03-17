import { IOfferRepository } from "../interfaces/IOfferRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { Offer } from "../../business/objects/offers";

export class OfferRepository implements IOfferRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }
  public getOffers(filters?: any) {
    let url = `${this.backend}/offers`;
    if (filters) {
      let appendedUrl: string = `?`;
      Object.keys(filters).forEach((key: string, idx: number) => {
        let filterString: string = "";
        if (idx > 0) {
          filterString += "&";
        }
        filterString += key;
        filterString += `=${filters[key]}`;
        appendedUrl += filterString;
      });
      url += appendedUrl;
    }
    return this.requestRepository
      .request(url)
      .then((response: IGetOfferResponse) => {
        return response.offers;
      });
  }
}

export interface IGetOfferResponse {
  offers: Offer[];
}
