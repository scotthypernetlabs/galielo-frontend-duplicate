import {
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { Close } from "@material-ui/icons";
import React from "react";

interface TopModalViewProps {
  text: any;
  isOpen: boolean;
  handleClose: any;
}

interface DialogTitleProps {
  title: string;
  handleClose: any;
}

const DialogTitle: React.SFC<DialogTitleProps> = (props: DialogTitleProps) => {
  const { title, handleClose } = props;
  return (
    <MuiDialogTitle disableTypography>
      <Typography variant="h4">{title}</Typography>
      <IconButton onClick={handleClose} className="close-button add-cursor">
        <Close />
      </IconButton>
    </MuiDialogTitle>
  );
};

const TopModalView: React.SFC<TopModalViewProps> = (
  props: TopModalViewProps
) => {
  const { text, isOpen, handleClose } = props;
  const titles = text.Titles;
  const processes = text.Processes;

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <DialogTitle handleClose={handleClose} title="Process Logs" />
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {titles.map((title: string, idx: number) => {
                return (
                  <TableCell align="center" key={title}>
                    {title}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {processes.map((process_array: string[], idx: number) => {
              return (
                <TableRow key={idx}>
                  {process_array.map((process: string, idx2: number) => {
                    return <TableCell key={idx2}>{process}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};
export default TopModalView;
