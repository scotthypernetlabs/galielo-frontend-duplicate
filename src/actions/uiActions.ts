import { Action } from "redux";

export const FINISH_LOADING = "FINISH_LOADING";
export type FINISH_LOADING = typeof FINISH_LOADING;
export const NOTIFICATIONS_SELECTED = "NOTIFICATIONS_SELECTED";
export type NOTIFICATIONS_SELECTED = typeof NOTIFICATIONS_SELECTED;
export const NOTIFICATIONS_UNSELECTED = "NOTIFICATIONS_UNSELECTED";
export type NOTIFICATIONS_UNSELECTED = typeof NOTIFICATIONS_UNSELECTED;

export interface IFinishLoading extends Action {
  type: FINISH_LOADING;
}

export interface INotificationsSelected extends Action {
  type: NOTIFICATIONS_SELECTED;
}

export interface INotificationsUnSelected extends Action {
  type: NOTIFICATIONS_UNSELECTED;
}

export type UIActions =
  | IFinishLoading
  | INotificationsSelected
  | INotificationsUnSelected;

export const finishLoading = () => {
  return { type: FINISH_LOADING };
};
export const notificationSelected = () => {
  return { type: NOTIFICATIONS_SELECTED };
};

export const notificationUnSelected = () => {
  return { type: NOTIFICATIONS_UNSELECTED };
};
