import { Grid, Icon, Tooltip, Typography } from "@material-ui/core";
import { Machine } from "../../../../business/objects/machine";
import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
// ?import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import StationMachine from "./StationMachine";

interface StationMachineContainerProps {
  online: boolean;
  machines: Machine[];
  station: Station;
  currentUser: User;
}

const StationMachineContainer: React.SFC<StationMachineContainerProps> = (
  props: StationMachineContainerProps
) => {
  const { online, machines, station, currentUser } = props;
  const header = online ? "Online" : "Offline";
  return (
    <Grid container style={{ paddingBottom: 30 }}>
      <Grid item xs={12}>
        <Typography style={{ float: "left" }}>
          {header} ({machines.length})
        </Typography>
        {online || (
          <Tooltip
            disableFocusListener
            disableTouchListener
            arrow={true}
            title="You can still send jobs to offline machines and your jobs will start running once the machines are online."
          >
            <div
              style={{ float: "left", marginLeft: 10 }}
              className="add-cursor"
            >
              <Icon style={{ fontSize: 16 }}>info</Icon>
            </div>
          </Tooltip>
        )}
      </Grid>
      {machines.map((machine: Machine, idx: number) => {
        return (
          <div className="machine-in-station" key={idx}>
            <StationMachine
              machine={machine}
              station={station}
              currentUser={currentUser}
            />
          </div>
        );
      })}
    </Grid>
  );
};

export default StationMachineContainer;
