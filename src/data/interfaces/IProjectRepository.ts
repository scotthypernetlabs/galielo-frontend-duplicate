import { Project } from "../../business/objects/project";
import { Job } from "../../business/objects/job";
import { PackagedFile } from "../../business/objects/packagedFile";

export interface IProjectRepository {
  createProject(name: string, description: string): Promise<Project>;
  uploadFiles(mid: string, project_id: string, files: PackagedFile[]): Promise<void>;
  startJob(project_id: string, station_id: string, machine_id?:string, directoryName?: string): Promise<Job>;
}
