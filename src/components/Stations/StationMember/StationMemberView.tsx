import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { UserIconNew } from "../../svgs/UserIconNew";
import React from "react";

interface StationMemberViewProps {
  station: Station;
  user: User;
  currentUser: User;
  handleRemoveUser: any;
}

const StationMemberView: React.SFC<StationMemberViewProps> = (
  props: StationMemberViewProps
) => {
  const { station, user, currentUser, handleRemoveUser } = props;
  return (
    <div className="station-member">
      <div className="member-icon">{UserIconNew("OFFLINE", 35)}</div>
      <div className="member-details">
        <div className="member-name" />
        <div className="member-email">{user.username}</div>
        {station.admins.indexOf(currentUser.user_id) >= 0 &&
          station.admins.indexOf(user.user_id) < 0 && (
            <div className="remove-user add-cursor">
              <i
                className="delete-btn fas fa-trash-alt"
                onClick={handleRemoveUser}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default StationMemberView;
