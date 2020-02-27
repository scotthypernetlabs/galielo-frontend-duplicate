import { Button } from "@material-ui/core";
import React from "react";

interface NotificationModalViewProps {
  text: any;
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const NotificationModalView: React.SFC<NotificationModalViewProps> = (
  props: NotificationModalViewProps
) => {
  const { text, closeModal } = props;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="coming-soon-modal" onClick={closeModal}>
      <div
        className="coming-soon-modal-inner"
        onClick={e => e.stopPropagation()}
      >
        <h3>{text}</h3>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default NotificationModalView;
