import { IStore } from "../business/objects/store";
import { Reducer, combineReducers } from "redux";
import docker from "./dockerReducer";
import filter from "./filterReducer";
import jobs from "./jobReducer";
import machines from "./machinesReducer";
import modal from "./modalReducer";
import offers from "./offerReducer";
import progress from "./progressReducer";
import stations from "./stationReducer";
import ui from "./uiReducer";
import users from "./userReducer";

const rootReducer = combineReducers<IStore>({
  offers,
  modal,
  filter,
  machines,
  users,
  stations,
  jobs,
  docker,
  ui,
  progress
});

export default rootReducer;
