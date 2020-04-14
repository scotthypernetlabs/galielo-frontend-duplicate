import {
  ProjectTypeExpanded,
  ProjectTypesReceived
} from "../objects/projectType";

export interface IProjectTypesService {
  getProjectTypes(): Promise<ProjectTypesReceived[]>;
  getProjectTypeById(frameworkId: string): Promise<ProjectTypeExpanded>;
}
