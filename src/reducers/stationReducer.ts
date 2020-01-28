import { Station, StationInput, Volume } from '../business/objects/station';
import { Dictionary } from '../business/objects/dictionary';
import { StationActions, RECEIVE_STATION, RECEIVE_STATIONS, RECEIVE_STATION_INPUT, REMOVE_STATION, UPDATE_STATION, RECEIVE_SELECTED_STATION } from '../actions/stationActions';
import { Reducer } from 'redux';
import { IStationState } from '../business/objects/store';
import { RECEIVE_STATION_INVITES } from '../actions/userActions';

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
      },
      public selectedStation:Station =
      {
        name: '',
        description: '',
        id: '',
        owner: '',
        admins: [],
        members: [],
        invited_list: [],
        pending_list: [],
        machines: [],
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
      return Object.assign({}, state, { stations: Object.assign({}, state.stations, stationObject) });
    case RECEIVE_STATION_INPUT:
      return Object.assign({}, state, { inputState: Object.assign({}, state.inputState, action.station_input) })
    case UPDATE_STATION:
      let updateStation = Object.assign({}, state.stations)[action.station_id];
      switch(action.key){
        case 'invited_list':
          updateStation.invited_list.push(action.value);
          break;
        case 'add_machines':
          action.value.forEach((mid:string) => {
            updateStation.machines.push(mid);
          })
          break;
        case 'remove_machines':
          updateStation.machines = updateStation.machines.filter(mid => action.value.indexOf(mid) < 0);
          break;
        case 'accept_invite':
          updateStation.invited_list = updateStation.invited_list.filter(mid => action.value !== mid);
          updateStation.members.push(action.value);
          break;
        case 'reject_invite':
          updateStation.invited_list = updateStation.invited_list.filter(mid => action.value !== mid);
          break;
        case 'remove_member':
          updateStation.members = updateStation.members.filter(user_id => action.value.indexOf(user_id) < 0);
          break;
        case 'add_volume':
          action.value.forEach((volume:Volume) => {
            updateStation.volumes.push(volume);
          })
          break;
        case 'remove_volume':
          action.value.forEach((volume_name: string) => {
            updateStation.volumes = updateStation.volumes.filter(volumeObject => volumeObject.name !== volume_name)
          })
          break;
        case 'update_volume':
          let keys = Object.keys(action.value);
          updateStation.volumes = updateStation.volumes.filter(volumeObject => keys.indexOf(volumeObject.volume_id) < 0);
          keys.forEach(key => {
            updateStation.volumes.push(action.value[key]);
          })
        default:
          break;
      }
      if(action.station_id === state.selectedStation.id){
        return Object.assign({}, state, { stations: Object.assign({}, state.stations, {[action.station_id]: updateStation}), selectedStation: updateStation})
      }
      return Object.assign({}, state, { stations: Object.assign({}, state.stations, {[action.station_id]: updateStation})})
    case RECEIVE_SELECTED_STATION:
      return Object.assign({}, state, { selectedStation: action.station })
    default:
      return state;
  }
}

export default stationReducer;
