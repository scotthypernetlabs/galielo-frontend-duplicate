import {
  convertToFrameworkOptions,
  convertToFrameworkSteps,
  convertToFrameworkWidget
} from "../../data/implementations/frameworkRepository";

export interface IFrameworkReceived {
  name: string;
  id: string;
  versions: string[];
}

export interface IGetFrameworks {
  frameworks: IFrameworkReceived[];
}

export interface IFrameworkOptions {
  name: string;
  value: string;
  hover: string;
  description: string;
  widgets: IFrameworkWidget[];
}

export interface IFrameworkWidget {
  type: string;
  header: string;
  subheader?: string;
  key: string;
  default?: boolean | number;
  options?: IFrameworkOptions[];
  filter?: string;
  placeholder?: string;
  mask?: string;
  required?: boolean;
  widgets: IFrameworkWidget[];
}

export interface IFrameworkStep {
  page: number;
  header: string;
  subheader: string;
  widgets: IFrameworkWidget[];
}

export interface IFrameworkExpanded {
  id: string;
  name: string;
  description: string;
  steps: IFrameworkStep[];
}

export class FrameworkExpanded {
  public steps: FrameworkSteps[];
  constructor(
    public id: string,
    public name: string,
    public description: string,
    s: IFrameworkStep[]
  ) {
    this.steps = [];
    s.forEach((step: IFrameworkStep) => {
      this.steps.push(convertToFrameworkSteps(step));
    });
  }
}

export class FrameworkOptions {
  public widgets: FrameworkWidget[];
  constructor(
    public name: string,
    public value: string,
    public hover: string,
    public description: string,
    w?: IFrameworkWidget[]
  ) {
    this.widgets = [];
    w.forEach((widget: IFrameworkWidget) => {
      this.widgets.push(convertToFrameworkWidget(widget));
    });
  }
}

export class FrameworkWidget {
  public widgets: FrameworkWidget[];
  public options: FrameworkOptions[];
  constructor(
    public type: string,
    public header: string,
    public key: string,
    public subheader?: string,
    public defaultValue?: boolean | number,
    o?: IFrameworkOptions[],
    public filter?: string,
    public placeholder?: string,
    public mask?: string,
    public required?: boolean,
    w?: IFrameworkWidget[]
  ) {
    this.widgets = [];
    this.options = [];
    w.forEach((widget: IFrameworkWidget) => {
      this.widgets.push(convertToFrameworkWidget(widget));
    });
    o.forEach((options: IFrameworkOptions) => {
      this.options.push(convertToFrameworkOptions(options));
    });
  }
}

export class FrameworkSteps {
  public widgets: FrameworkWidget[];
  constructor(
    public page: number,
    public header: string,
    public subheader: string,
    w: IFrameworkWidget[]
  ) {
    this.widgets = [];
    w.forEach((widget: IFrameworkWidget) => {
      this.widgets.push(convertToFrameworkWidget(widget));
    });
  }
}

export class FrameworkReceived {
  constructor(name: string, id: string, versions: string[]) {}
}
