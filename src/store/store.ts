import { createStore, applyMiddleware, compose, Store } from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import { IStore } from '../business/objects/store';

function configureStore(): Store<IStore> {
  const store = createStore(
    rootReducer,
    undefined,
    compose(
      applyMiddleware(thunk),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
  return store;
}

export default configureStore();
