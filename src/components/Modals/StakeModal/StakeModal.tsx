import { Dispatch } from "redux";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { closeModal } from "../../../actions/modalActions";
import { connect } from "react-redux";
import { context } from "../../../context";
import React from "react";
import StakeModalView from "./StakeModalView";

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
type State = {
  stake_amount: string;
};

class StakeModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      stake_amount: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public handleChange(e: any) {
    const value = e.target.value;
    if (value === "") {
      this.setState({
        stake_amount: ""
      });
      return;
    }
    this.setState({
      stake_amount: value
    });
  }
  public handleSubmit(e: any) {
    e.preventDefault();
    if (this.state.stake_amount === "") {
      return;
    }
    this.context.providerRepository.stakeTokensRequest(
      parseFloat(this.state.stake_amount)
    );
    this.props.closeModal();
  }
  public render() {
    const { closeModal } = this.props;
    const { stake_amount } = this.state;
    return (
      <StakeModalView
        closeModal={closeModal}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        stake_amount={stake_amount}
      />
    );
  }
}

StakeModal.contextType = context;

const mapStateToProps = (state: IStore) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(StakeModal);
