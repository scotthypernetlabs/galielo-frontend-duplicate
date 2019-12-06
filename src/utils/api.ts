import { receiveOffers } from '../actions/offerActions';
import { requestWithAuth } from './auth';
import store from '../store/store';
import { IMachine } from '../business/objects/machine';
import { IUser } from '../business/objects/user';
import { IOffer } from '../business/objects/offers';
import { receiveMachine } from '../actions/machineActions';
import { receiveCurrentUser } from '../actions/userActions';
import { logService } from '../components/Logger';
import { settings } from '../context';
import request from 'request-promise';

const settingValues = settings.getSettings();
const backend = `${settingValues.backend}/v0/marketplace`;

export const listOffers = () => {
    request.get(`${backend}/offers`)
        .then(response => {
            store.dispatch(receiveOffers(response.data.offers));
            logService.log(response.data);
            response.data.offers.forEach((offer:IOffer) => {
              offer.offer_machines.forEach( (mid:any) => {
                getMachines(mid);
              })
            })
        }).catch(err => {
            logService.log(err);
        })
};

export const getMachines = (mid: string) => {
  requestWithAuth(`${backend}/machines/${mid}`, 'GET')
    .then((response:any) => {
      logService.log(response);
      store.dispatch(receiveMachine(response.machine));
    })
    .catch((err:Error) => {
      logService.log(err);
    })
}

export const getCurrentUser = () => {
  requestWithAuth(`${backend}/user`, 'GET')
    .then((response:IUser) => {
      response.mids.forEach((mid:string) => {
        getMachines(mid);
      })
      store.dispatch(receiveCurrentUser(response));
      logService.log(response);
    })
    .catch((err:Error) => {
      logService.log(err);
    })
}
