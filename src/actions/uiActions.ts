import { Action } from 'redux';

export const FINISH_LOADING = "FINISH_LOADING";
export type FINISH_LOADING = typeof FINISH_LOADING;

export interface IFinishLoading extends Action {
  type: FINISH_LOADING;
}

export type UIActions = IFinishLoading;

export const finishLoading = () => {
  console.log("Trigger finish loading");
  return { type: FINISH_LOADING };
}
