import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { injectContext, MyContext } from '../../context';

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
type State = {
  stake_amount: string;
}

class StakeModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      stake_amount: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public handleChange(e:any){
    const value = e.target.value;
    if(value === ''){
      this.setState({
        stake_amount: ''
      })
      return;
    }
    this.setState({
      stake_amount: value,
    })
  }
  public handleSubmit(e: any){
    e.preventDefault();
    if(this.state.stake_amount === ''){
      return;
    }
    this.context.providerRepository.stakeTokensRequest(parseFloat(this.state.stake_amount));
    this.props.closeModal();
  }
  public render(){
    const { closeModal } = this.props;
    return(
      <div className='coming-soon-modal' onClick={closeModal}>
        <div className='coming-soon-modal-inner' onClick={e => e.stopPropagation()}>
          <p></p>
          <h2>Stake Amount</h2>
          <input type="number" min="0" onChange={this.handleChange} value={this.state.stake_amount}>
          </input>
          <button type="button" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    )
  }
}

StakeModal.contextType = injectContext;

const mapStateToProps = (state:IStore) => ({
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(StakeModal);
