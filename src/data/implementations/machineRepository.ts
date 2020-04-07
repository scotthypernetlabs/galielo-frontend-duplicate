import {
  GetMachinesFilter,
  Machine,
  convertToBusinessMachine
} from "../../business/objects/machine";
import { IMachine } from "../../api/objects/machine";
import { IMachineRepository } from "../interfaces/IMachineRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { MyContext } from "../../MyContext";
import { context } from "../../context";

function generateMachineUrl(
  backend_url: string,
  filterOptions: GetMachinesFilter
) {
  const baseUrl = `${backend_url}/machines`;
  const keys = Object.keys(filterOptions).filter(
    (key: keyof GetMachinesFilter) => filterOptions[key]
  );
  if (keys.length === 0) {
    return baseUrl;
  } else {
    let appendedUrl: string = "?";
    keys.forEach((key: keyof GetMachinesFilter, idx) => {
      if (idx > 0) {
        appendedUrl += "&";
      }
      filterOptions[key].forEach((value, idx) => {
        if (idx > 0) {
          appendedUrl += "&";
        }
        appendedUrl += `${key}=${value}`;
      });
    });
    return baseUrl + appendedUrl;
  }
}

export class MachineRepository implements IMachineRepository {
  protected backend: string;

  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }

  getMachine(mid: string) {
    return this.requestRepository
      .requestWithAuth(`${this.backend}/machines/${mid}`, "GET")
      .then((response: IGetMachineResponse) => {
        return convertToBusinessMachine([response.machine])[0];
      });
  }
  async getMachines(filterOptions?: GetMachinesFilter) {
    const url = generateMachineUrl(this.backend, filterOptions);
    const response: IGetMachinesResponse = await this.requestRepository.requestWithAuth(
      url,
      "GET"
    );
    return convertToBusinessMachine(response.machines);
  }
  async modifyMachineQueueLimit(mid: string, running_jobs_limit: number) {
    const response: IGetMachineResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/machines/${mid}`,
      "PUT",
      { running_jobs_limit }
    );
    return convertToBusinessMachine([response.machine])[0];
  }
  async updateMachine(mid: string, request: UpdateMachineRequest) {
    const response: IGetMachineResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/machines/${mid}`,
      "PUT",
      { active: request.active }
    );
    return convertToBusinessMachine([response.machine])[0];
  }
}

export class UpdateMachineRequest {
  constructor(public active?: boolean, public running_jobs_limit?: number) {}
}

export interface IGetMachineResponse {
  machine: IMachine;
}
export interface IGetMachinesResponse {
  machines: IMachine[];
}
