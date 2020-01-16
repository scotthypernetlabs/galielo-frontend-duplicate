import { Station, StationInput } from '../business/objects/station';
import { Dictionary } from '../business/objects/dictionary';

import { StationActions, RECEIVE_STATION, RECEIVE_STATIONS, RECEIVE_STATION_INPUT, REMOVE_STATION } from '../actions/stationActions';
import { Reducer } from 'redux';
import { IStationState } from '../business/objects/store';

class StationState implements IStationState {
  constructor(
    public stations: Dictionary<Station> = {},
    public inputState: StationInput =
      {
        stationName: '',
        stationNameError: false,
        description: '',
        descriptionError: false,
        charsLeft: 200,
        volumeScreen: false,
        helpMode: false,
        mountPathErrors: [],
        context: '',
        volumes: []
      }
  ){

  }
}

const stationReducer: Reducer<StationState, StationActions> = (state = new StationState(), action:StationActions) => {
  switch(action.type){
    case RECEIVE_STATION:
      return Object.assign({}, state, {stations: Object.assign({}, state.stations, {[action.station.id]: action.station})});
    case REMOVE_STATION:
      let returnObject = Object.assign({}, state.stations);
      delete returnObject[`${action.station_id}`];
      return Object.assign({}, state, { stations: returnObject });
    case RECEIVE_STATIONS:
      let stationObject:Dictionary<Station> = {};
        action.stations.forEach((station) => {
          stationObject[station.id] = station;
        })
      return Object.assign({}, state, {stations: stationObject});
    case RECEIVE_STATION_INPUT:
      return Object.assign({}, state, { inputState: Object.assign({}, state.inputState, action.station_input) })
    default:
      return state;
  }
}

export default stationReducer;
