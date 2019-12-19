import { combineReducers, Reducer } from 'redux';
import offers from './offerReducer';
import { IStore } from '../business/objects/store';
import modal from './modalReducer';
import filter from './filterReducer';
import machines from './machinesReducer';
import users from './userReducer';
import stations from './stationReducer';
import jobs from './jobReducer';

const rootReducer = combineReducers<IStore>({
  offers,
  modal,
  filter,
  machines,
  users,
  stations,
  jobs
});

export default rootReducer;
