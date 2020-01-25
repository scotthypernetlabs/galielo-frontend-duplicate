import { Offer } from './offers';
import { Query } from './modal';
import { Machine } from './machine';
import { User } from './user';
import { Station, StationInput } from './station';
import { Job, JobStatus } from './job';
import { Dictionary } from './dictionary';
import {ICloseModal} from "../../actions/modalActions";

export interface IStore {
  readonly offers: IOfferState;
  readonly modal: IModalState;
  readonly filter: IFilterState;
  readonly machines: IMachineState;
  readonly users: IUserState;
  readonly stations: IStationState;
  readonly jobs: IJobState;
}

export interface IStationState {
  readonly stations: Dictionary<Station>;
  readonly inputState: StationInput;
  readonly selectedStation: Station;
}

export interface IOfferState {
  readonly offers: Offer[];
}

export interface IFilterState {
  readonly [key:string]: number[];
  readonly gpu: number[];
  readonly processor: number[];
  readonly ram: number[];
  readonly clockspeed: number[];
  readonly price: number[];
}

export interface IModalState {
  readonly modal_name: string;
  readonly modal_text: string;
  readonly modal_query: Query;
}

export interface IMachineState {
  readonly machines: Dictionary<Machine>;
  readonly uploadProgress: Dictionary<number>;
  readonly currentUserMachines: Machine[];
}

export interface IUserState {
  readonly currentUser: User;
  readonly users: Dictionary<User>;
  readonly searchedUsers: User[];
  readonly receivedStationInvites: string[];
}

export interface IJobState {
  readonly receivedJobs: Dictionary<Job>;
  readonly sentJobs: Dictionary<Job>;
  readonly status_history: Dictionary<JobStatus[]>;
  readonly stationJobs: Dictionary<Dictionary<Job>>;
}
