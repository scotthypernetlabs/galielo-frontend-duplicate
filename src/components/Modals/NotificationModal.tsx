import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  text: string;
}

type State = {

}

class NotificationModal extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public handleSubmit(e: any){
    e.preventDefault();
    this.props.closeModal();
  }
  public render(){
    const { closeModal, text } = this.props;
    return(
      <div className='coming-soon-modal' onClick={closeModal}>
        <div className='coming-soon-modal-inner' onClick={e => e.stopPropagation()}>
          <h2>{text}</h2>
          <button type="button" onClick={this.handleSubmit}>
            Close
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  text: state.modal.modal_text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationModal);
