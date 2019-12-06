import { IOfferState, IOffer } from '../business/objects/offers';
import { Reducer } from 'redux';
import { OfferActions, RECEIVE_OFFERS } from '../actions/offerActions';

class OfferState implements IOfferState {
  constructor(public offers: IOffer[] = []){

  }
}

const offerReducer: Reducer<OfferState, OfferActions> = (state = new OfferState(), action:OfferActions) => {
  switch(action.type){
    case RECEIVE_OFFERS:
      return new OfferState(action.offers);
    default:
      return state;
  }
}

export default offerReducer;
