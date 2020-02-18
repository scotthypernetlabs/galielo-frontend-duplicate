import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { closeModal, ICloseModal } from '../../actions/modalActions';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

type Props = {
  text: any;
  closeModal: () => ICloseModal;
}

type State = {

}

class TopModal extends React.Component<Props, State> {
  constructor(props:Props){
    super(props);
  }
  render(){
    let allProcesses = '';
    let titles = this.props.text.Titles;
    let column_percent = Math.floor(100 / titles.length);
    let columns = '';
    titles.forEach((title:string) => {
      columns += `${column_percent}% `
    })
    let style = {
      display: 'grid',
      gridTemplateColumns: `${columns}`
    }

    this.props.text.Processes.map((process_array:string[], idx:number) => {
      console.log("process array", process_array);
      process_array.map((process, idx2) => {
        console.log("process", process);
      })
    });

    return(
      <div className="modal-style" style={{maxWidth: "60%"}}>
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
                this.props.text.Processes.map( (process_array:string[], idx:number) => {
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
        <div onClick={this.props.closeModal} className="close-notifications add-cursor">
          <i className="fal fa-times" style={{fontSize: 20}}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);
