import { createStore, applyMiddleware, Store } from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import { IStore } from '../business/objects/store';

function configureStore(): Store<IStore> {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
  return store;
}


export default configureStore();
