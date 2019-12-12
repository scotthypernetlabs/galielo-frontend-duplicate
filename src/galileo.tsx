import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import './index.scss';
import 'antd/dist/antd.css';
import { IStore } from './business/objects/store';
import { Store } from 'redux';
import { ConsumerRepository } from './data/implementations/consumerRepository';
import { MachineRepository } from './data/implementations/machineRepository';
import { OfferRepository } from './data/implementations/offerRepository';
import { ProviderRepository } from './data/implementations/providerRepository';
import { RequestRepository } from './data/implementations/requestRepository';
import { SettingsRepository } from './data/implementations/settingsRepository';
import { Socket } from './data/implementations/socket';
import { GalileoApi } from './api/implementations/GalileoApi';
import { OfferService } from './business/implementations/offerService';

import { Root } from './root';

type Props = {
  router: any;
  auth: any;
  settings: any;
}

type State = {

}

let settings:any;
let auth_service:any;
let provider:any= null;
let profile:any = null;
let consumer:any = null;
let injectContext:any = null;

export const getSettings = () => {
  return settings;
}
export const getAuth = () => {
  return auth_service;
}

export const getContext = () => {
  return injectContext;
}

export class MyContext  {
  constructor(public settings: SettingsRepository,
    public auth_service: any,
    public providerRepository: ProviderRepository,
    public consumerRepository: ConsumerRepository
  ) { }
}


class GalileoFrontend extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  componentDidMount(){
    settings = this.props.settings;
    auth_service = this.props.auth;
    let token = auth_service.getToken();
    if(token){
      let settingsValues = settings.getSettings();
      let providerClass = new Socket(`${settingsValues.backend}/marketplace/provider`, token);
      let consumerClass = new Socket(`${settingsValues.backend}/marketplace/consumer`, token);
      provider = new ProviderRepository(providerClass);
      provider.openSocketEndpoints();
      consumer = new ConsumerRepository(consumerClass);
      consumer.openSocketEndpoints();
    }
    injectContext = React.createContext<MyContext>(new MyContext(settings, auth_service, provider, consumer));
  }
  render(){
    return(
      <Root store={store} router={this.props.router}/>
    )
  }
}

export default GalileoFrontend;
