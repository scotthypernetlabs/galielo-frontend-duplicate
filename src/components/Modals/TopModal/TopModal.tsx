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

type State = {};

class TopModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { text, closeModal } = this.props;
    return <TopModalView text={text} closeModal={closeModal} />;
  }
}

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);
