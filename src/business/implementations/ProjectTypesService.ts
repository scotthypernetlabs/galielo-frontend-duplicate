import { IProjectTypesRepository } from "../../data/interfaces/IProjectTypesRepository";
import { IProjectTypesService } from "../interfaces/IProjectTypesService";
import {
  ProjectTypeExpanded,
  ProjectTypesReceived
} from "../objects/projectType";

export class ProjectTypesService implements IProjectTypesService {
  constructor(protected projectTypesRepository: IProjectTypesRepository) {}
  async getProjectTypes(): Promise<ProjectTypesReceived[]> {
    return await this.projectTypesRepository.getProjectTypes();
  }
  async getProjectTypeById(
    projectTypeId: string
  ): Promise<ProjectTypeExpanded> {
    return await this.projectTypesRepository.getProjectTypeById(projectTypeId);
  }
}
