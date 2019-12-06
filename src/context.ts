import React from 'react';
import { SettingsRepository } from './implementations/settingsRepository';
import { AuthService } from './utils/auth-service';
import { Socket } from './implementations/socket';
import { ProviderRepository } from './implementations/providerRepository';
import { ConsumerRepository } from './implementations/consumerRepository';
import io from 'socket.io-client';
import { logService } from './components/Logger';

export const settings = new SettingsRepository();
export const auth_service = new AuthService(settings);
let provider = null;
let profile = null;
let consumer = null;

export const initialLoad = () => {
  logService.log("Initial load called");
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
}

initialLoad();

export class MyContext  {
  constructor(public settings: SettingsRepository,
    public auth_service: AuthService,
    public providerRepository: ProviderRepository,
    public consumerRepository: ConsumerRepository
  ) { }
}

export const injectContext = React.createContext<MyContext>(new MyContext(
  settings,
  auth_service,
  provider,
  consumer));
