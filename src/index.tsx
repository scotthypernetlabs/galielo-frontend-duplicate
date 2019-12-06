import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import './index.scss';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import App from './components/App';
import { IStore } from './business/objects/store';
import { Store } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom';

// ReactDOM.render(<Root store={store} />,document.getElementById("root"));
export interface RootProps { store: Store<IStore>; router: any }

export const Root = (props: RootProps ) => (
  <Provider store={ props.store }>
    <props.router>
      <App />
    </props.router>
  </Provider>
);

type Props = {

}

type State = {

}

class GalileoFrontend extends React.Component<Props, State> {
  render(){
    return(
      <Root store={store} router={Router}/>
    )
  }
}

export default GalileoFrontend;
