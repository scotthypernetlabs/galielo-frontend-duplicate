import { Dictionary } from "../business/objects/dictionary";
import { IStationState } from "../business/objects/store";
import {
  RECEIVE_SELECTED_STATION,
  RECEIVE_STATION,
  RECEIVE_STATIONS,
  RECEIVE_STATION_INPUT,
  REMOVE_STATION,
  StationActions,
  UPDATE_STATION
} from "../actions/stationActions";
import { RECEIVE_STATION_INVITES } from "../actions/userActions";
import { Reducer } from "redux";
import { Station, StationInput, Volume } from "../business/objects/station";

class StationState implements IStationState {
  constructor(
    public stations: Dictionary<Station> = {},
    public inputState: StationInput = {
      stationName: "",
      stationNameError: false,
      description: "",
      descriptionError: false,
      charsLeft: 200,
      volumeScreen: false,
      helpMode: false,
      mountPathErrors: [],
      context: "",
      volumes: [],
      nameCharsLeft: 50
    },
    public selectedStation: Station = {
      name: "",
      description: "",
      id: "",
      owner: [],
      admins: [],
      members: [],
      invited_list: [],
      pending_list: [],
      machines: [],
      volumes: [],
      updated_timestamp: "",
      creation_timestamp: ""
    }
  ) {}
}

const stationReducer: Reducer<StationState, StationActions> = (
  state = new StationState(),
  action: StationActions
) => {
  switch (action.type) {
    case RECEIVE_STATION:
      return Object.assign({}, state, {
        stations: Object.assign({}, state.stations, {
          [action.station.id]: action.station
        })
      });
    case REMOVE_STATION:
      const returnObject = Object.assign({}, state.stations);
      delete returnObject[`${action.station_id}`];
      return Object.assign({}, state, { stations: returnObject });
    case RECEIVE_STATIONS:
      const stationObject: Dictionary<Station> = {};
      action.stations.forEach(station => {
        stationObject[station.id] = station;
      });
      return Object.assign({}, state, {
        stations: Object.assign({}, state.stations, stationObject)
      });
    case RECEIVE_STATION_INPUT:
      return Object.assign({}, state, {
        inputState: Object.assign({}, state.inputState, action.station_input)
      });
    case UPDATE_STATION:
      const updateStation = Object.assign({}, state.stations)[
        action.station_id
      ];
      switch (action.key) {
        case "invited_list":
          if (!updateStation.invited_list.includes(action.value)) {
            updateStation.invited_list.push(action.value);
          }
          break;
        case "add_machines":
          action.value.forEach((mid: string) => {
            updateStation.machines.push(mid);
          });
          break;
        case "remove_machines":
          updateStation.machines = updateStation.machines.filter(
            mid => action.value.indexOf(mid) < 0
          );
          break;
        case "accept_invite":
          updateStation.invited_list = [...updateStation.invited_list].filter(
            mid => action.value !== mid
          );
          if (!updateStation.members.includes(action.value)) {
            updateStation.members.push(action.value);
          }
          break;
        case "reject_invite":
          updateStation.invited_list = [...updateStation.invited_list].filter(
            mid => action.value !== mid
          );
          break;
        case "remove_member":
          updateStation.members = updateStation.members.filter(
            user_id => action.value.indexOf(user_id) < 0
          );
          // updateStation.machines = updateStation.machines.filter(mid => action.value.mids.indexOf())
          break;
        case "add_volume":
          action.value.forEach((volume: Volume) => {
            updateStation.volumes.push(volume);
          });
          break;
        case "remove_volume":
          action.value.forEach((volume_name: string) => {
            updateStation.volumes = updateStation.volumes.filter(
              volumeObject => volumeObject.name !== volume_name
            );
          });
          break;
        case "update_volume":
          const keys = Object.keys(action.value);
          // filter out volumes to update from array of volumes
          updateStation.volumes = updateStation.volumes.filter(
            volumeObject => keys.indexOf(volumeObject.volume_id) < 0
          );
          // add them back to the volumes list
          keys.forEach(key => {
            updateStation.volumes.push(action.value[key]);
          });
        default:
          break;
      }
      if (action.station_id === state.selectedStation.id) {
        return Object.assign({}, state, {
          stations: Object.assign({}, state.stations, {
            [action.station_id]: updateStation
          }),
          selectedStation: Object.assign({}, updateStation)
        });
      }
      return Object.assign({}, state, {
        stations: Object.assign({}, state.stations, {
          [action.station_id]: updateStation
        })
      });
    case RECEIVE_SELECTED_STATION:
      return Object.assign({}, state, { selectedStation: action.station });
    default:
      return state;
  }
};

export default stationReducer;
