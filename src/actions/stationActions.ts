import { Action } from 'redux';
import { Station, StationInput } from '../business/objects/station';
import { Machine } from '../business/objects/machine';
import { IReceiveStationInvites } from './userActions';

export const RECEIVE_STATION = "RECEIVE_STATION";
export type RECEIVE_STATION = typeof RECEIVE_STATION;

export const RECEIVE_STATIONS = "RECEIVE_STATIONS";
export type RECEIVE_STATIONS = typeof RECEIVE_STATIONS;

export const RECEIVE_STATION_MACHINE = "RECEIVE_STATION_MACHINE";
export type RECEIVE_STATION_MACHINE = typeof RECEIVE_STATION_MACHINE;

export const RECEIVE_STATION_INPUT = "RECEIVE_STATION_INPUT";
export type RECEIVE_STATION_INPUT = typeof RECEIVE_STATION_INPUT;

export const REMOVE_STATION = "REMOVE_STATION";
export type REMOVE_STATION = typeof REMOVE_STATION;

export const UPDATE_STATION = "UPDATE_STATION";
export type UPDATE_STATION = typeof UPDATE_STATION;

export const RECEIVE_SELECTED_STATION = "RECEIVE_SELECTED_STATION";
export type RECEIVE_SELECTED_STATION = typeof RECEIVE_SELECTED_STATION;

export interface IReceiveStation extends Action {
  type: RECEIVE_STATION;
  station: Station;
}

export interface IReceiveStations extends Action {
  type: RECEIVE_STATIONS;
  stations: Station[];
}

export interface IReceiveStationMachine extends Action {
  type: RECEIVE_STATION_MACHINE;
  machine: Machine;
  station_id: string;
}

export interface IReceiveStationInput extends Action {
  type: RECEIVE_STATION_INPUT;
  station_input: StationInput;
}

export interface IRemoveStation extends Action {
  type: REMOVE_STATION;
  station_id: string;
}

export interface IUpdateStation extends Action {
  type: UPDATE_STATION;
  station_id: string;
  key: string;
  value: any;
}

export interface IReceiveSelectedStation extends Action {
  type: RECEIVE_SELECTED_STATION;
  station: Station;
}

export type StationActions = IReceiveStations
| IReceiveStation
| IReceiveStationInput
| IRemoveStation 
| IUpdateStation
| IReceiveSelectedStation;

export const receiveStations = (stations: Station[]) => {
  return { type: RECEIVE_STATIONS, stations}
}

export const receiveStation = (station: Station) => {
  return { type: RECEIVE_STATION, station }
}

export const receiveStationInput = (station_input: StationInput) => {
  return { type: RECEIVE_STATION_INPUT, station_input }
}

export const removeStation = (station_id: string) => {
  return { type: REMOVE_STATION, station_id }
}

export const updateStation = (station_id: string, key: string, value: any) => {
  return { type: UPDATE_STATION, station_id, key, value };
}

export const receiveSelectedStation = (station: Station) => {
  return { type: RECEIVE_SELECTED_STATION, station }
}
