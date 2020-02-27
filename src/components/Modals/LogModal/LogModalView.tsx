import { ICloseModal } from "../../../actions/modalActions";
import { Typography } from "@material-ui/core";
import React from "react";

interface LogModalViewProps {
  logTextArray: any;
  closeModal: () => ICloseModal;
}

const LogModalView: React.SFC<LogModalViewProps> = (
  props: LogModalViewProps
) => {
  const { closeModal, logTextArray } = props;
  return (
    <div className="modal-style">
      <div className="job-log-container">
        <div onClick={closeModal} className="close-notifications add-cursor">
          <i className="fal fa-times" style={{ fontSize: 20 }} />
        </div>
        {logTextArray.map((line: string, idx: number) => {
          return (
            <div key={idx}>
              <Typography variant="h5">{line}</Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogModalView;
