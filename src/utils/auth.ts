import request from 'request-promise';
import store from '../store/store';
import { RequiredUriUrl, CoreOptions} from 'request';
import { getAuth } from '../galileo';


export const requestWithAuth = (url:string='', method:string = "GET", bodyData:Object = {}) => {
  const requestPromise = new RequestPromise();
  let token = getAuth().getToken();
  const options = {
    headers: { Authorization: `Bearer ${token}`},
    json: true,
    method,
    url,
    body: bodyData
  } as RequiredUriUrl;
  return requestPromise.makeRequest(options);
}

export class RequestPromise {
  constructor(){
  }
  makeRequest(options: RequiredUriUrl & CoreOptions){
    return request(options);
  }
}

export const loggedIn = (resolve:Function, reject:Function) => {
  let state = store.getState();
  if(state.users.currentUser.user_id){
    resolve();
  }else{
    reject();
  }
}

export const hasWallet = (resolve:Function, reject:Function) => {
  let state = store.getState();
  if(state.users.currentUser.wallet){
    resolve();
  }else{
    reject();
  }
}
