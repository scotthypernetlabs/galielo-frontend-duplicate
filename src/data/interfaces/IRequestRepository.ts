export interface IRequestRepository {
  requestWithAuth(url:string, method?:string, bodyData?:Object): Promise<any>
  request(url: string, method?: string, bodyData?: Object): Promise<any>;
  requestGoogle(dest_mid: string, url: string, method?: string, bodyData?: Object):any;
  downloadResultFromServer(url: string, method: string, filename: string):any;
  progressBarRequest(dest_mid: string, station_id: string, filename: string, directory_name: string, url: string, method?: string, bodyData?: Object):any;
}
