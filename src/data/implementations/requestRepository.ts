import { IRequestRepository } from '../interfaces/IRequestRepository';
import request from 'request-promise';
import { RequiredUriUrl } from 'request';
import { IAuthService } from '../../business/interfaces/IAuthService';
import store from '../../store/store';
import { openNotificationModal } from '../../actions/modalActions'
import { UploadObjectContainer, UploadObject } from '../../business/objects/job';


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
  progressBarRequest(station_id: string, filename: string,
    directory_name: string, url: string = '', uploadObjectContainer: UploadObjectContainer, method: string = 'POST', bodyData: File){
    return new Promise((resolve, reject) => {
      const xmlRequest = new XMLHttpRequest();
      let uploadObject = new UploadObject(xmlRequest, 0, 0, bodyData.size);
      uploadObjectContainer.addUploadingFile(uploadObject);
      xmlRequest.open(method, url);
      // Progress on transfers from server to client
      xmlRequest.upload.addEventListener("progress", (e: ProgressEvent) => {
        uploadObject.total = e.total;
        uploadObject.loaded = e.loaded;
        uploadObjectContainer.updateProgress(uploadObject);
      });

      // Transfer complete
      xmlRequest.upload.addEventListener("load", (e: ProgressEvent) => {
        console.log(`Finish loading ${directory_name} at ${Date.now()}`, e);
        uploadObject.total = e.total;
        uploadObject.loaded = e.loaded;
        uploadObjectContainer.updateProgress(uploadObject);
        resolve();
      });

      // Transfer failed
      xmlRequest.upload.addEventListener("error", (e: ProgressEvent) => {
        const text = 'Uploading file failed';
        store.dispatch(openNotificationModal('Notifications', text));
        console.log("transfer failed", e);
      });

      // Transfer canceled
      xmlRequest.upload.addEventListener("abort", (e: ProgressEvent) => {
        const text = 'Uploading file aborted';
        store.dispatch(openNotificationModal('Notifications', text));
        console.log("transfer aborted", e);
      });
      let token = this.authService.getToken();
      xmlRequest.setRequestHeader('Content-Type', 'application/octet-stream');
      xmlRequest.setRequestHeader('filename', `${directory_name}`);
      xmlRequest.setRequestHeader('Authorization', `Bearer ${token}`);
      xmlRequest.onreadystatechange = function(){
        if(xmlRequest.readyState !== 4) return;
        if(xmlRequest.status >= 200 && xmlRequest.status < 300){
          console.log(`Resolve Time ${Date.now()}`);
          console.log("Resolve request with status", xmlRequest.status);
          console.log("Response data", xmlRequest.response);
        }else{
          reject({
            status: xmlRequest.status,
            statusText: xmlRequest.statusText
          });
        }
      }

      xmlRequest.send(bodyData);
    });
  }
}
