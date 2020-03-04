import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import { darkGrey } from "../../../theme";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import IconText from "../../../Core/IconText";
import React from "react";

interface StationUserHeaderProps {
  setMode: Function;
  station: Station;
  currentUser: User;
  toggleInviteUsers: any;
}

const StationUserHeader: React.SFC<StationUserHeaderProps> = (
  props: StationUserHeaderProps
) => {
  const { setMode, station, currentUser, toggleInviteUsers } = props;
  const text = `Launchers (${station.members.length})`;
  return (
    <div
      className="section-header station-users-header-collapsed"
      onClick={setMode("Users")}
    >
      <span>
        <IconText
          icon={faUser}
          text={text}
          textVariant="h5"
          color={darkGrey.main}
        />
      </span>
      {station.owner.includes(currentUser.user_id) && (
        <div className="plus-container" onClick={toggleInviteUsers}>
          <i className="fal fa-plus-circle" />
        </div>
      )}
    </div>
  );
};

export default StationUserHeader;
