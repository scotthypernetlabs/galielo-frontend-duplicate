import {
  ProjectTypeExpanded,
  ProjectTypesReceived
} from "../../business/objects/projectType";

export interface IProjectTypesRepository {
  getProjectTypes(): Promise<ProjectTypesReceived[]>;
  getProjectTypeById(frameworkId: string): Promise<ProjectTypeExpanded>;
}
