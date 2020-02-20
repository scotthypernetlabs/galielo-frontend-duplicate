import { Dictionary } from "../../business/objects/dictionary";
import { Dispatch } from "redux";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import { Select } from "antd";
import { User } from "../../business/objects/user";
import { closeModal } from "../../actions/modalActions";
import { connect } from "react-redux";
import { context } from "../../context";
import { logService } from "../Logger";
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
    logService.log(this.props);
    const selectOptions: React.ReactElement[] = [];
    this.props.currentUser.mids.forEach((mid: string, idx: number) => {
      selectOptions.push(
        <Option key={mid}>{this.props.machines[mid].machine_name}</Option>
      );
    });
    return (
      <div className="modal-style" onClick={(e: any) => e.stopPropagation()}>
        <div className="create-station-modal-container">
          <div className="create-group-modal-title">Create an Offer</div>
          <p>Please fill out the offer details below</p>
          <Select
            mode="multiple"
            placeholder="Select machines"
            onChange={this.handleSelect}
            value={this.state.selectedMachines}
          >
            {selectOptions}
          </Select>
          <label>Rate </label>
          <input
            type="number"
            value={this.state.rate}
            min="0"
            onChange={this.handleChange("rate")}
          />
          <label>Pay Interval</label>
          <input
            type="number"
            value={this.state.pay_interval}
            min="0"
            onChange={this.handleChange("pay_interval")}
          />
          <label>Max Acceptances</label>
          <input
            type="number"
            value={this.state.max_acceptances}
            min="0"
            onChange={this.handleChange("max_acceptances")}
          />
          <label>Deposit Per Acceptance</label>
          <input
            type="number"
            value={this.state.deposit_per_acceptance}
            min="0"
            onChange={this.handleChange("deposit_per_acceptance")}
          />
          <label>Expiration Date</label>
          <input
            type="date"
            value={this.state.date}
            onChange={this.handleChange("date")}
          />
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
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
