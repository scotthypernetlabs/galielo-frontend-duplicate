import { IStationState, IStation } from '../business/objects/station';
import { Dictionary } from '../business/objects/dictionary';

import { StationActions, RECEIVE_STATION, RECEIVE_STATIONS } from '../actions/stationActions';
import { Reducer } from 'redux';

class StationState implements IStationState {
  constructor(
    public stations: Dictionary<IStation> = {}
  ){

  }
}

const stationReducer: Reducer<StationState, StationActions> = (state = new StationState(), action:StationActions) => {
  switch(action.type){
    case RECEIVE_STATION:
      return {...state, stations: {...state.stations, [action.station.id]: action.station } };
    case RECEIVE_STATIONS:
      let stationObject:Dictionary<IStation> = {};
        action.stations.forEach((station) => {
          stationObject[station.id] = station;
        })
      return {...state, stations: stationObject };
    default:
      return state;
  }
}

export default stationReducer;
