import { IProjectRepository } from "../../data/interfaces/IProjectRepository";
import { IProjectService, ProjectType } from "../interfaces/IProjectService";
import { Project } from "../objects/project";

export class ProjectService implements IProjectService {
  constructor(protected projectRepository: IProjectRepository) {}
  async createProject(
    name: string,
    description: string,
    framework?: ProjectType
  ): Promise<Project> {
    return await this.projectRepository.createProject(
      name,
      description,
      framework
    );
  }
}
