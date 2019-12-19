export interface IMachineService {
  getMachine(mid: string): Promise<void>;
}
