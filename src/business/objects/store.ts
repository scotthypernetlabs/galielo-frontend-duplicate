import { IOfferState } from './offers';
import { IFilterState } from './filter';
import { IModalState } from './modal';
import { IMachineState } from './machine';
import { IUserState } from './user';

export interface IStore {
  readonly offers: IOfferState;
  readonly modal: IModalState;
  readonly filter: IFilterState;
  readonly machines: IMachineState;
  readonly users: IUserState;
}
