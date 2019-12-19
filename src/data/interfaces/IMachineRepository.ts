import { IMachine } from '../../business/objects/machine';

export interface IMachineRepository {
  getMachine(mid: string): Promise<IMachine>;
  getMachines(mids: string[]): Promise<IMachine[]>;
}
