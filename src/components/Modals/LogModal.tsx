import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { closeModal, ICloseModal } from '../../actions/modalActions';

type Props = {
  text: string;
  closeModal: () => ICloseModal;
}

type State = {

}

class LogModal extends React.Component<Props, State> {
  constructor(props:Props){
    super(props);
  }
  render(){
    let logTextArray = this.props.text.split(/\r?\n/g);
    return(
        <div className="modal-style">
          <div className="job-log-container">
            {
              logTextArray.map((line:string, idx:number) => {
                return(
                  <div key={idx}>
                    {line}
                  </div>
                )
              })
            }
            <div onClick={this.props.closeModal} className="close-notifications">
              close
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(LogModal);
