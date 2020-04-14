import { Project } from "../objects/project";

export class ProjectType {
  constructor(
    public project_type_id: string,
    public plan?: string,
    public filesToRun?: string[],
    public filename?: string,
    public dependencies?: string[],
    public passArguments?: boolean,
    public args?: string,
    public customizeCPU?: boolean,
    public cpuCount?: number,
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
