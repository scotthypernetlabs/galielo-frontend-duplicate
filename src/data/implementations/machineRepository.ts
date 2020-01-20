import { IMachineRepository } from '../interfaces/IMachineRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { Machine } from '../../business/objects/machine';
import { IMachine } from '../../api/objects/machine';
import {MyContext} from "../../MyContext";
import {context} from "../../context";

function convertToBusinessMachine(machines: IMachine[]){
  return machines.map((machine) => {
    return new Machine(
      machine.name, machine.userid, machine.status, machine.id, machine.gpu,
      machine.cpu, machine.os, machine.arch, machine.memory,
      machine.jobs_in_queue, machine.running_jobs_limit, machine.running_jobs
    )
  })
}

export class MachineRepository implements IMachineRepository {
  protected backend: string;

  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository) {
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }

  getMachine(mid: string) {
    return this.requestRepository.requestWithAuth(`${this.backend}/machines/${mid}`, 'GET')
      .then((response: IGetMachineResponse) => {
        return convertToBusinessMachine([response.machine])[0];
      })
  }
  async getMachines(mids?: string[]){
    let url = `${this.backend}/machines`;

    if(mids) {
      let appendedUrl:string = `?`;
      mids.forEach((mid,idx) => {
        let filterString:string = '';
        if(idx > 0){
          filterString+= '&';
        }
        filterString +=`mids=${mid}`;
        appendedUrl += filterString;
      });
      if(mids.length > 0){
        url += appendedUrl;
      }
    }

    let response:IGetMachinesResponse = await this.requestRepository.requestWithAuth(url, 'GET');
    return convertToBusinessMachine(response.machines);
    // let machineArray:Promise<Machine>[] = [];
    // mids.forEach((mid) => {
    //   let machine = this.getMachine(mid);
    //   machineArray.push(machine);
    // })
    // return Promise.all(machineArray);
  }
}

export interface IGetMachineResponse {
  machine: IMachine;
}
export interface IGetMachinesResponse {
  machines: IMachine[];
}
