import { IProjectRepository } from "../interfaces/IProjectRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { IProject } from "../../api/objects/project";
import { Project } from "../../business/objects/project";
import { IJob } from "../../api/objects/job";
import { convertToBusinessJob } from "./jobRepository";
import { UploadObjectContainer } from "../../business/objects/job";
import { PackagedFile } from "../../business/objects/packagedFile";

export function convertToBusinessProject(project: IProject){
  return new Project(
    project.id, project.name, project.description, project.source_storage_id,
    project.source_path, project.destination_storage_id, project.destination_path,
    project.user_id, project.creation_timestamp);
}

export class ProjectRepository implements IProjectRepository {
  protected backend: string;
  constructor(protected requestRepository: IRequestRepository, protected settings:ISettingsRepository){
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }
  public async createProject(name: string, description: string){
    let response:{project: IProject} = await this.requestRepository.requestWithAuth(`${this.backend}/projects`, 'POST', {name, description})
    return convertToBusinessProject(response.project);
  }
  public uploadFiles(project_id: string, files: PackagedFile[], uploadContainer: UploadObjectContainer): Promise<void> {
    let promiseArray = new Array<Promise<void>>();

    for (let file of files) {
      promiseArray.push(this.requestRepository.progressBarRequest(
        null,
        file.fileObject.name,
        file.fullPath,
        `${this.backend}/projects/${project_id}/files`,
        uploadContainer,
        'POST',
        file.fileObject));
    }

    return Promise.all(promiseArray).then(() => {
      console.log(`Upload file all done ${Date.now()}`);
    });
  }
  public async startJob(project_id: string, station_id: string, machine_id?: string, directoryName?: string){
    let formData:{station_id: string, machine_id?: string, name?: string, description?: string} = { station_id: station_id };
    if(machine_id){
      formData.machine_id = machine_id;
    }
    if(directoryName){
      formData.name = directoryName;
    }
    const delay = (t:any) => new Promise(resolve => setTimeout(resolve, t));

    // return delay(3000).then(async() => {
      let response:{job: IJob} = await this.requestRepository.requestWithAuth(`${this.backend}/projects/${project_id}/jobs`, 'POST', formData);
      return convertToBusinessJob(response.job);
    // })
  }
}
