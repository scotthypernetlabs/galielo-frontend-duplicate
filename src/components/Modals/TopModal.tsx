import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { closeModal, ICloseModal } from '../../actions/modalActions';

type Props = {
  text: any;
  closeModal: () => ICloseModal;
}

type State = {

}

class TopModal extends React.Component<Props, State> {
  constructor(props:Props){
    super(props);
  }
  render(){
    let allProcesses = '';
    let titles = this.props.text.Titles;
    let renderedTitles = '';
    let column_percent = Math.floor(100 / titles.length);
    let columns = '';
    titles.forEach((title:string) => {
      renderedTitles += `<div>${title}</div>`;
      columns += `${column_percent}% `
    })
    let style = {
      display: 'grid',
      gridTemplateColumns: `${columns}`
    }
    return(
      <>
        <div style={style}>
          { renderedTitles }
        </div>
        {
          this.props.text.Processes.map( (process_array:string[], idx:number) => {
            return(
              <div style={style}>
              {
                process_array.map((process:string, idx2: number) => {
                  return(
                    <div key={idx2}>
                    {process}
                    </div>
                  )
                })
              }
              </div>
            )
          })
        }
        <div onClick={this.props.closeModal} className="close-notifications">
        close
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  text: state.modal.modal_text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(TopModal);
