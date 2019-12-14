import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { logService } from '../Logger';
import {context} from '../../context'; import {MyContext} from '../../MyContext';
import { Select } from 'antd';
const defaultTokens = require('../../../tokens.json');

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  offerId: string;
};
type State = {
  deposit_payment: number;
  selectedToken: string;
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
})

class BuyModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      deposit_payment: 0,
      selectedToken: defaultTokens['Hypertoken'].address
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  public handleChange(type:keyof State){
    return(e:React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      this.setState(updateState(type, value));
    }
  }
  public handleSelectChange(value:string){
    this.setState({
      selectedToken: value
    })
  }
  public tokenSelector(){
    const { Option } = Select;
    const options:any[] = [];
    Object.keys(defaultTokens).forEach( (token:string, idx:number) => {
      let tokenInfo = defaultTokens[token];
      options.push(<Option key={idx} value={tokenInfo.address}>{token} ({tokenInfo.symbol})</Option>);
    })
    return(
      <Select defaultValue={defaultTokens['Hypertoken'].address} onChange={this.handleSelectChange}>
        {options}
      </Select>
    )
  }
  public handleSubmit(closeModal: Function){
    return(e:any) => {
      e.preventDefault();
      const consumerRepository = this.context.consumerRepository;
      let splitString = this.props.offerId.split(',');
      let offerId = splitString[0];
      let machineId = splitString[1];
      consumerRepository.acceptOfferRequest(
        offerId,
        this.state.deposit_payment,
        this.state.selectedToken,
        machineId
      );
      closeModal();
    }
  }
  public render(){
    return(
      <div className="modal-style" onClick={(e:any) => e.stopPropagation()}>
        <div className="create-station-modal-container">
            <div className="create-group-modal-title">Accept Offer</div>
            <p>Please indicate amount to deposit</p>
            <label>Amount</label>
            <input type="number" value={this.state.deposit_payment} onChange={this.handleChange('deposit_payment')} />
            {this.tokenSelector()}
            <button onClick={this.handleSubmit(this.props.closeModal)}>
              Submit
            </button>
          </div>
      </div>
    )
  }
}

BuyModal.contextType = context;

const mapStateToProps = (state:IStore) => ({
  offerId: state.modal.modal_text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(BuyModal);
