import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import { darkGrey } from "../../../theme";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons";
import IconText from "../../../Core/IconText";
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
  const text = `Landing Zones (${station.machines.length})`;
  return (
    <div
      className="section-header station-machines-header-collapsed"
      onClick={setMode("Machines")}
    >
      <span>
        <IconText
          icon={faChalkboard}
          text={text}
          textVariant="h5"
          color={darkGrey.main}
        />
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
