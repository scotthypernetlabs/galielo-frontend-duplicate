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
  JobStatusType
} from "../../business/objects/job";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "../Core/DialogTitle";
import React from "react";
import DialogActions from "@material-ui/core/DialogActions";

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
  if (statusHistory) {
    // Sort in descending order
    statusHistory.sort((var1: JobStatus, var2: JobStatus) => {
      const a = new Date(var1.timestamp);
      const b = new Date(var2.timestamp);
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    });
  }
  return (
    <Dialog onClose={handleClose} open={isOpen} maxWidth="md">
      <DialogTitle title={title} handleClose={handleClose} />
      <DialogContent>
        <DialogContentText>
          {statusHistory.map((jobStatus: JobStatus, idx: number) => {
            const decodedStatus: JobStatusType =
              JobStatusDecode[jobStatus.status.toString()];

            let date = new Date(jobStatus.timestamp * 1000).toString();
            date = date.slice(0, date.indexOf("GMT"));

            if (
              statusHistory[idx - 1] &&
              JobStatusDecode[statusHistory[idx - 1].status.toString()] ==
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
        </DialogContentText>
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
