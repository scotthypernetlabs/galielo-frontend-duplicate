import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../../actions/modalActions';
import { IStore } from '../../../business/objects/store';
import { Dispatch } from 'redux';
import NotificationModalView from "./NotificationModalView";

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  text: string;
}

type State = {}

class NotificationModal extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  public render(){
    const { closeModal, text } = this.props;
    return (
      <NotificationModalView text={text} closeModal={closeModal}/>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  text: state.modal.modal_text
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationModal);
