import { Machine } from "../business/objects/machine";
import { Dictionary } from "../business/objects/dictionary";
import { Station } from "../business/objects/station";
import { User } from "../business/objects/user";

export function parseStationMachines(station_ids: string[], machines: Dictionary<Machine>){
  let stationMachines:Machine[] = [];
  station_ids.forEach(station_id => {
    stationMachines.push(machines[station_id]);
  })
  return stationMachines;
}

export function parseOwnedMachines(owned_mids: string[], machines: Dictionary<Machine>){
  // let ownedMachines:Machine[] = [];
}
