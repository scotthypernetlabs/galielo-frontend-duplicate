import React from 'react';
import { connect } from 'react-redux';
import StakeModal from './StakeModal';
import NotificationModal from './NotificationModal';
import OfferModal from './OfferModal';
import BuyModal from './BuyModal';
import CreateStationModal from './CreateStationModal';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import AddMachineModal from "./AddMachineModal";
import VolumesModal from "./VolumesModal";
import InviteMembers from "../Stations/InviteMember";
import DockerWizard from '../DockerWizard/DockerWizard';
import LogModal from './LogModal';

interface ModalProps {
  modal: string;
}

const Modal: React.SFC<ModalProps> = (props) => {
  // Modal not displayed
  const { modal } = props;
  if(!modal){
    return null;
  }
  let component;
  let modalOptions:any = {
    'Stake': () => (<StakeModal />),
    'Notifications': () => (<NotificationModal />),
    'Offer': () => ( <OfferModal /> ),
    'Buy': () => ( <BuyModal />),
    'Create Station': () => ( <CreateStationModal />),
    'Add Machine': () => (<AddMachineModal />),
    'Volumes': () => (<VolumesModal />),
    'Invite Members': () => (<InviteMembers />),
    'Docker Wizard': () => (<DockerWizard />),
    'Job Log': () => (<LogModal />)
  };
  // Render the specified Modal, or nothing if specified Modal is not found.
  component = modalOptions[modal] || function():null{ return null };
  return (
    <div className="backdrop">
      { component() }
    </div>
  );
};

const mapStateToProps = (state:IStore) => ({
  modal: state.modal.modal_name,
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(Modal);
