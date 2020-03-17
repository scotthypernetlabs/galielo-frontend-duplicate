export class Query {
  constructor(
    public title: string,
    public text: string,
    public yesFunction: Function,
    public noFunction: Function
  ) {}
}
