import { Action } from 'redux';
export const MODIFY_FILTER = "MODIFY_FILTER";
export type MODIFY_FILTER = typeof MODIFY_FILTER;


export interface IModifyFilter extends Action {
  type: MODIFY_FILTER;
  filterName: string;
  filterValue: number[];
}

export type FilterActions = IModifyFilter;

export const modifyFilter = (filterName: string, filterValue: number[]): IModifyFilter => {
  return { type: MODIFY_FILTER, filterName, filterValue }
}
