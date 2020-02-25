import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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
  return (
    <div
      className="section-header station-users-header-collapsed"
      onClick={setMode("Users")}
    >
      <span>
        <FontAwesomeIcon
          icon={faUser}
          style={{ marginLeft: 5, marginRight: 5 }}
        />{" "}
        Launchers ({station.members.length})
      </span>
      {station.owner == currentUser.user_id && (
        <div className="plus-container" onClick={toggleInviteUsers}>
          <i className="fal fa-plus-circle" />
        </div>
      )}
    </div>
  );
};

export default StationUserHeader;
