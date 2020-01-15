export interface IFilterState {
  readonly [key:string]: number[];
  readonly gpu: number[];
  readonly processor: number[];
  readonly ram: number[];
  readonly clockspeed: number[];
  readonly price: number[];
}
