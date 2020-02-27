import { Dispatch } from "redux";
import { ICloseModal, closeModal } from "../../actions/modalActions";
import { IStore } from "../../business/objects/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import { connect } from "react-redux";
import React from "react";

type Props = {
  text: any;
  closeModal: () => ICloseModal;
};

type State = {};

class TopModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const titles = this.props.text.Titles;
    const processes = this.props.text.Processes;

    return (
      <div className="modal-style" style={{ maxWidth: "60%" }}>
        <TableContainer>
          <Table stickyHeader size="small" style={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                {
                  titles.map((title:string, idx:number) => {
                    return (
                      <TableCell align="center">
                      </TableCell>
                    )
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {processes.map(
                (process_array: string[], idx: number) => {
                  return (
                    <TableRow key={idx}>
                      {
                        process_array.map((process: string, idx2: number) => {
                          return(
                            <TableCell key={idx2}>
                              {process}
                            </TableCell>
                          )
                        })
                      }
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          onClick={this.props.closeModal}
          className="close-notifications add-cursor"
        >
          <i className="fal fa-times" style={{ fontSize: 20 }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);
