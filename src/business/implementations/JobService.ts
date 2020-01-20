import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { Job, JobStatusHistory } from "../objects/job";
import { Logger } from "../../components/Logger";
import store from "../../store/store";
import {receiveReceivedJobs, receiveSentJobs} from "../../actions/jobActions";
// @ts-ignore
import * as Tar from 'tarts';


export class JobService implements IJobService {
  constructor(
    protected jobRepository: IJobRepository,
    protected logService: Logger
  ){}

  getSentJobs(){
    return this.jobRepository.getSentJobs()
      .then((jobs: Job[]) => {

      })
      .catch((err: Error) => {
        this.logService.log(err);
      })
  }

  getReceivedJobs(){
    return this.jobRepository.getReceivedJobs()
      .then((jobs: Job[]) => {

      })
      .catch((err:Error) => {
        this.logService.log(err);
      })
  }

  getJobStatusHistory(job_id: string){
    return this.jobRepository.getJobStatusHistory(job_id)
      .then((status_history: JobStatusHistory) => {

      })
      .catch((err: Error) => {
        this.logService.log(err);
      })
  }

  updateReceivedJob(job: Job) {
    store.dispatch(receiveReceivedJobs([job]));
  }

  updateSentJob(job: Job) {
    store.dispatch(receiveSentJobs([job]));
  }

  protected async getUploadUrl(mid: string, midFriend: string, jobName: string): Promise<string> {
    const response = await this.jobRepository.getUploadUrl(mid, midFriend, jobName);
    console.log('getUploadUrl', response);
    return response;
  }

  protected async uploadFile(url: string, file: Uint8Array) {
    this.jobRepository.uploadFile(url, file);
  }

  protected sendUploadCompleted(mid: string, midFriend: string, jobName: string): void {
    const response = this.jobRepository.sendUploadCompleted(mid, midFriend, jobName);
    console.log('sendUploadCompleted', response);
    return response;
  }

  protected checkForDockerfile(dataTransfer: DataTransfer): boolean {
    let isDockerfile = false;
    Array.from(dataTransfer.items).forEach((item: DataTransferItem) => {
      const entry = item.webkitGetAsEntry();
      // @ts-ignore

      if (this.readDirectory(entry)) {
        isDockerfile = true;
      }
      // @ts-ignore
      console.log('path', entry.fullPath);
      console.log('entry', entry);
    });

    return isDockerfile;
  }

  protected readDirectory(entry: any): boolean {
    console.log('entry name', entry.name);
    if(entry === null) {
      return false;
    }

    if(entry.isDirectory) {
      const directoryReader = entry.createReader();
      directoryReader.readEntries((results: any) => {
        results.forEach((result: any) => {
          console.log(result);
          this.readDirectory(result);
        });
      });
    } else if (entry.isFile && entry.name === 'Dockerfile') {
      return true;
    }
  }

  protected createTarball(fileList: FileList): Uint8Array {
    const filesMapper: FileObject[] = [];
    const fileReader = new FileReader();

    Array.from(fileList).forEach((file: File) => {
      fileReader.onload = () => {
        const fileObject = {
          name: file.name,
          content: fileReader.result
        };

        filesMapper.push(fileObject);
      };

      fileReader.readAsBinaryString(file);
    });

    return Tar(filesMapper);
  }

  async sendJob(mid: string, midFriend: string, fileList: FileList, dataTransfer: DataTransfer): Promise<void> {
    const directoryName: string = fileList[0].name;
    console.log('directoryName', directoryName);

    // Check directory for Dockerfile
    if(!this.checkForDockerfile(dataTransfer)) {
      throw new Error('Must have a Dockerfile');
    }

    // Send request to get a URL
    const url = await this.getUploadUrl(mid, midFriend, directoryName);
    console.log('upload URL', url);

    // Tar directory into single file
    const tar = this.createTarball(fileList);

    // Send folder
    this.uploadFile(url, tar);

    // Tell server we're done
    this.sendUploadCompleted(mid, midFriend, directoryName);
  }
}

interface FileObject {
  name: string;
  content: ArrayBuffer | string
}
