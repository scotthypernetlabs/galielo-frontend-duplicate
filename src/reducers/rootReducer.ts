import { combineReducers, Reducer } from 'redux';
import offers from './offerReducer';
import { IStore } from '../business/objects/store';
import modal from './modalReducer';
import filter from './filterReducer';
import machines from './machinesReducer';
import users from './userReducer';

const rootReducer = combineReducers<IStore>({
  offers,
  modal,
  filter,
  machines,
  users
});

export default rootReducer;
