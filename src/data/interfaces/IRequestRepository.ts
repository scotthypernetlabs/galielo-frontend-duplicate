import request from 'request-promise';

export interface IRequestRepository {
  requestWithAuth(url:string, method?:string, bodyData?:Object):request.RequestPromise;
  request(url: string, method?: string, bodyData?: Object): request.RequestPromise;
}
