import { IStore } from "../business/objects/store";
import { Store, applyMiddleware, createStore } from "redux";
import rootReducer from "../reducers/rootReducer";
import thunk from "redux-thunk";

function configureStore(): Store<IStore> {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
  return store;
}

export default configureStore();
