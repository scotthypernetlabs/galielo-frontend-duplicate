import { Dictionary } from "../objects/dictionary";
import { DockerWizardOptions } from "../objects/dockerWizard";
import {
  GetJobFilters,
  Job,
  JobStatus,
  UploadObjectContainer
} from "../objects/job";
import { GetMachinesFilter, Machine } from "../objects/machine";
import {
  GetUploadUrlResponse,
  UploadUrl
} from "../../data/implementations/jobRepository";
import { IJobRepository } from "../../data/interfaces/IJobRepository";
import { IJobService } from "../interfaces/IJobService";
import { IMachineRepository } from "../../data/interfaces/IMachineRepository";
import { IProjectRepository } from "../../data/interfaces/IProjectRepository";
import { IRequestRepository } from "../../data/interfaces/IRequestRepository";
import { IUserRepository } from "../../data/interfaces/IUserRepository";
import { Logger } from "../../components/Logger";
import { PackagedFile } from "../objects/packagedFile";
import { ProjectType } from "../interfaces/IProjectService";
import { User, UserFilterOptions } from "../objects/user";
import {
  deleteMachineProgress,
  updateMachineUploadProgress
} from "../../actions/progressActions";
import {
  openDockerWizard,
  openNotificationModal
} from "../../actions/modalActions";
import {
  receiveJobs,
  receiveReceivedJobs,
  receiveSentJobs,
  updateSentJob
} from "../../actions/jobActions";
import { receiveMachines } from "../../actions/machineActions";
import { receiveUsers } from "../../actions/userActions";
import store from "../../store/store";

export class JobService implements IJobService {
  constructor(
    protected jobRepository: IJobRepository,
    protected userRepository: IUserRepository,
    protected machineRepository: IMachineRepository,
    protected requestRepository: IRequestRepository,
    protected projectRepository: IProjectRepository,
    protected logService: Logger
  ) {}

  handleError(err: Error) {
    store.dispatch(
      openNotificationModal("Notifications", "An error has occurred")
    );
    // store.dispatch(openNotificationModal("Notifications", err.message));
  }
  getJobs(filterOptions?: GetJobFilters) {
    return this.jobRepository
      .getJobs(filterOptions)
      .then(async (jobs: Job[]) => {
        const current_user = store.getState().users.currentUser;
        const receivedJobs: Dictionary<Job> = {};
        const sentJobs: Dictionary<Job> = {};
        const usersList: Dictionary<boolean> = {};
        const machinesList: Dictionary<boolean> = {};
        jobs.forEach(job => {
          if (job.launch_pad === current_user.user_id) {
            sentJobs[job.id] = job;
            machinesList[job.landing_zone] = true;
          }
          if (current_user.mids.indexOf(job.landing_zone) >= 0) {
            receivedJobs[job.id] = job;
            usersList[job.launch_pad] = true;
          }
        });
        if (Object.keys(usersList).length > 0) {
          const users: User[] = await this.userRepository.getUsers(
            new UserFilterOptions(Object.keys(usersList))
          );
          store.dispatch(receiveUsers(users));
        }
        if (Object.keys(machinesList).length > 0) {
          const machines: Machine[] = await this.machineRepository.getMachines(
            new GetMachinesFilter(Object.keys(machinesList))
          );
          store.dispatch(receiveMachines(machines));
        }
        store.dispatch(receiveSentJobs(sentJobs));
        store.dispatch(receiveReceivedJobs(receivedJobs));
      })
      .catch((err: Error) => {
        this.logService.log(err);
      });
  }
  getSentJobs() {
    return this.jobRepository
      .getSentJobs()
      .then((jobs: Job[]) => {})
      .catch((err: Error) => {
        this.logService.log(err);
      });
  }

  getReceivedJobs() {
    return this.jobRepository
      .getReceivedJobs()
      .then((jobs: Job[]) => {})
      .catch((err: Error) => {
        this.logService.log(err);
      });
  }

  updateReceivedJob(job: Job) {
    store.dispatch(receiveReceivedJobs({ [job.id]: job }));
  }

  updateSentJob(job: Job) {
    store.dispatch(receiveSentJobs({ [job.id]: job }));
  }

  protected getUploadUrl(mid: string, midFriend: string, jobName: string) {
    return this.jobRepository
      .getUploadUrl(mid, midFriend, jobName)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }

  protected sendUploadCompleted(
    mid: string,
    midFriend: string,
    jobName: string,
    stationid: string
  ) {
    return this.jobRepository
      .sendUploadCompleted(mid, midFriend, jobName, stationid)
      .catch((err: Error) => {
        this.handleError(err);
      });
  }

