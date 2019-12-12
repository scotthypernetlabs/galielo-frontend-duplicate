import { Action } from 'redux';
import { IStation } from '../business/objects/station';

export const RECEIVE_STATION = "RECEIVE_STATION";
export type RECEIVE_STATION = typeof RECEIVE_STATION;

export const RECEIVE_STATIONS = "RECEIVE_STATIONS";
export type RECEIVE_STATIONS = typeof RECEIVE_STATIONS;

export interface IReceiveStation extends Action {
  type: RECEIVE_STATION;
  station: IStation;
}

export interface IReceiveStations extends Action {
  type: RECEIVE_STATIONS;
  stations: IStation[];
}

export type StationActions = IReceiveStations | IReceiveStation;

export const receiveStations = (stations: IStation[]) => {
  return { type: RECEIVE_STATIONS, stations}
}

export const receiveStation = (station: IStation) => {
  return { type: RECEIVE_STATION, station }
}
