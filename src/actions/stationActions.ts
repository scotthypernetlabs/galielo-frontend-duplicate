import { Action } from 'redux';
import { IStation, IStationInput } from '../business/objects/station';
import { IMachine } from '../business/objects/machine';

export const RECEIVE_STATION = "RECEIVE_STATION";
export type RECEIVE_STATION = typeof RECEIVE_STATION;

export const RECEIVE_STATIONS = "RECEIVE_STATIONS";
export type RECEIVE_STATIONS = typeof RECEIVE_STATIONS;

export const RECEIVE_STATION_MACHINE = "RECEIVE_STATION_MACHINE";
export type RECEIVE_STATION_MACHINE = typeof RECEIVE_STATION_MACHINE;

export const RECEIVE_STATION_INPUT = "RECEIVE_STATION_INPUT";
export type RECEIVE_STATION_INPUT = typeof RECEIVE_STATION_INPUT;

export interface IReceiveStation extends Action {
  type: RECEIVE_STATION;
  station: IStation;
}

export interface IReceiveStations extends Action {
  type: RECEIVE_STATIONS;
  stations: IStation[];
}

export interface IReceiveStationMachine extends Action {
  type: RECEIVE_STATION_MACHINE;
  machine: IMachine;
  station_id: string;
}

export interface IReceiveStationInput extends Action {
  type: RECEIVE_STATION_INPUT;
  station_input: IStationInput;
}

export type StationActions = IReceiveStations | IReceiveStation | IReceiveStationInput;

export const receiveStations = (stations: IStation[]) => {
  return { type: RECEIVE_STATIONS, stations}
}

export const receiveStation = (station: IStation) => {
  return { type: RECEIVE_STATION, station }
}

export const receiveStationInput = (station_input: IStationInput) => {
  return { type: RECEIVE_STATION_INPUT, station_input }
}
