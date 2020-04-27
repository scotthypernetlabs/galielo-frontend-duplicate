import { Dictionary } from "./dictionary";
import { IMachine } from "../../api/objects/machine";

export class Machine {
  constructor(
    public machine_name: string,
    public owner: string,
    public status: string,
    public mid: string,
    public gpu: string,
    public cpu: string,
    public os: string,
    public arch: string,
    public memory: string,
    public jobs_in_queue: number,
    public running_jobs_limit: number,
    public running_jobs: number
  ) {}
}

export enum MachinesSortOptions {
  created = "Date Created",
  name = "Name",
  memory = "Memory",
  cores = "# of Cores"
}

export enum EMachineSortBy {
  "Date Created" = "date_created",
  "Name" = "name",
  "Memory" = "memory",
  "# of Cores" = "cpu"
}

export class GetMachinesFilter {
  constructor(
    public mids?: string[],
    public userids?: string[],
    public partial_names?: string[],
    public stationids?: string[],
    public sort_by?: EMachineSortBy[],
    public sort_order?: "asc" | "desc"
  ) {}
}

export function convertToBusinessMachine(machines: IMachine[]) {
  return machines.map(machine => {
    return new Machine(
      machine.name,
      machine.userid,
      machine.status,
      machine.mid,
      machine.gpu,
      machine.cpu,
      machine.os,
      machine.arch,
      machine.memory,
      machine.jobs_in_queue,
      machine.running_jobs_limit,
      machine.running_jobs
    );
  });
}
