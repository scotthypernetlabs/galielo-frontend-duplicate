import {
  IGetProjectTypesResponse,
  IProjectTypeByIdResponse,
  IProjectTypeOptions,
  IProjectTypeReceived,
  IProjectTypeWidget,
  IProjectTypeWizardSpecs,
  ProjectTypeExpanded,
  ProjectTypeOptions,
  ProjectTypeWidget,
  ProjectTypeWizardSpecs,
  ProjectTypesReceived
} from "../../business/objects/projectType";
import { IProjectTypesRepository } from "../interfaces/IProjectTypesRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";

export function convertToProjectTypeOptions(response: IProjectTypeOptions) {
  return new ProjectTypeOptions(
    response.name,
    response.description,
    response.hover,
    response.value,
    response.widgets
  );
}
export function convertToProjectTypeWidget(response: IProjectTypeWidget) {
  return new ProjectTypeWidget(
    response.type,
    response.header,
    response.key,
    response.subheader,
    response.default,
    response.options,
    response.filter,
    response.placeholder,
    response.mask,
    response.required,
    response.widgets
  );
}

export function convertToProjectTypeWizardSpecs(
  response: IProjectTypeWizardSpecs
) {
  return new ProjectTypeWizardSpecs(
    response.page,
    response.header,
    response.subheader,
    response.widgets
  );
}
export function convertToProjectTypeReceived(response: IProjectTypeReceived) {
  return new ProjectTypesReceived(
    response.name,
    response.id,
    response.description,
    response.version
  );
}

export function convertToProjectTypeExpanded(
  response: IProjectTypeByIdResponse
) {
  return new ProjectTypeExpanded(
    response.id,
    response.name,
    response.description,
    response.wizard_specs,
    response.version
  );
}

export class ProjectTypeRepository implements IProjectTypesRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }

  async getProjectTypes(): Promise<ProjectTypesReceived[]> {
    const response: IGetProjectTypesResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/projecttypes`
    );
    const projectTypes: ProjectTypesReceived[] = [];
    response.projecttypes.forEach((projectType: IProjectTypeReceived) => {
      projectTypes.push(convertToProjectTypeReceived(projectType));
    });
    return projectTypes;
  }

  async getProjectTypeById(
    projectTypeId: string
  ): Promise<ProjectTypeExpanded> {
    const response: IProjectTypeByIdResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/projecttypes?id=${projectTypeId}`
    );
    return convertToProjectTypeExpanded(response);
  }
}
