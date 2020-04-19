import { Job, UploadObjectContainer } from "../../business/objects/job";
import { PackagedFile } from "../../business/objects/packagedFile";
import { Project } from "../../business/objects/project";
import { ProjectType } from "../../business/interfaces/IProjectService";

export interface IProjectRepository {
  createProject(
    name: string,
    description: string,
    framework?: ProjectType
  ): Promise<Project>;
  uploadFiles(
    project_id: string,
    files: PackagedFile[],
    uploadContainer: UploadObjectContainer
  ): Promise<void>;
  startJob(
    project_id: string,
    station_id: string,
    machine_id?: string,
    directoryName?: string,
    machine_cpu?: string
  ): Promise<Job>;
}
