import { IFilterState } from '../business/objects/filter';
import { FilterActions, MODIFY_FILTER } from '../actions/filterActions';
import { Reducer } from 'redux';

class FilterState implements IFilterState {
  [key:string]: number;
  constructor(
    public gpu: number = 0,
    public processor: number = 0,
    public ram: number = 0,
    public clockspeed: number = 0,
    public price: number = 0
  ){

  }
}

const filterReducer: Reducer<FilterState, FilterActions> = (state = new FilterState(), action:FilterActions) => {
  switch(action.type){
    case MODIFY_FILTER:
      return generateFilter(state, action.filterName, action.filterValue);
    default:
      return state;
  }
}

const generateFilter = (currentFilter: IFilterState, filterName: string, filterValue: number) => {
  switch(filterName){
    case 'gpu':
      return new FilterState(filterValue, currentFilter.processor, currentFilter.ram, currentFilter.clockspeed, currentFilter.price);
    case 'processor':
      return new FilterState(currentFilter.gpu, filterValue, currentFilter.ram, currentFilter.clockspeed, currentFilter.price);
    case 'ram':
      return new FilterState(currentFilter.gpu, currentFilter.processor, filterValue, currentFilter.clockspeed, currentFilter.price);
    case 'clockspeed':
      return new FilterState(currentFilter.gpu, currentFilter.processor, currentFilter.ram, filterValue, currentFilter.price);
    case 'price':
      return new FilterState(currentFilter.gpu, currentFilter.processor, currentFilter.ram, currentFilter.clockspeed, filterValue);
    default:
      return currentFilter;
  }
}

export default filterReducer;
