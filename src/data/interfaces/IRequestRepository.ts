export interface IRequestRepository {
  requestWithAuth(url:string, method?:string, bodyData?:Object): Promise<any>
  request(url: string, method?: string, bodyData?: Object): Promise<any>;
  requestGoogle(dest_mid: string, url: string, method?: string, bodyData?: Object):any;
}
