import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../business/objects/store';
import { Dispatch } from 'redux';
import { closeModal, ICloseModal } from '../../../actions/modalActions';
import LogModalView from "./LogModalView";

type Props = {
  text: string;
  closeModal: () => ICloseModal;
}

type State = {}

class LogModal extends React.Component<Props, State> {
  constructor(props:Props){
    super(props);
  }
  render(){
    const {text, closeModal} = this.props;
    let logTextArray = text.split(/\r?\n/g);
    return <LogModalView logTextArray={logTextArray} closeModal={closeModal}/>
  }
}

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(LogModal);
