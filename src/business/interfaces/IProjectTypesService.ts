import {
  ProjectTypeExpanded,
  ProjectTypesReceived
} from "../objects/projectType";

export interface IProjectTypesService {
  getProjectTypes(): Promise<ProjectTypesReceived[]>;
  getProjectTypeById(projectTypeId: string): Promise<ProjectTypeExpanded>;
}
