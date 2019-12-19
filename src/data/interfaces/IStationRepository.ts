import { IStation } from "../../business/objects/station";

export interface IStationRepository {
  getStations(): Promise<IStation[]>;
}
