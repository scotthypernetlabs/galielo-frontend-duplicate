export interface IProject {
  id: string;
  name: string;
  description: string;
  source_storage_id: string;
  source_path: string;
  destination_storage_id: string;
  destination_path: string;
  user_id: string;
  creation_timestamp: number;
}
