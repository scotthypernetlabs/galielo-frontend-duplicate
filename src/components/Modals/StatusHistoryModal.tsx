import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Typography
} from "@material-ui/core";
import {
  Job,
  JobStatus,
  JobStatusDecode,
  JobStatusType,
  decodeJobStatus
} from "../../business/objects/job";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "../Core/DialogTitle";
import React from "react";

interface StatusHistoryModalProps {
  statusHistory?: JobStatus[];
  isOpen: boolean;
  handleClose: any;
  title: string;
}

const StatusHistoryModal: React.SFC<StatusHistoryModalProps> = (
  props: StatusHistoryModalProps
) => {
  const { statusHistory, isOpen, handleClose, title } = props;
  let filteredStatusHistory: JobStatus[];
  if (statusHistory) {
    // Sort in descending order
    statusHistory.sort((var1: JobStatus, var2: JobStatus) => {
      const a = new Date(var1.timestamp).getTime();
      const b = new Date(var2.timestamp).getTime();
      return b - a;
    });

    const set = new Set();

    // only display a decoded status once unless it's Job Paused or In Progress
    filteredStatusHistory = statusHistory.filter(
      (x: JobStatus, idx: number) => {
        const decodedStatus = JobStatusDecode[x.status.toString()].status;
        // last status is effectively the same as the current status
        if (
          idx > 0 &&
          decodedStatus ==
            JobStatusDecode[statusHistory[idx - 1].status.toString()].status
        ) {
          return false;
        }

        // status should be in the list if Paused or In Progress
        if (
          decodedStatus == "Job Paused" ||
          decodedStatus == "Job In Progress"
        ) {
          return true;
        }

        // Put it in the set to keep track of the statuses we already have
        if (!set.has(decodedStatus)) {
          set.add(decodedStatus);
          return true;
        }
        return false;
      }
    );
  }
  return (
    <Dialog onClose={handleClose} open={isOpen} maxWidth="md">
      <DialogTitle title={title} handleClose={handleClose} />
      <DialogContent>
          {statusHistory.map((jobStatus: JobStatus, idx: number) => {
            const decodedStatus: JobStatusType =
              decodeJobStatus(jobStatus.status.toString());

          let date = new Date(jobStatus.timestamp * 1000).toString();
          date = date.slice(0, date.indexOf("GMT"));
            if (
              statusHistory[idx - 1] &&
              decodeJobStatus(statusHistory[idx - 1].status.toString()) ==
                decodedStatus
            ) {
              return <React.Fragment key={idx}></React.Fragment>;
            }

            return (
              decodedStatus && (
                <React.Fragment key={idx}>
                  {idx != 0 && <Divider light={true} />}
                  <Typography variant="h6">{date}</Typography>
                  <Box display="flex" key={idx} mb={2}>
                    <Box width={200}>
                      <Typography variant="h5" style={{ fontWeight: 600 }}>
                        {decodedStatus.status}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5">
                        {decodedStatus.verbose}
                      </Typography>
                    </Box>
                  </Box>
              </React.Fragment>
            )
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusHistoryModal;
