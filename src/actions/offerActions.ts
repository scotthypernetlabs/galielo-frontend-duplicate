import { Action } from 'redux';
import { IOffer } from '../business/objects/offers';

export const RECEIVE_OFFERS = "RECEIVE_OFFERS";
export type RECEIVE_OFFERS = typeof RECEIVE_OFFERS;

export interface IReceiveOffers extends Action {
  type: RECEIVE_OFFERS;
  offers: IOffer[];
}

export type OfferActions = IReceiveOffers;

export const receiveOffers = (offers: IOffer[]): IReceiveOffers => {
  return { type: RECEIVE_OFFERS, offers }
}
