import { GetMachinesFilter } from "../objects/machine";

export interface IMachineService {
  getMachine(mid: string): Promise<void>;
  getMachines(filterOptions?: GetMachinesFilter): Promise<void>;
}
