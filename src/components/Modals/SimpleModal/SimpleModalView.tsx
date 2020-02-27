import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import React from "react";
interface SimpleModalProps {
  handleOpen: any;
  handleClose: any;
  modalStyle: any;
  classes: any;
  style: any;
  open: boolean;
}
const SimpleModalView: React.SFC<SimpleModalProps> = (
  props: SimpleModalProps
) => {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={props.handleOpen}>
        Open Modal New
      </Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        onClose={props.handleClose}
      >
        <div style={props.style} className={props.classes}>
          <h2>Simple React Modal</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            accumsan odio enim, non pharetra est ultrices et.
          </p>
        </div>
      </Modal>
    </div>
  );
};
export default SimpleModalView;
