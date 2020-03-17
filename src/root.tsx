import { IStore } from "./business/objects/store";
import { Provider } from "react-redux";
import { Store } from "redux";
import App from "./components/App";
import React from "react";

export interface RootProps {
  store: Store<IStore>;
  router: any;
}

export const Root = (props: RootProps) => (
  <Provider store={props.store}>
    <props.router>
      <App />
    </props.router>
  </Provider>
);
