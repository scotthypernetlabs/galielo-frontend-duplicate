import { IStationRepository } from "../interfaces/IStationRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { IStation } from "../../business/objects/station";

export class StationRepository implements IStationRepository {
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ){
  }
  getStations(){
    return this.requestRepository.requestWithAuth(`backend`, 'GET')
      .then((stations:IStation[]) => {
        return stations;
      })
  }
}