  public checkForDockerfile(fileList: any[]): boolean {
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].fullPath === "Dockerfile") {
        return true;
      }
    }
    return false;
  }

  async sendJob(
    mid: string,
    fileList: PackagedFile[],
    directoryName: string,
    stationid: string,
    projectType?: ProjectType,
    dockerFileExists?: boolean
  ): Promise<boolean> {
    // Check directory for Dockerfile
    if (!dockerFileExists) {
      store.dispatch(
        openDockerWizard(
          directoryName,
          new DockerWizardOptions(
            "machine",
            fileList,
            directoryName,
            stationid,
            mid
          )
        )
      );
      return false;
    }
    // Create Project
    const project = await this.projectRepository.createProject(
      directoryName,
      "",
      projectType
    );
    this.logService.log("Project made", project);
    if (project) {
      // Upload files
      const uploadContainer = new UploadObjectContainer(
        project.id,
        [],
        0,
        0,
        null,
        mid
      );
      try {
        await this.projectRepository.uploadFiles(
          project.id,
          fileList,
          uploadContainer
        );
        const job = await this.projectRepository.startJob(
          project.id,
          stationid,
          mid,
          directoryName
        );
        this.logService.log("job started");
        if (job) {
          store.dispatch(updateSentJob(job));
          return true;
        }
      } catch {
        this.logService.log("Job send failed");
        uploadContainer.cancelAllUploads();
        store.dispatch(
          openNotificationModal("Notifications", "Failed to send job")
        );
        store.dispatch(deleteMachineProgress(mid));
        return false;
      }
    }
    return false;
  }
  async sendStationJob(
    stationid: string,
    fileList: any[],
    directoryName: string,
    projectType?: ProjectType,
    dockerFileExists?: boolean
  ) {
    if (!dockerFileExists) {
      store.dispatch(
        openDockerWizard(
          directoryName,
          new DockerWizardOptions("station", fileList, directoryName, stationid)
        )
      );
      return false;
    }
    // Create Project
    const project = await this.projectRepository.createProject(
      directoryName,
      "",
      projectType
    );
    this.logService.log("Project made", project);
    if (project) {
      const uploadContainer = new UploadObjectContainer(
        project.id,
        [],
        0,
        0,
        stationid,
        null
      );
      const uploadedFiles = await this.projectRepository.uploadFiles(
        project.id,
        fileList,
        uploadContainer
      );
      this.logService.log("Files uploaded", uploadedFiles);
      // Start Job
      const job = await this.projectRepository.startJob(
        project.id,
        stationid,
        null,
        directoryName
      );
      this.logService.log("job started");
      if (job) {
        store.dispatch(updateSentJob(job));
        return true;
      }
    }
    this.logService.log("Dispatching failure");
    store.dispatch(
      openNotificationModal("Notifications", "Failed to send job")
    );
    return false;
  }
  beginJob(job_id: string, job_name: string, mid: string): Promise<Job> {
    return this.jobRepository
      .beginJob(job_id, job_name, mid)
      .catch((err: Error) => {
        this.handleError(err);
        throw err;
      });
  }
  startJob(job_id: string, sentJob: boolean): Promise<Job> {
    this.logService.log("Starting job");
    return this.jobRepository
      .startJob(job_id)
      .then((job: Job) => {
        if (sentJob) {
          store.dispatch(receiveSentJobs({ [job.id]: job }));
        } else {
          store.dispatch(receiveReceivedJobs({ [job.id]: job }));
        }
        return job;
      })
      .catch((err: Error) => {
        this.handleError(err);
        throw err;
      });
  }
  stopJob(job_id: string, sentJob: boolean): Promise<Job> {
    this.logService.log("Stopping job");
    return this.jobRepository
      .stopJob(job_id)
      .then((job: Job) => {
        if (sentJob) {
          store.dispatch(receiveSentJobs({ [job.id]: job }));
        } else {
          store.dispatch(receiveReceivedJobs({ [job.id]: job }));
        }
        return job;
      })
      .catch((err: Error) => {
        this.handleError(err);
        throw err;
      });
  }
  pauseJob(job_id: string, sentJob: boolean): Promise<Job> {
    this.logService.log("Pausing job");
    return this.jobRepository
      .pauseJob(job_id)
      .then((job: Job) => {
        if (sentJob) {
          store.dispatch(receiveSentJobs({ [job.id]: job }));
        } else {
          store.dispatch(receiveReceivedJobs({ [job.id]: job }));
        }
        return job;
      })
      .catch((err: Error) => {
        this.handleError(err);
        throw err;
      });
  }
  archiveJob(
    job_id: string,
    sentJob: boolean,
    isArchived: boolean
  ): Promise<Job> {
    this.logService.log("job service", isArchived);
    return this.jobRepository
      .archiveJob(job_id, isArchived)
      .then((job: Job) => {
        if (sentJob) {
          this.logService.log("job", job);
          store.dispatch(receiveSentJobs({ [job.id]: job }));
        } else {
          store.dispatch(receiveReceivedJobs({ [job.id]: job }));
        }
        return job;
      })
      .catch((err: Error) => {
        this.handleError(err);
        throw err;
      });
  }
  killJob(job_id: string, sentJob: boolean): Promise<Job> {
    return this.jobRepository
      .killJob(job_id)
      .then((job: Job) => {
        if (sentJob) {
          store.dispatch(receiveSentJobs({ [job.id]: job }));
        } else {
          store.dispatch(receiveReceivedJobs({ [job.id]: job }));
        }
        return job;
      })
      .catch((err: Error) => {
        this.handleError(err);
        throw err;
      });
  }
  getProcessInfo(job_id: string) {
    return this.jobRepository.getProcessInfo(job_id).catch((err: Error) => {
      this.handleError(err);
    });
  }
  getLogInfo(job_id: string) {
    return this.jobRepository.getLogInfo(job_id).catch((err: Error) => {
      this.handleError(err);
    });
  }
  getJobResults(job_id: string) {
    return this.jobRepository
      .getJobResults(job_id)
      .then((urlObject: GetUploadUrlResponse) => {
        if (urlObject.files.length === 0) {
          this.handleError({ message: "Unable to download results." } as Error);
          return;
        }
        this.logService.log(urlObject);
        urlObject.files.forEach((uploadObject: UploadUrl) => {
          this.jobRepository.downloadJobResult(
            job_id,
            uploadObject.filename,
            uploadObject.path,
            uploadObject.nonce
          );
        });
      })
      .catch((err: Error) => {
        this.handleError(err);
      });
  }
}

interface FileObject {
  name: string;
  content: ArrayBuffer | string;
}
