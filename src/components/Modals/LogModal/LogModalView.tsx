import "./LogModal.scss";
import { Dialog, DialogContent, Typography } from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "../../Core/DialogTitle/DialogTitle";
import React from "react";

interface LogModalViewProps {
  text?: any;
  handleClose: any;
  isOpen: boolean;
}

const LogModalView: React.SFC<LogModalViewProps> = (
  props: LogModalViewProps
) => {
  const { text, handleClose, isOpen } = props;

  return (
    <Dialog onClose={handleClose} open={isOpen} scroll="paper" maxWidth="lg">
      <DialogTitle title="Standard Logs" handleClose={handleClose} />
      <DialogContent className="dialog-content" dividers={true}>
        <DialogContentText>
          {text ? (
            text.split(/\r?\n/g).map((line: string, idx: number) => {
              return (
                <div key={idx}>
                  <Typography variant="h5">{line}</Typography>
                </div>
              );
            })
          ) : (
            <Typography variant="h5">No Logs Available</Typography>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default LogModalView;
