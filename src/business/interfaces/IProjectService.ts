import { Dictionary } from "../objects/dictionary";
import { Project } from "../objects/project";
export class ProjectType {
  constructor(
    public project_type_id: string,
    public plan?: string,
    public files_to_run?: string[],
    public filename?: string,
    public dependencies?: Dictionary<string>,
    public arg?: string[],
    public cpu_count?: number,
    public source_storage_id?: string,
    public source_path?: string,
    public destination_storage_id?: string,
    public destination_path?: string
  ) {}
}

export interface IProjectService {
  createProject(
    name: string,
    description: string,
    projectType: ProjectType
  ): Promise<Project>;
}
