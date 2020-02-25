import { Dictionary } from "../../../business/objects/dictionary";
import { Dispatch } from "redux";
import { IStore } from "../../../business/objects/store";
import { Machine } from "../../../business/objects/machine";
import { MyContext } from "../../../MyContext";
import { Select } from "antd";
import { User } from "../../../business/objects/user";
import { closeModal } from "../../../actions/modalActions";
import { connect } from "react-redux";
import { context } from "../../../context";
import OfferModalView from "./OfferModalView";
import React from "react";

type Props = {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  currentUser: User;
  machines: Dictionary<Machine>;
};
type State = {
  rate: number;
  pay_interval: number;
  max_acceptances: number;
  deposit_per_acceptance: number;
  date: string;
  selectedMachines: string[];
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class OfferModal extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      rate: 0,
      pay_interval: 0,
      max_acceptances: 1,
      deposit_per_acceptance: 0,
      date: new Date().toISOString().substring(0, 10),
      selectedMachines: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  public handleChange(type: keyof State) {
    return (e: { target: HTMLInputElement }) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
    };
  }
  public handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (this.state.rate === 0 || this.state.deposit_per_acceptance === 0) {
      return;
    }
    const parsedTime = Date.parse(this.state.date);
    const providerRepository = this.context.providerRepository;
    console.log(this.context);
    providerRepository.createOfferRequest(
      this.state.rate,
      this.state.pay_interval,
      this.state.max_acceptances,
      this.state.deposit_per_acceptance,
      this.state.selectedMachines,
      parsedTime
    );
    this.props.closeModal();
  }
  public handleSelect(value: string[]) {
    this.setState({
      selectedMachines: value
    });
  }
  public render() {
    const { closeModal } = this.props;
    const { Option } = Select;
    const {
      rate,
      pay_interval,
      max_acceptances,
      deposit_per_acceptance,
      date,
      selectedMachines
    } = this.state;
    const selectOptions: React.ReactElement[] = [];
    this.props.currentUser.mids.forEach((mid: string) => {
      selectOptions.push(
        <Option key={mid}>{this.props.machines[mid].machine_name}</Option>
      );
    });

    return (
      <OfferModalView
        handleSelect={this.handleSelect}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        rate={rate}
        pay_interval={pay_interval}
        max_acceptances={max_acceptances}
        deposit_per_acceptance={deposit_per_acceptance}
        date={date}
        selectedMachines={selectedMachines}
        selectOptions={selectOptions}
      />
    );
  }
}

OfferModal.contextType = context;

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
  machines: state.machines.machines
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(OfferModal);
