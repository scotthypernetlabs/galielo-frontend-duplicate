import React from 'react';
import { closeModal } from '../../actions/modalActions';
import { connect } from 'react-redux';
import StakeModal from './StakeModal';
import NotificationModal from './NotificationModal';
import OfferModal from './OfferModal';
import BuyModal from './BuyModal';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';

interface ModalProps {
  modal: string;
  closeModal: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Modal: React.SFC<ModalProps> = (props) => {
  // Modal not displayed
  const { modal, closeModal } = props;
  if(!modal){
    return null;
  }
  let component;
  let modalOptions:any = {
    'Stake': () => (<StakeModal />),
    'Notifications': () => (<NotificationModal />),
    'Offer': () => ( <OfferModal /> ),
    'Buy': () => ( <BuyModal />)
  };
  // Render the specified Modal, or nothing if specified Modal is not found.
  component = modalOptions[modal] || function():null{ return null }
  if(modal === 'Docker Wizard'){
    return(
      <div className="special-backdrop" onClick={closeModal}>
        { component() }
      </div>
    )
  }
  return (
    <div className="backdrop" onClick={closeModal}>
      { component() }
    </div>
  );
}

const mapStateToProps = (state:IStore) => ({
  modal: state.modal.modal_name
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});


export default connect(mapStateToProps, mapDispatchToProps)(Modal);
