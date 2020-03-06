import "./TopModal.scss";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import DialogTitle from "../../Core/DialogTitle/DialogTitle";
import React from "react";

type TopText = {
  Titles: string[];
  Processes: Array<string[]>;
}

interface TopModalViewProps {
  text?: TopText;
  isOpen: boolean;
  handleClose: any;
}

const TopModalView: React.SFC<TopModalViewProps> = (
  props: TopModalViewProps
) => {
  const { text, isOpen, handleClose } = props;

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <DialogTitle handleClose={handleClose} title="Process Logs" />
      <DialogContent dividers={true}>
        <DialogContentText>
          {text ? (
            <TableContainer>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {text.Titles.map((title: string, idx: number) => {
                      return (
                        <TableCell align="center" key={title}>
                          {title}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {text.Processes.map(
                    (process_array: string[], idx: number) => {
                      return (
                        <TableRow key={idx}>
                          {process_array.map(
                            (process: string, idx2: number) => {
                              return (
                                <TableCell key={idx2}>{process}</TableCell>
                              );
                            }
                          )}
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h5">No Logs Available</Typography>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
export default TopModalView;
