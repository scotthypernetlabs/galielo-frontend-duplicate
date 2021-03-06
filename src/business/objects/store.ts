import { IOfferState } from './offers';
import { IFilterState } from './filter';
import { IModalState } from './modal';
import { IMachineState } from './machine';
import { IUserState } from './user';
import { IStationState } from './station';
import { IJobState } from './job';

export interface IStore {
  readonly offers: IOfferState;
  readonly modal: IModalState;
  readonly filter: IFilterState;
  readonly machines: IMachineState;
  readonly users: IUserState;
  readonly stations: IStationState;
  readonly jobs: IJobState;
}
