import { ICloseModal } from "../../../actions/modalActions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import React from "react";

interface TopModalViewProps {
  text: any;
  closeModal: () => ICloseModal;
}
const TopModalView: React.SFC<TopModalViewProps> = (
  props: TopModalViewProps
) => {
  const { text, closeModal } = props;
  const titles = text.Titles;
  const processes = text.Processes;
  return (
    <div className="modal-style" style={{ maxWidth: "60%" }}>
      <TableContainer>
        <Table stickyHeader size="small" style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {titles.map((title: string, idx: number) => {
                return (
                  <TableCell key={idx} align="center">
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
      <div onClick={closeModal} className="close-notifications add-cursor">
        <i className="fal fa-times" style={{ fontSize: 20 }} />
      </div>
    </div>
  );
};
export default TopModalView;
