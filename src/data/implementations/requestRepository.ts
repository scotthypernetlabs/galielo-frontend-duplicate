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

  async requestWithAuth(url: string = '', method: string = 'GET', bodyData: Object = {}) {
    let token = await this.authService.getToken();
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
    progressBarRequest(station_id: string, filename: string,
    directory_name: string, url: string = '', uploadObjectContainer: UploadObjectContainer, method: string = 'POST', bodyData: File){
    return new Promise<void>(async (resolve, reject) => {
      const xmlRequest = new XMLHttpRequest();
      let uploadObject = new UploadObject(xmlRequest, 0, 0, bodyData.size);
      uploadObjectContainer.addUploadingFile(uploadObject);

      xmlRequest.upload.addEventListener('progress', (e:ProgressEvent) => {
        uploadObject.loaded = e.loaded;
        uploadObjectContainer.updateProgress(uploadObject);
      })
      xmlRequest.addEventListener("load", (e: ProgressEvent) => {
        resolve();
      });
      xmlRequest.upload.addEventListener("error", (e:ProgressEvent) => {
        const text = 'Uploading files failed';
        console.error("Uploading files failed in upload");
        reject();
      })
      // Transfer failed
      xmlRequest.addEventListener("error", (e: ProgressEvent) => {
        const text = 'Uploading files failed';
        // TODO: Remove this dispatch, move it to the service layer
        console.error(`Filename ${directory_name}/${filename} failed uploading`);
        reject();
      });

      // Transfer canceled
      xmlRequest.addEventListener("abort", (e: ProgressEvent) => {
        // const text = 'Uploading file aborted';
        // TODO: Remove this dispatch, move it to the service layer
        console.warn("transfer aborted", e);
        // TODO: Resolve or reject the promise here.
        reject();
      });
      xmlRequest.open(method, url);
      let token = await this.authService.getToken();
      xmlRequest.setRequestHeader('Content-Type', 'application/octet-stream');
      xmlRequest.setRequestHeader('filename', `${directory_name}`);
      xmlRequest.setRequestHeader('Authorization', `Bearer ${token}`);
      xmlRequest.onreadystatechange = function(){
        if(xmlRequest.readyState !== 4){
          return;
        }
        if(xmlRequest.status >= 200 && xmlRequest.status < 300){
          resolve();
        }else{
          reject();
        }
      }
      xmlRequest.send(bodyData);
    });
  }
}
