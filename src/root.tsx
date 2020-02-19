import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import { IStore } from './business/objects/store';
import { Store } from 'redux';


export interface RootProps { store: Store<IStore>; router: any }

export const Root = (props: RootProps ) => (
  <Provider store={ props.store }>
    <props.router>
      <App />
    </props.router>
  </Provider>
);
