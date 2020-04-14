import {
  convertToProjectTypeOptions,
  convertToProjectTypeWidget,
  convertToProjectTypeWizardSpecs
} from "../../data/implementations/projectTypeRepository";

export interface IProjectTypeReceived {
  name: string;
  id: string;
  description: string;
  version: string;
}

export interface IGetProjectTypesResponse {
  projecttypes: IProjectTypeReceived[];
}

export interface IProjectTypeOptions {
  name: string;
  value: string;
  hover: string;
  description: string;
  widgets: IProjectTypeWidget[];
}

export interface IProjectTypeWidget {
  type: string;
  header: string;
  subheader?: string;
  key: string;
  default?: boolean | number;
  options?: IProjectTypeOptions[];
  filter?: string;
  placeholder?: string;
  mask?: string;
  required?: boolean;
  widgets: IProjectTypeWidget[];
}

export interface IProjectTypeWizardSpecs {
  page: number;
  header: string;
  subheader: string;
  widgets: IProjectTypeWidget[];
}

export interface IProjectTypeByIdResponse {
  id: string;
  name: string;
  description: string;
  wizard_specs: IProjectTypeWizardSpecs[];
  version: string;
}

export class ProjectTypeExpanded {
  public wizard_specs: ProjectTypeWizardSpecs[];
  constructor(
    public id: string,
    public name: string,
    public description: string,
    s: IProjectTypeWizardSpecs[],
    public version: string
  ) {
    this.wizard_specs = [];
    s.forEach((spec: IProjectTypeWizardSpecs) => {
      this.wizard_specs.push(convertToProjectTypeWizardSpecs(spec));
    });
  }
}

export class ProjectTypeOptions {
  public widgets: ProjectTypeWidget[];
  constructor(
    public name: string,
    public value: string,
    public hover: string,
    public description: string,
    w?: IProjectTypeWidget[]
  ) {
    this.widgets = [];
    w.forEach((widget: IProjectTypeWidget) => {
      this.widgets.push(convertToProjectTypeWidget(widget));
    });
  }
}

export class ProjectTypeWidget {
  public widgets: ProjectTypeWidget[];
  public options: ProjectTypeOptions[];
  constructor(
    public type: string,
    public header: string,
    public key: string,
    public subheader?: string,
    public defaultValue?: boolean | number,
    o?: IProjectTypeOptions[],
    public filter?: string,
    public placeholder?: string,
    public mask?: string,
    public required?: boolean,
    w?: IProjectTypeWidget[]
  ) {
    this.widgets = [];
    this.options = [];
    w.forEach((widget: IProjectTypeWidget) => {
      this.widgets.push(convertToProjectTypeWidget(widget));
    });
    o.forEach((options: IProjectTypeOptions) => {
      this.options.push(convertToProjectTypeOptions(options));
    });
  }
}

export class ProjectTypeWizardSpecs {
  public widgets: ProjectTypeWidget[];
  constructor(
    public page: number,
    public header: string,
    public subheader: string,
    w: IProjectTypeWidget[]
  ) {
    this.widgets = [];
    w.forEach((widget: IProjectTypeWidget) => {
      this.widgets.push(convertToProjectTypeWidget(widget));
    });
  }
}

export class ProjectTypesReceived {
  constructor(name: string, id: string, description: string, version: string) {}
}
