import { Box, Link } from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
import { Station } from "../../business/objects/station";
import { User } from "../../business/objects/user";
import Alert from "@material-ui/lab/Alert";
import React from "react";

interface GalileoAlertProps {
  users: Dictionary<User>;
  station: Station;
  handleStationRequest: Function;
}

const GalileoAlert: React.SFC<GalileoAlertProps> = (
  props: GalileoAlertProps
) => {
  const { users, station, handleStationRequest } = props;
  return (
    <div
      style={{
        marginLeft: 250,
        width: "calc(100% - 250px)",
        position: "absolute"
      }}
    >
      <Alert severity="info" icon={false}>
        <Box display="flex" flexDirection="row" justifyContent="flex-start">
          <Box flexGrow={1}>
            {users[station.owner].username} invited you to join this station.
          </Box>
          <Box>
            <Link
              style={{ margin: 10, color: "white" }}
              onClick={handleStationRequest(station.id, true)}
            >
              {" "}
              Accept
            </Link>
          </Box>
          <Box>
            <Link
              style={{ margin: 10, color: "white" }}
              onClick={handleStationRequest(station.id, false)}
            >
              Decline
            </Link>
          </Box>
        </Box>
      </Alert>
    </div>
  );
};

export default GalileoAlert;
