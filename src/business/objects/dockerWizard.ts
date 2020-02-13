export class DockerInputState {
  constructor(
    public selectedFramework: any,
    public dockerTextFile: string,
    public frameworkText: string,
    public dependencyText: string,
    public dependencyInput: string,
    public target: string,
    public entrypoint: string,
    public fileUploadText: string,
    public fileUploadHover: boolean,
    public disabled: boolean
  ){

  }
}

export interface IDockerInput {
  selectedFramework?: any;
  dockerTextFile?: string;
  frameworkText?: string;
  dependencyText?: string;
  dependencyInput?: string;
  target?: string;
  entrypoint?: string;
  fileUploadText?: string;
  fileUploadHover?: boolean;
  disabled?: boolean;
}