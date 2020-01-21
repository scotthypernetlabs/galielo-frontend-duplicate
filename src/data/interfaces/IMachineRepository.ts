import { Machine } from '../../business/objects/machine';

export interface IMachineRepository {
  getMachine(mid: string): Promise<Machine>;
  getMachines(mids?: string[]): Promise<Machine[]>;
}
