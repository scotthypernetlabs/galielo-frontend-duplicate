import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface StationMachineHeaderProps {
  station: Station;
  currentUser: User;
  handleOpenMachineModal: any;
  setMode: Function;
}

const StationMachineHeader: React.SFC<StationMachineHeaderProps> = (
  props: StationMachineHeaderProps
) => {
  const { station, currentUser, handleOpenMachineModal, setMode } = props;

  return (
    <div
      className="section-header station-machines-header-collapsed"
      onClick={setMode("Machines")}
    >
      <span>
        <FontAwesomeIcon
          icon={faChalkboard}
          style={{ marginLeft: 5, marginRight: 5 }}
        />{" "}
        Landing Zones ({station.machines.length})
      </span>
      {station.members.includes(currentUser.user_id) && (
        <div className="plus-container" onClick={handleOpenMachineModal}>
          <i className="fal fa-plus-circle" />
        </div>
      )}
    </div>
  );
};

export default StationMachineHeader;
