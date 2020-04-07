import { GetMachinesFilter } from "../objects/machine";
import { UpdateMachineRequest } from "../../data/implementations/machineRepository";

export interface IMachineService {
  getMachine(mid: string): Promise<void>;
  getMachines(filterOptions?: GetMachinesFilter): Promise<void>;
  modifyMachineQueueLimit(
    mid: string,
    running_jobs_limit: number
  ): Promise<void>;
  updateMachine(mid: string, request: UpdateMachineRequest): Promise<void>;
}
