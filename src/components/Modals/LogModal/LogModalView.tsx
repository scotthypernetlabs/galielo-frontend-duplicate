import {Dialog, IconButton, Typography} from "@material-ui/core";
import { ICloseModal } from "../../../actions/modalActions";
import React from "react";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";

interface LogModalViewProps {
  logTextArray: any;
  handleClose: any;
  isOpen: boolean;
}

const LogModalView: React.SFC<LogModalViewProps> = (
  props: LogModalViewProps
) => {
  const { logTextArray, handleClose, isOpen } = props;
  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <MuiDialogTitle disableTypography>
        <Typography variant="h4">Container Logs</Typography>
        <IconButton
          onClick={handleClose}
          className="close-notifications add-cursor"
        >
          <i className="fal fa-times" style={{ fontSize: 20 }} />
        </IconButton>
      </MuiDialogTitle>
      {logTextArray.map((line: string, idx: number) => {
        return (
          <div key={idx}>
            <Typography variant="h5">{line}</Typography>
          </div>
        );
      })}
    </Dialog>
  );
};

export default LogModalView;
