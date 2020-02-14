import React from 'react';
import { connect } from 'react-redux';
import { closeModal, ICloseModal } from '../../actions/modalActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { Query } from '../../business/objects/modal';
import {Button} from "@material-ui/core";

type Props = {
  query: Query;
  closeModal: () => ICloseModal;
}

type State = {

}

class QueryModal extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  render(){
    const { closeModal, query } = this.props;
    return(
      <div className="coming-soon-modal" onClick={closeModal}>
        <div className="coming-soon-modal-inner" onClick={e => e.stopPropagation()}>
          <p> {query.title} </p>
          <h2> {query.text} </h2>
          <Button variant="contained" color="primary" onClick={() => query.yesFunction()} className="styled-button">
            Yes
          </Button>
          <Button variant="contained" onClick={() => query.noFunction()} className="styled-button">
            No
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  query: state.modal.modal_query
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(QueryModal);
