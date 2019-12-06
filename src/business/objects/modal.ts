export interface IModalState {
  readonly modal_name: string;
  readonly modal_text: string;
  readonly modal_query: IQuery;
}

export interface IQuery {
  readonly text: string;
  readonly number: number;
}
