import { Action } from "redux";

export const DOCKER_WIZARD_INPUT = "DOCKER_WIZARD_INPUT";
export type DOCKER_WIZARD_INPUT = typeof DOCKER_WIZARD_INPUT;

export interface IReceiveDockerInput extends Action {
  type: DOCKER_WIZARD_INPUT;
  inputObject: any;
}

export type DockerActions = IReceiveDockerInput;

export const receiveDockerInput = (inputObject:any) => {
  return { type: DOCKER_WIZARD_INPUT, inputObject }
}
