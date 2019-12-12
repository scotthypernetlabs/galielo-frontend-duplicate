import { IRequestRepository } from '../interfaces/IRequestRepository';
import request from 'request-promise';
import { RequiredUriUrl } from 'request';
import { IAuthService } from '../../business/interfaces/IAuthService';

export class RequestRepository implements IRequestRepository {
  constructor(protected authService: IAuthService) {

  }
  requestWithAuth(url: string = '', method: string = 'GET', bodyData: Object = {}) {
    let token = this.authService.getToken();
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      json: true,
      method,
      url,
      body: bodyData
    } as RequiredUriUrl;
    return Promise.resolve(request(options));
  }
  request(url: string = '', method: string = 'GET', bodyData: Object = {}) {
    const options = {
      json: true,
      method,
      url,
      body: bodyData
    } as RequiredUriUrl;
    return Promise.resolve(request(options));
  }
}
