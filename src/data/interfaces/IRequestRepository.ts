import { UploadObjectContainer } from "../../business/objects/job";

export interface IRequestRepository {
  requestWithAuth(url:string, method?:string, bodyData?:Object): Promise<any>
  request(url: string, method?: string, bodyData?: Object): Promise<any>;
  downloadResultFromServer(url: string, method: string, filename: string):any;
  progressBarRequest(station_id: string, filename: string,
    directory_name: string, url: string, uploadObjectContainer: UploadObjectContainer, method?: string, bodyData?: File):any;
}
