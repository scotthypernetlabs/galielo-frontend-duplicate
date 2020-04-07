import { GetMachinesFilter, Machine } from "../../business/objects/machine";
import { UpdateMachineRequest } from "../implementations/machineRepository";

export interface IMachineRepository {
  getMachine(mid: string): Promise<Machine>;
  getMachines(filterOptions?: GetMachinesFilter): Promise<Machine[]>;
  modifyMachineQueueLimit(
    mid: string,
    running_jobs_limit: number
  ): Promise<Machine>;
  updateMachine(mid: string, request: UpdateMachineRequest): Promise<Machine>;
}
