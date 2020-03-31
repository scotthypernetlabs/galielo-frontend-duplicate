import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core";
import { green, red } from "../../theme";
import IconText from "../../Core/IconText";
import ProgressBar from "../../ProgressBar";
import React, { useState } from "react";

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
  currentUser: string;
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
    machineRunninJobs,
    currentUser
  } = props;
  const [open, setOpen] = useState(false);
  const [runningJobsLimit, setRunningJobsLimit] = useState(1);
  const [changed, setChanged] = useState(false);
  const handleClickOpen = (e: any) => {
    if (!open && !inStation) {
      setOpen(true);
    }
  };
  const handleClose = (e: any) => {
    setOpen(false);
  };
  const handleRunningJobsChange = (e: any) => {
    setRunningJobsLimit(e.target.value);
  };

  const submit = () => {
    updateRunningJobLimit(machineId, runningJobsLimit);
    setOpen(false);
  };
  const limitChanged = (e: any) => {
    if (e.target.value > 0) {
      setChanged(true);
    } else if (e.target.value == 0) {
      setChanged(false);
    }
  };

  const boxClasses = () => {
    return [inStation ? "station-box" : "", "button"].join(" ");
  };
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
          icon="fiber_manual_record"
          text={machineName}
          textVariant="h4"
          noWrap={true}
          iconColor={machineStatus === "ONLINE" ? green.main : red.main}
          iconSize={14}
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
            icon="sd_card"
            text={memoryText}
            textVariant="h5"
            textColor="grey"
            iconSize={16}
          />
        </Box>
        <Box>
          <IconText
            icon="speed"
            text={coresText}
            textVariant="h5"
            textColor="grey"
            iconSize={18}
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
        // fullScreen
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box p={3}>
          <Typography id="alert-dialog-title">{machineName}</Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box mb={1} mt={1}>
                <Typography variant="h6" id="alert-dialog-title">
                  Status
                </Typography>
                <Typography variant="h5" id="alert-dialog-title">
                  {machineStatus}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="h6" id="alert-dialog-title">
                  Cores
                </Typography>
                <Typography variant="h5" id="alert-dialog-title">
                  {coresText}
                </Typography>
              </Box>

              <Box mb={1}>
                <Typography variant="h6" id="alert-dialog-title">
                  Memory
                </Typography>
                <Typography variant="h5" id="alert-dialog-title">
                  {memoryText}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={1} mt={1}>
                <Typography variant="h6" id="alert-dialog-title">
                  CPU
                </Typography>
                <Typography variant="h5" id="alert-dialog-title">
                  {machineCpu}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="h6" id="alert-dialog-title">
                  OS
                </Typography>
                <Typography variant="h5" id="alert-dialog-title">
                  {machineOS}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="h6" id="alert-dialog-title">
                  Job Limits
                </Typography>
                <Typography variant="h5" id="alert-dialog-title">
                  {machineRunningJobsLimit}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {machineOwner == currentUser && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              p={1}
              bgcolor="background.paper"
            >
              <Box mr={3}>
                <DialogContentText id="alert-dialog-description">
                  Update running jobs limit:
                </DialogContentText>
              </Box>
              <Box>
                <FormControl className="select-small" variant="outlined">
                  <Select
                    value={runningJobsLimit}
                    onChange={handleRunningJobsChange}
                    onOpen={() => setRunningJobsLimit(machineRunninJobs)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
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
