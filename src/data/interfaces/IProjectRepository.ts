import { Project } from "../../business/objects/project";
import { Job } from "../../business/objects/job";

export interface IProjectRepository {
  createProject(name: string, description: string): Promise<Project>;
  uploadFiles(project_id: string, files: File[]): Promise<void[]>;
  startJob(project_id: string, station_id: string, machine_id?:string): Promise<Job>;
}
