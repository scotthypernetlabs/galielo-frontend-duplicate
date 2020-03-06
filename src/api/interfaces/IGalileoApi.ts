import { DockerLog } from "../../business/objects/job";
import { IJob } from "../objects/job";
import { TypedEvent } from "../../business/objects/TypedEvent";

export interface IGalileoApi {
  onJobsTop: TypedEvent<JobsTop>;
  onJobsLog: TypedEvent<JobsLog>;
  initialize(): void;
}

export class JobsTop {
  constructor(public jobs: IJob, public logs: DockerLog) {}
}

export class JobsLog {
  constructor(public jobs: IJob, public logs: string) {}
}
