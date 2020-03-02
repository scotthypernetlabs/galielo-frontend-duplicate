import { Dispatch } from "redux";
import { IStore } from "../../business/objects/store";
import { Query } from "../../business/objects/modal";
import { connect } from "react-redux";
import AddMachineModal from "./AddMachineModal/AddMachineModal";
import BuyModal from "./BuyModal/BuyModal";
import CreateStationModal from "./CreateStationModal/CreateStationModal";
import DockerWizard from "../DockerWizard/DockerWizard";
import InviteMembers from "../Stations/InviteMember/InviteMember";
import LogModal from "./LogModal/LogModal";
import NotificationModal from "./NotificationModal/NotificationModal";
import OfferModal from "./OfferModal/OfferModal";
import QueryModal from "./QueryModal/QueryModal";
import React from "react";
import StakeModal from "./StakeModal/StakeModal";
import TopModal from "./TopModal/TopModal";
import VolumesModal from "./VolumesModal/VolumesModal";

interface ModalProps {
  modal: string;
}

const Modal: React.SFC<ModalProps> = (props: ModalProps) => {
  // Modal not displayed
  const { modal } = props;
  if (!modal) {
    return null;
  }
  const modalOptions: any = {
    Stake: () => <StakeModal />,
    Notifications: () => <NotificationModal />,
    Offer: () => <OfferModal />,
    Buy: () => <BuyModal />,
    "Create Station": () => <CreateStationModal />,
    "Add Machine": () => <AddMachineModal />,
    Volumes: () => <VolumesModal />,
    "Invite Members": () => <InviteMembers />,
    "Docker Wizard": () => <DockerWizard />,
    "Job Log": () => <LogModal />,
    // "Job Top": () => <TopModal />,
    Query: () => <QueryModal />
  };
  // Render the specified Modal, or nothing if specified Modal is not found.
  const component =
    modalOptions[modal] ||
    function(): null {
      return null;
    };
  return <div className="backdrop">{component()}</div>;
};

const mapStateToProps = (state: IStore) => ({
  modal: state.modal.modal_name
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
