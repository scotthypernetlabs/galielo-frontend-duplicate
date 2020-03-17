import { IOfferState } from "../business/objects/store";
import { Offer } from "../business/objects/offers";
import { OfferActions, RECEIVE_OFFERS } from "../actions/offerActions";
import { Reducer } from "redux";

class OfferState implements IOfferState {
  constructor(public offers: Offer[] = []) {}
}

const offerReducer: Reducer<OfferState, OfferActions> = (
  state = new OfferState(),
  action: OfferActions
) => {
  switch (action.type) {
    case RECEIVE_OFFERS:
      return new OfferState(action.offers);
    default:
      return state;
  }
};

export default offerReducer;
