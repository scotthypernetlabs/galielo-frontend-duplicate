import {
  FrameworkExpanded,
  FrameworkOptions,
  FrameworkReceived,
  FrameworkSteps,
  FrameworkWidget,
  IFrameworkExpanded,
  IFrameworkOptions,
  IFrameworkReceived,
  IFrameworkStep,
  IFrameworkWidget,
  IGetFrameworks
} from "../../api/objects/frameworks";
import { IFrameworkRepository } from "../interfaces/IFrameworkRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";

export function convertToFrameworkOptions(response: IFrameworkOptions) {
  return new FrameworkOptions(
    response.name,
    response.description,
    response.hover,
    response.value,
    response.widgets
  );
}
export function convertToFrameworkWidget(response: IFrameworkWidget) {
  return new FrameworkWidget(
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

export function convertToFrameworkSteps(response: IFrameworkStep) {
  return new FrameworkSteps(
    response.page,
    response.header,
    response.subheader,
    response.widgets
  );
}
export function convertToFrameworkReceived(response: IFrameworkReceived) {
  return new FrameworkReceived(response.name, response.id, response.versions);
}

export function convertToFrameworkExpanded(response: IFrameworkExpanded) {
  return new FrameworkExpanded(
    response.id,
    response.name,
    response.description,
    response.steps
  );
}

export class FrameworkRepository implements IFrameworkRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }

  async getFrameworks(): Promise<FrameworkReceived[]> {
    const response: IGetFrameworks = await this.requestRepository.requestWithAuth(
      `${this.backend}/framework`
    );
    const frameworks: FrameworkReceived[] = [];
    response.frameworks.forEach((framework: IFrameworkReceived) => {
      frameworks.push(convertToFrameworkReceived(framework));
    });
    return frameworks;
  }

  async getFrameworkById(frameworkId: string): Promise<FrameworkExpanded> {
    const response: IFrameworkExpanded = await this.requestRepository.requestWithAuth(
      `${this.backend}/framework/${frameworkId}`
    );
    return convertToFrameworkExpanded(response);
  }
}
