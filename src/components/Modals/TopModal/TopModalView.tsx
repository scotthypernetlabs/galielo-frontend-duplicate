import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import React from "react";
import {ICloseModal} from "../../../actions/modalActions";

interface TopModalViewProps {
  text: any;
  closeModal: () => ICloseModal;
}
const TopModalView: React.SFC<TopModalViewProps> = (props) => {
  return(
    <div className="modal-style top-modal" >
      <TableContainer >
        <Table stickyHeader size="small" style={{width: "100%"}}>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>PID</TableCell>
              <TableCell>PPID</TableCell>
              <TableCell align="center">C</TableCell>
              <TableCell align="center">STIME</TableCell>
              <TableCell align="center">TTY</TableCell>
              <TableCell align="center">TIME</TableCell>
              <TableCell align="center">CMD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.text.Processes.map( (process_array:string[], idx:number) => {
                return(
                  <TableRow key={idx}>
                    <TableCell>{process_array[0]}</TableCell>
                    <TableCell>{process_array[1]}</TableCell>
                    <TableCell>{process_array[2]}</TableCell>
                    <TableCell>{process_array[3]}</TableCell>
                    <TableCell>{process_array[4]}</TableCell>
                    <TableCell>{process_array[5]}</TableCell>
                    <TableCell>{process_array[6]}</TableCell>
                    <TableCell>{process_array[7]}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <div onClick={props.closeModal} className="close-notifications add-cursor">
        <i className="fal fa-times" style={{fontSize: 20}}/>
      </div>
    </div>
  )
};
export default TopModalView;
