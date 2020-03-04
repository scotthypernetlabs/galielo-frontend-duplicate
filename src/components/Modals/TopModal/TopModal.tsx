import { Dispatch } from "redux";
import { ICloseModal, closeModal } from "../../../actions/modalActions";
import { IStore } from "../../../business/objects/store";
import { connect } from "react-redux";
import React from "react";
import TopModalView from "./TopModalView";

type TopModalProps = {
  text: any;
  closeModal: () => ICloseModal;
};

const TopModal: React.SFC<TopModalProps> = (props: TopModalProps) => {
  const { text, closeModal } = props;
  return <TopModalView text={text} closeModal={closeModal} />;
};

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);
