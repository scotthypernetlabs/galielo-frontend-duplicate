import { Box, Typography } from "@material-ui/core";
import { Machine } from "../../business/objects/machine";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faSdCard, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { green, red } from "../theme";
import IconText from "../Core/IconText";
import ProgressBar from "../ProgressBar";
import React from "react";

interface LandingZoneProps {
  machine: Machine;
  station: boolean;
  fileUploadText?: string;
}

const LandingZone: React.SFC<LandingZoneProps> = (props: LandingZoneProps) => {
  const { machine, station, fileUploadText } = props;
  let memory: number = 0;
  let cores: number = 0;
  if (machine.memory !== "Unknown") {
    memory = parseInt((parseInt(machine.memory) / 1e9).toFixed(1));
  }
  if (machine.cpu !== "Unknown") {
    cores = +machine.cpu;
  }
  const iconColor =
    machine.status.toUpperCase() === "ONLINE" ? green.main : red.main;

  const borderColor = station
    ? machine.status.toUpperCase() === "ONLINE"
      ? "primary.main"
      : "red"
    : "#999";

  const memoryText = `${memory}GB`;
  const coresText = `${cores} Cores`;

  return (
    <Box
      border={station ? "2px dashed" : "0.5px solid"}
      borderColor={borderColor}
      borderRadius={5}
      bgcolor="rgb(255, 255, 255, 0.5)"
      p={3}
      m={1}
      minWidth="250px"
      maxWidth="250px"
      minHeight={station ? "130px" : "100px"}
      maxHeight={station ? "130px" : "100px"}
      className={station ? "station-box" : ""}
    >
      <Box display="flex" flexWrap="noWrap" mb={0.75}>
        <IconText
          icon={faCircle}
          text={machine.machine_name}
          textVariant="h4"
          noWrap={true}
          iconColor={iconColor}
          iconSize="xs"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        mb={0.75}
      >
        <Box flexGrow={1}>
          <IconText
            icon={faSdCard}
            text={memoryText}
            textVariant="h5"
            textColor="grey"
          />
        </Box>
        <Box>
          <IconText
            icon={faTachometerAlt}
            text={coresText}
            textVariant="h5"
            textColor="grey"
          />
        </Box>
      </Box>
      {station && (
        <Box mb={0.75}>
          <Typography variant="h5">{fileUploadText}</Typography>
        </Box>
      )}
      <Box mb={0.75}>
        <ProgressBar type={"machine"} id={machine.mid} />
      </Box>
    </Box>
  );
};

export default LandingZone;
