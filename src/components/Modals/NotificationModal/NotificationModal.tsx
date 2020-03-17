import { Dispatch } from "redux";
import { IStore } from "../../../business/objects/store";
import { closeModal } from "../../../actions/modalActions";
import { connect } from "react-redux";
import NotificationModalView from "./NotificationModalView";
import React from "react";

type NotificationModalProps = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  text: string;
};

const NotificationModal: React.SFC<NotificationModalProps> = (
  props: NotificationModalProps
) => {
  const { closeModal, text } = props;
  return <NotificationModalView text={text} closeModal={closeModal} />;
};

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationModal);
