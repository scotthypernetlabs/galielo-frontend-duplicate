export interface IRequestRepository {
  requestWithAuth(url:string, method?:string, bodyData?:Object): Promise<any>
  request(url: string, method?: string, bodyData?: Object): Promise<any>;
  requestGoogle(url: string, method?: string, bodyData?: Object):Promise<any>;
}
