import { Machine } from "../../../../business/objects/machine";
import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import React from "react";
import StationMachineContainer from "./StationMachineContainer";
import StationMachineHeader from "./StationMachineHeader";

interface StationMachineExpandedProps {
  station: Station;
  currentUser: User;
  handleOpenMachineModal: any;
  stationMachines: Machine[];
  setMode: Function;
}

const StationMachineExpanded: React.SFC<StationMachineExpandedProps> = (
  props: StationMachineExpandedProps
) => {
  const {
    station,
    currentUser,
    handleOpenMachineModal,
    stationMachines,
    setMode
  } = props;

  const onlineMachines: Machine[] = [];
  const offlineMachines: Machine[] = [];

  stationMachines.map((machine: Machine) => {
    if (machine.status == "online") {
      onlineMachines.push(machine);
    } else {
      offlineMachines.push(machine);
    }
  });

  return (
    <>
      <StationMachineHeader
        station={station}
        currentUser={currentUser}
        handleOpenMachineModal={handleOpenMachineModal}
        setMode={setMode}
      />
      <div className="station-machines">
        <StationMachineContainer
          online={true}
          machines={onlineMachines}
          station={station}
          currentUser={currentUser}
        />
        <StationMachineContainer
          online={false}
          machines={offlineMachines}
          station={station}
          currentUser={currentUser}
        />
      </div>
    </>
  );
};

export default StationMachineExpanded;
