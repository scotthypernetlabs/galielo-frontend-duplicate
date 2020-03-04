import { Dispatch } from "redux";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { Select } from "antd";
import { closeModal } from "../../../actions/modalActions";
import { connect } from "react-redux";
import { context } from "../../../context";
import BuyModalView from "./BuyModalView";
import React from "react";
const defaultTokens = require("../../../tokens.json");

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  offerId: string;
};
type State = {
  deposit_payment: number;
  selectedToken: string;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class BuyModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      deposit_payment: 0,
      selectedToken: defaultTokens["Hypertoken"].address
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  public handleChange(type: keyof State) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
    };
  }
  public handleSelectChange(value: string) {
    this.setState({
      selectedToken: value
    });
  }
  public tokenSelector() {
    const { Option } = Select;
    const options: any[] = [];
    Object.keys(defaultTokens).forEach((token: string, idx: number) => {
      const tokenInfo = defaultTokens[token];
      options.push(
        <Option key={idx} value={tokenInfo.address}>
          {token} ({tokenInfo.symbol})
        </Option>
      );
    });
    return (
      <Select
        defaultValue={defaultTokens["Hypertoken"].address}
        onChange={this.handleSelectChange}
      >
        {options}
      </Select>
    );
  }
  public handleSubmit(closeModal: Function) {
    return (e: any) => {
      e.preventDefault();
      const consumerRepository = this.context.consumerRepository;
      const splitString = this.props.offerId.split(",");
      const offerId = splitString[0];
      const machineId = splitString[1];
      consumerRepository.acceptOfferRequest(
        offerId,
        this.state.deposit_payment,
        this.state.selectedToken,
        machineId
      );
      closeModal();
    };
  }
  public render() {
    return (
      <div className="modal-style" onClick={(e: any) => e.stopPropagation()}>
        <BuyModalView
          handleChange={this.handleChange("deposit_payment")}
          tokenSelector={this.tokenSelector}
          handleSubmit={this.handleSubmit}
          deposit_payment={this.state.deposit_payment}
          closeModal={this.props.closeModal}
          handle={this.props.closeModal}
        />
      </div>
    );
  }
}

BuyModal.contextType = context;

const mapStateToProps = (state: IStore) => ({
  offerId: state.modal.modal_text
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyModal);
