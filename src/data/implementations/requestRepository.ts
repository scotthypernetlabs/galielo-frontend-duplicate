import { IRequestRepository } from '../interfaces/IRequestRepository';
import request from 'request-promise';
import { RequiredUriUrl } from 'request';
import { IAuthService } from '../../business/interfaces/IAuthService';
import store from '../../store/store';
import { updateUploadProgress } from '../../actions/machineActions';
import { openNotificationModal } from '../../actions/modalActions'


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
  requestGoogle(dest_mid: string, url: string = '', method: string = 'PUT', bodyData: Blob){
    const xmlRequest = new XMLHttpRequest();

    // Progress on transfers from server to client
    xmlRequest.upload.addEventListener("progress", (e: any) => {
      const percent = Math.floor((e.loaded / e.total) * 100);
      store.dispatch(updateUploadProgress(dest_mid, percent));
    });

    // Transfer complete
    xmlRequest.addEventListener("load", (e: any) => {
      store.dispatch(updateUploadProgress(dest_mid, 100));
    });

    // Transfer failed
    xmlRequest.addEventListener("error", (e: any) => {
      const text = 'Uploading file failed';
      store.dispatch(openNotificationModal('Notifications', text));
      console.log("transfer failed", e);
    });

    // Transfer canceled
    xmlRequest.addEventListener("abort", (e: any) => {
      const text = 'Uploading file aborted';
      store.dispatch(openNotificationModal('Notifications', text));
      console.log("transfer aborted", e);
    });

    xmlRequest.open("PUT", url);
    xmlRequest.setRequestHeader('Content-Type', '');

    return xmlRequest.send(bodyData);
  }
}
