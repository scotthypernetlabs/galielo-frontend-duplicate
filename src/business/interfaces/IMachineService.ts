export interface IMachineService {
  getMachine(mid: string): Promise<void>;
  getMachines(mids: string[]): Promise<void>;
}
