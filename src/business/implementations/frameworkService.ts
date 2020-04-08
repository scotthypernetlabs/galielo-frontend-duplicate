import {
  FrameworkExpanded,
  FrameworkReceived
} from "../../api/objects/frameworks";
import { IFrameworkRepository } from "../../data/interfaces/IFrameworkRepository";
import { IFrameworkService } from "../interfaces/IFrameworkService";

export class FrameworkService implements IFrameworkService {
  constructor(protected frameworkRepository: IFrameworkRepository) {}
  async getFrameworks(): Promise<FrameworkReceived[]> {
    return await this.frameworkRepository.getFrameworks();
  }
  async getFrameworkById(frameworkId: string): Promise<FrameworkExpanded> {
    return await this.frameworkRepository.getFrameworkById(frameworkId);
  }
}
