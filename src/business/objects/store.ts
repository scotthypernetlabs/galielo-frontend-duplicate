import { Dictionary } from "./dictionary";
import { DockerInputState } from "./dockerWizard";
import { ICloseModal } from "../../actions/modalActions";
import { Job, JobStatus, UploadObjectContainer } from "./job";
import { Machine } from "./machine";
import { Offer } from "./offers";
import { Query } from "./modal";
import { Station, StationInput } from "./station";
import { User } from "./user";

export interface IStore {
  readonly offers: IOfferState;
  readonly modal: IModalState;
  readonly filter: IFilterState;
  readonly machines: IMachineState;
  readonly users: IUserState;
  readonly stations: IStationState;
  readonly jobs: IJobState;
  readonly docker: IDockerState;
  readonly ui: IUIState;
  readonly progress: IProgressState;
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
  readonly [key: string]: number[];
  readonly gpu: number[];
  readonly processor: number[];
  readonly ram: number[];
  readonly clockspeed: number[];
  readonly price: number[];
}

export interface IModalState {
  readonly modal_name: string;
  readonly modal_text: string;
  // currently kind of hacky since i'm using it to do some docker wiz stuff as well as actual query modals
  readonly modal_query: any;
}

export interface IMachineState {
  readonly machines: Dictionary<Machine>;
  readonly currentUserMachines: Machine[];
}

export interface IUIState {
  readonly loadFinished: boolean;
  readonly notificationsSelected: boolean;
}

export interface IUserState {
  readonly currentUser: User;
  readonly users: Dictionary<User>;
  readonly searchedUsers: User[];
  readonly receivedStationInvites: string[];
}

export interface IJobState {
  readonly jobsSelected: boolean;
  readonly receivedJobs: Dictionary<Job>;
  readonly sentJobs: Dictionary<Job>;
  readonly status_history: Dictionary<JobStatus[]>;
  readonly stationJobs: Dictionary<Dictionary<Job>>;
  readonly jobs: Dictionary<Job>;
}

export interface IDockerState {
  readonly inputState: DockerInputState;
}

export interface IProgressState {
  readonly stationUploads: Dictionary<UploadObjectContainer>;
  readonly machineUploads: Dictionary<UploadObjectContainer>;
}
