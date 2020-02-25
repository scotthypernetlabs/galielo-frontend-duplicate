import { History } from "history";
import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import React from "react";
import StationUserHeader from "./StationUserHeader";
import StationMember from "../../StationMember";

interface StationUserExpandedProps {
  setMode: Function;
  station: Station;
  currentUser: User;
  toggleInviteUsers: any;
  history: History<any>;
}

const StationUserExpanded: React.SFC<StationUserExpandedProps> = (
  props: StationUserExpandedProps
) => {
  const { station, currentUser, toggleInviteUsers, history, setMode } = props;
  return (
    <>
      <StationUserHeader
        setMode={setMode}
        station={station}
        currentUser={currentUser}
        toggleInviteUsers={toggleInviteUsers}
      />
      <div className="station-users">
        {station.members.map((userId: string) => {
          return (
            <React.Fragment key={userId}>
              <StationMember
                user_id={userId}
                history={history}
                station={station}
              />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default StationUserExpanded;
