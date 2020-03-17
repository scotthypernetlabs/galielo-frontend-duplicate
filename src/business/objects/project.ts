export class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public source_storage_id: string,
    public source_path: string,
    public destination_storage_id: string,
    public destination_path: string,
    public user_id: string,
    public creation_timestamp: number
  ) {}
}
