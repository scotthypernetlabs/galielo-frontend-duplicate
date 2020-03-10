import { Box, Typography, Dialog, DialogTitle, DialogContent,  DialogContentText, DialogActions, Button, TextField } from "@material-ui/core";
import {
  faCircle,
  faSdCard,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";
import { green, red } from "../../theme";
import IconText from "../../Core/IconText";
import ProgressBar from "../../ProgressBar";
import React, { useState } from "react";
import { Machine } from "../../../business/objects/machine";
import { context } from "../../../context";

interface LandingZoneViewProps {
  machineStatus: string;
  machineName: string;
  machineId: string;
  memoryText: string;
  coresText: string;
  uploadText: string;
  inStation: boolean;
  showText: boolean;
  updateRunningJobLimit: any;
  machineOwner: string;
  machineCpu: string;
  machineOS: string;
  machineArch: string;
  machineJobsInQueue: number;
  machineRunningJobsLimit: number;
  machineRunninJobs: number;
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
    showText,
    updateRunningJobLimit,
    machineOwner,
    machineCpu,
    machineOS,
    machineArch,
    machineJobsInQueue,
    machineRunningJobsLimit,
    machineRunninJobs
  } = props;
  const [open, setOpen] = useState(false);
  const [runningJobsLimit, setRunningJobsLimit] = useState(0);
  const handleClickOpen = (e:any) => {
    if (!open){
      setOpen(true);
    }
  };
  const  handleClose =(e:any) => {
    setOpen(false);
  }
  const  handleRunningJobsChange =(e:any) => {
    setRunningJobsLimit(e.target.value)
  }

  const submit = ()=> {
    updateRunningJobLimit(machineId, runningJobsLimit)
    setOpen(false);
  }


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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box p = {3}>
        <Typography id="alert-dialog-title">{machineName}</Typography>
          <Box mb = {1} mt = {1}>
            <Typography variant = "h6" id="alert-dialog-title">Status</Typography>
            <Typography variant = "h5" id="alert-dialog-title">{machineStatus}</Typography>
          </Box>

          <Box mb = {1}>
            <Typography variant = "h6" id="alert-dialog-title">Cores</Typography>
            <Typography variant = "h5" id="alert-dialog-title">{coresText}</Typography>
          </Box>

          <Box mb = {1}>
            <Typography variant = "h6" id="alert-dialog-title">Memory</Typography>
            <Typography variant = "h5" id="alert-dialog-title">{memoryText}</Typography>
          </Box>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Update running jobs limit:
          </DialogContentText>
          <TextField
            autoFocus
            onBlur = {handleRunningJobsChange}
            margin="dense"
            id="name"
            InputProps={{ inputProps: { min: 0, max: 10 } }}
            label=""
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={submit} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LandingZoneView;
