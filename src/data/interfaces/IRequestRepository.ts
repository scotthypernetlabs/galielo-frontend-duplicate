import { UploadObjectContainer } from "../../business/objects/job";

export interface IRequestRepository {
  requestWithAuth<T = any>(
    url: string,
    method?: string,
    bodyData?: Object
  ): Promise<T>;
  request(url: string, method?: string, bodyData?: Object): Promise<any>;
  progressBarRequest(
    station_id: string,
    filename: string,
    directory_name: string,
    url: string,
    uploadObjectContainer: UploadObjectContainer,
    method?: string,
    bodyData?: File
  ): Promise<void>;
}
