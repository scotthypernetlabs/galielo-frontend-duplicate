import { Project } from "../objects/project";

export interface Dependency {
  dependency: string;
}

export class Framework {
  constructor(
    public framework_id: string,
    public plan?: string,
    public filesToRun?: string[],
    public filename?: string,
    public dependencies?: Dependency[],
    public passArguments?: boolean,
    public args?: string,
    public customizeCpu?: boolean,
    public cpuCount?: number
  ) {}
}

export interface IProjectService {
  createProject(
    name: string,
    description: string,
    framework: Framework
  ): Promise<Project>;
}
