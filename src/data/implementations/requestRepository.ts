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
  requestGoogle(dest_mid: string, url: string = '', method: string = 'PUT', bodyData: File){
    const xmlRequest = new XMLHttpRequest();
    // Progress on transfers from server to client
    xmlRequest.upload.addEventListener("progress", (e: any) => {
      const percent = Math.floor((e.loaded / e.total) * 100);
      // store.dispatch(updateUploadProgress(dest_mid, percent));
    });

    // Transfer complete
    xmlRequest.addEventListener("load", (e: any) => {
      // store.dispatch(updateUploadProgress(dest_mid, 100));
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
    // xmlRequest.setRequestHeader('Content-Type', bodyData.type);
    xmlRequest.setRequestHeader('Content-Type', '');
    return xmlRequest.send(bodyData);
  }
  downloadResultFromServer(url: string = '', method: string = 'GET', filename: string){
    const xhr = new XMLHttpRequest();
    let token = this.authService.getToken();
    xhr.addEventListener('error', (e:any) => {
      const text = "Download failed";
      store.dispatch(openNotificationModal('Notificatons', text));
      console.log("Download fail", e);
    })
    xhr.addEventListener("abort", (e: any) => {
      const text = 'Uploading file aborted';
      store.dispatch(openNotificationModal('Notifications', text));
      console.log("transfer aborted", e);
    });
    xhr.open(method, url);
    xhr.responseType="arraybuffer";
    // xhr.setRequestHeader('filename', filename);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send();
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4) return;
        if(xhr.status >= 200 && xhr.status < 300){
          let blob = new Blob([xhr.response], {type: 'octet/stream'});
          let url = window.URL.createObjectURL(blob);
          const element = document.createElement('a');
          element.href = url;
          element.download = filename;
          element.click();
          window.URL.revokeObjectURL(url);
          resolve(xhr.response);
        }else{
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          })
        }
      }
    })
  }
  progressBarRequest(dest_mid: string, station_id: string, filename: string, directory_name: string, url: string = '', method: string = 'POST', bodyData: ArrayBuffer){
    const xmlRequest = new XMLHttpRequest();
    let actualData = new Uint8Array(bodyData);
    // Progress on transfers from server to client
    xmlRequest.upload.addEventListener("progress", (e: any) => {
      const percent = Math.floor((e.loaded / e.total) * 100);
      store.dispatch(updateUploadProgress(dest_mid, directory_name, percent));
    });

    // Transfer complete
    xmlRequest.addEventListener("load", (e: any) => {
      store.dispatch(updateUploadProgress(dest_mid, directory_name, 100));
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
    let token = this.authService.getToken();
    xmlRequest.open(method, url);
    xmlRequest.setRequestHeader('Content-Type', 'application/octet-stream');
    xmlRequest.setRequestHeader('filename', `${directory_name}`);
    xmlRequest.setRequestHeader('Authorization', `Bearer ${token}`);
    xmlRequest.send(actualData)
    return new Promise((resolve, reject) => {
      xmlRequest.onreadystatechange = function(){
        if(xmlRequest.readyState !== 4) return;
        if(xmlRequest.status >= 200 && xmlRequest.status < 300){
          console.log("Resolve request with status", xmlRequest.status);
          console.log("Response data", xmlRequest.response);
          resolve(xmlRequest.response);
        }else{
          reject({
            status: xmlRequest.status,
            statusText: xmlRequest.statusText
          })
        }
      }
    })
  }
}
