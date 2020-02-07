import { Action } from "redux";
import { IDockerInput } from "../business/objects/dockerWizard";

export const DOCKER_WIZARD_INPUT = "DOCKER_WIZARD_INPUT";
export type DOCKER_WIZARD_INPUT = typeof DOCKER_WIZARD_INPUT;

export interface IReceiveDockerInput extends Action {
  type: DOCKER_WIZARD_INPUT;
  inputObject: IDockerInput;
}

export type DockerActions = IReceiveDockerInput;

export const receiveDockerInput = (inputObject:IDockerInput) => {
  return { type: DOCKER_WIZARD_INPUT, inputObject }
}
