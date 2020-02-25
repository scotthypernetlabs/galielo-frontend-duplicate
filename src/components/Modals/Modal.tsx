import React from 'react';
import { connect } from 'react-redux';
import StakeModal from './StakeModal';
import NotificationModal from './NotificationModal/NotificationModal';
import OfferModal from './OfferModal';
import BuyModal from './BuyModal/BuyModal';
import CreateStationModal from './CreateStationModal/CreateStationModal';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import AddMachineModal from "./AddMachineModal/AddMachineModal";
import VolumesModal from "./VolumesModal/VolumesModal";
import InviteMembers from "../Stations/InviteMember";
import DockerWizard from '../DockerWizard/DockerWizard';
import LogModal from './LogModal';
import { Query } from '../../business/objects/modal';
import QueryModal from './QueryModal/QueryModal';
import TopModal from './TopModal/TopModal';

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
    'Job Log': () => (<LogModal />),
    'Job Top': () => (<TopModal />),
    'Query': () => (<QueryModal />)
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
