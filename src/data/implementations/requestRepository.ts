import { IRequestRepository } from '../interfaces/IRequestRepository';
import request from 'request-promise';
import { RequiredUriUrl } from 'request';

export class RequestRepository implements IRequestRepository {
  constructor(protected authService: any){

  }
  requestWithAuth(url: string='', method:string='GET', bodyData:Object={}){
    let token = this.authService.getToken();
    const options = {
      headers: { Authorization: `Bearer ${token}`},
      json: true,
      method,
      url,
      body: bodyData
    } as RequiredUriUrl;
    return request(options);
  }
  request(url: string='', method:string='GET', bodyData: Object={}){
    const options = {
      json: true,
      method,
      url,
      body: bodyData
    } as RequiredUriUrl;
    return request(options);
  }
}
