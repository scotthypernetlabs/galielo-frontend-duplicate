import { Machine, GetMachinesFilter } from '../../business/objects/machine';

export interface IMachineRepository {
  getMachine(mid: string): Promise<Machine>;
  getMachines(filterOptions?: GetMachinesFilter): Promise<Machine[]>;
}
