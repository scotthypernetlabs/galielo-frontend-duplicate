import { Dictionary } from "../business/objects/dictionary";
import { Machine } from "../business/objects/machine";
import { Station } from "../business/objects/station";
import { User } from "../business/objects/user";

export function parseStationMachines(
  station_mids: string[],
  machines: Dictionary<Machine>
) {
  const stationMachines: Machine[] = [];
  station_mids.forEach(station_mid => {
    if (machines[station_mid]) {
      stationMachines.push(machines[station_mid]);
    }
  });
  return stationMachines;
}

export function parseOwnedMachines(
  owned_mids: string[],
  machines: Dictionary<Machine>
) {
  // let ownedMachines:Machine[] = [];
}
