import { Framework } from "../../business/interfaces/IProjectService";
import { IJob } from "../../api/objects/job";
import { IProject } from "../../api/objects/project";
import { IProjectRepository } from "../interfaces/IProjectRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { PackagedFile } from "../../business/objects/packagedFile";
import { Project } from "../../business/objects/project";
import { UploadObjectContainer } from "../../business/objects/job";
import { convertToBusinessJob } from "./jobRepository";

export function convertToBusinessProject(project: IProject) {
  return new Project(
    project.id,
    project.name,
    project.description,
    project.source_storage_id,
    project.source_path,
    project.destination_storage_id,
    project.destination_path,
    project.user_id,
    project.creation_timestamp
  );
}

export function convertFrameworkToJson(framework: Framework) {
  return JSON.parse(JSON.stringify(framework));
}

export class ProjectRepository implements IProjectRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }
  public async createProject(
    name: string,
    description: string,
    framework?: Framework
  ) {
    const json = convertFrameworkToJson(framework);
    const response: {
      project: IProject;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/projects`,
      "POST",
      {
        name,
        description,
        framework: json
      }
    );
    return convertToBusinessProject(response.project);
  }
  public uploadFiles(
    project_id: string,
    files: PackagedFile[],
    uploadContainer: UploadObjectContainer
  ): Promise<void> {
    const promiseArray: Array<Promise<void>> = [];

    for (const file of files) {
      promiseArray.push(
        this.requestRepository.progressBarRequest(
          null,
          file.fileObject.name,
          file.fullPath,
          `${this.backend}/projects/${project_id}/files`,
          uploadContainer,
          "POST",
          file.fileObject
        )
      );
    }

    return Promise.all(promiseArray).then(() => {});
  }
  public async startJob(
    project_id: string,
    station_id: string,
    machine_id?: string,
    directoryName?: string
  ) {
    const formData: {
      station_id: string;
      machine_id?: string;
      name?: string;
      description?: string;
    } = { station_id: station_id };
    if (machine_id) {
      formData.machine_id = machine_id;
    }
    if (directoryName) {
      formData.name = directoryName;
    }
    const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

    // return delay(3000).then(async() => {
    const response: {
      job: IJob;
    } = await this.requestRepository.requestWithAuth(
      `${this.backend}/projects/${project_id}/jobs`,
      "POST",
      formData
    );
    return convertToBusinessJob(response.job);
    // })
  }
}
