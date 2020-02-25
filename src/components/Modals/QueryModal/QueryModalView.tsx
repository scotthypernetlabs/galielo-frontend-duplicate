import { Button } from "@material-ui/core";
import { ICloseModal } from "../../../actions/modalActions";
import { Query } from "../../../business/objects/modal";
import React from "react";

interface QueryModalView {
  query: Query;
  closeModal: () => ICloseModal;
}

const QueryModalView: React.SFC<QueryModalView> = (props: QueryModalView) => {
  const { query, closeModal } = props;
  return (
    <div className="coming-soon-modal" onClick={closeModal}>
      <div
        className="coming-soon-modal-inner"
        onClick={e => e.stopPropagation()}
      >
        <p> {query.title} </p>
        <h3> {query.text} </h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => query.yesFunction()}
          className="styled-button"
        >
          Yes
        </Button>
        <Button
          variant="contained"
          onClick={() => query.noFunction()}
          className="styled-button"
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default QueryModalView;
