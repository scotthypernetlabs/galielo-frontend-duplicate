import { Action } from 'redux';

export const OPEN_MODAL = "OPEN_MODAL";
export type OPEN_MODAL = typeof OPEN_MODAL;

export const CLOSE_MODAL = "CLOSE_MODAL";
export type CLOSE_MODAL = typeof CLOSE_MODAL;

export const OPEN_NOTIFICATION_MODAL = "OPEN_NOTIFICATION_MODAL";
export type OPEN_NOTIFICATION_MODAL = typeof OPEN_NOTIFICATION_MODAL;

export const OPEN_DOCKER_WIZARD = "OPEN_DOCKER_WIZARD";
export type OPEN_DOCKER_WIZARD = typeof OPEN_DOCKER_WIZARD;

export interface IOpenModal extends Action {
  type: OPEN_MODAL;
  modal_name: string;
}

export interface ICloseModal extends Action {
  type: CLOSE_MODAL
}

export interface IOpenNotificationModal extends Action {
  type: OPEN_NOTIFICATION_MODAL,
  text: string,
  modal_name: string
}

export interface IOpenDockerWizard extends Action {
  type: OPEN_DOCKER_WIZARD;
  directoryName: string;
  fileList: File[];
}

export type ModalActions = IOpenModal | ICloseModal | IOpenNotificationModal | IOpenDockerWizard;

export const openModal = (modal_name: string): IOpenModal => {
  console.log(`Open ${modal_name}`);
  return { type: OPEN_MODAL, modal_name }
}
export const closeModal = (): ICloseModal => {
  console.log("Close Modal");
  return { type: CLOSE_MODAL }
}
export const openNotificationModal = (modal_name: string, text: string):IOpenNotificationModal => {
  return { type: OPEN_NOTIFICATION_MODAL, modal_name, text }
}

export const openDockerWizard = (directoryName: string, fileList: File[]) => {
  return { type: OPEN_DOCKER_WIZARD, directoryName, fileList }
}
