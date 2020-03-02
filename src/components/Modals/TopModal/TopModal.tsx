import { Dispatch } from "redux";
import { ICloseModal, closeModal } from "../../../actions/modalActions";
import { IStore } from "../../../business/objects/store";
import { connect } from "react-redux";
import React from "react";
import TopModalView from "./TopModalView";

type Props = {
  text: any;
  closeModal: () => ICloseModal;
};

type State = {
  isDialogOpen: boolean;
};

class TopModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDialogOpen: true
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ isDialogOpen: false });
    // this.props.closeModal();
  }

  render() {
    const { text } = this.props;
    const { isDialogOpen } = this.state;
    return (
      <TopModalView
        text={text}
        isOpen={isDialogOpen}
        handleClose={this.handleClose}
      />
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
