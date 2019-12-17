import { IStationService } from "../interfaces/IStationService";
import { IStationRepository } from "../../data/interfaces/IStationRepository";
import { Logger } from "../../components/Logger";
import { IStation } from "../objects/station";
import { receiveStations } from "../../actions/stationActions";
import store from "../../store/store";

class StationService implements IStationService {
  constructor(
    protected stationRepository: IStationRepository,
    protected logService: Logger
  ){

  }
  getStations(){
    this.stationRepository.getStations()
      .then((stations: IStation[]) => {
        store.dispatch(receiveStations(stations));
      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }
}
