import { Dispatch } from "redux";
import { ICloseModal, closeModal } from "../../../actions/modalActions";
import { IStore } from "../../../business/objects/store";
import { Query } from "../../../business/objects/modal";
import { connect } from "react-redux";
import QueryModalView from "./QueryModalView";
import React from "react";

type Props = {
  query: Query;
  closeModal: () => ICloseModal;
};

type State = {};

class QueryModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { closeModal, query } = this.props;
    return <QueryModalView closeModal={closeModal} query={query} />;
  }
}

const mapStateToProps = (state: IStore) => ({
  query: state.modal.modal_query
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryModal);
