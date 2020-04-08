import { Framework, IProjectService } from "../interfaces/IProjectService";
import { IProjectRepository } from "../../data/interfaces/IProjectRepository";
import { Project } from "../objects/project";

export class ProjectService implements IProjectService {
  constructor(protected projectRepository: IProjectRepository) {}
  async createProject(
    name: string,
    description: string,
    framework?: Framework
  ): Promise<Project> {
    return await this.projectRepository.createProject(
      name,
      description,
      framework
    );
  }
}
