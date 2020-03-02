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

import { ICloseModal } from "../../../actions/modalActions";
import React from "react";

interface TopModalViewProps {
  text: any;
  isOpen: boolean;
  handleClose: any;
}
const TopModalView: React.SFC<TopModalViewProps> = (
  props: TopModalViewProps
) => {
  const { text, isOpen, handleClose } = props;
  const titles = text.Titles;
  const processes = text.Processes;

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <MuiDialogTitle disableTypography>
        <Typography variant="h4">Process Logs</Typography>
        <div onClick={handleClose} className="close-notifications add-cursor">
          <i className="fal fa-times" style={{ fontSize: 20 }} />
        </div>
      </MuiDialogTitle>
      <TableContainer>
        <Table stickyHeader size="small" style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {titles.map((title: string, idx: number) => {
                return <TableCell align="center" key={title} />;
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
