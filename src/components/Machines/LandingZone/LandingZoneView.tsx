import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogContentText, DialogActions, Button, Button } from "@material-ui/core";
import {
  faCircle,
  faSdCard,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";
import { green, red } from "../../theme";
import IconText from "../../Core/IconText";
import ProgressBar from "../../ProgressBar";
import React from "react";

interface LandingZoneViewProps {
  machineStatus: string;
  machineName: string;
  machineId: string;
  memoryText: string;
  coresText: string;
  uploadText: string;
  inStation: boolean;
  showText: boolean;
}

const LandingZoneView: React.SFC<LandingZoneViewProps> = (
  props: LandingZoneViewProps
) => {
  const {
    machineStatus,
    machineName,
    machineId,
    memoryText,
    coresText,
    uploadText,
    inStation,
    showText
  } = props;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };
  const boxClasses  = () => {
    return [(inStation ? "station-box" : ""), "button"].join(" ")
  }
  return (
    <Box
      onClick={handleClickOpen}
      border={inStation ? "2px dashed" : "0.5px solid"}
      borderColor={
        inStation
          ? machineStatus === "ONLINE"
            ? "primary.main"
            : "red"
          : "#999"
      }
      borderRadius={5}
      bgcolor="rgb(255, 255, 255, 0.5)"
      p={3}
      m={1}
      minWidth="250px"
      maxWidth="250px"
      minHeight={inStation ? "130px" : "100px"}
      maxHeight={inStation ? "130px" : "100px"}
      className={boxClasses()}
    >
      <Box display="flex" flexWrap="noWrap" mb={0.75} mr={4}>
        <IconText
          icon={faCircle}
          text={machineName}
          textVariant="h4"
          noWrap={true}
          iconColor={machineStatus === "ONLINE" ? green.main : red.main}
          iconSize="xs"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        mb={0.75}
        mr={4}
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
      {showText && (
        <Box mb={0.75}>
          <Typography variant="h5">{uploadText}</Typography>
        </Box>
      )}
      <Box mb={0.75}>
        <ProgressBar type={"machine"} id={machineId} />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LandingZoneView;
