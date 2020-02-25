import {Select} from "antd";
import React from "react";

interface OfferModalViewProps {
  handleSelect: any;
  handleChange: any;
  handleSubmit: any;
  rate: number;
  pay_interval: number;
  max_acceptances: number;
  deposit_per_acceptance: number;
  date: string;
  selectedMachines: string[];
  selectOptions: React.ReactElement[];
}

const OfferModalView: React.SFC<OfferModalViewProps> = (props) => {
  const {
    handleSelect,
    handleSubmit,
    handleChange,
    rate,
    pay_interval,
    max_acceptances,
    deposit_per_acceptance,
    date,
    selectedMachines,
    selectOptions
  } = props;

  return(
    <div className="modal-style" onClick={(e:any) => e.stopPropagation()}>
      <div className="create-station-modal-container">
        <div className="create-group-modal-title">Create an Offer</div>
        <p>Please fill out the offer details below</p>
        <Select
          mode="multiple"
          placeholder="Select machines"
          onChange={handleSelect}
          value={selectedMachines}
        >
          {selectOptions}
        </Select>
        <label>Rate </label>
        <input type="number" value={rate} min="0" onChange={handleChange("rate")} />
        <label>Pay Interval</label>
        <input type="number" value={pay_interval} min="0" onChange={handleChange("pay_interval")} />
        <label>Max Acceptances</label>
        <input type="number" value={max_acceptances} min="0" onChange={handleChange("max_acceptances")} />
        <label>Deposit Per Acceptance</label>
        <input type="number" value={deposit_per_acceptance} min="0" onChange={handleChange("deposit_per_acceptance")} />
        <label>Expiration Date</label>
        <input type="date" value={date} onChange={handleChange("date")} />
        <button onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
};
export default OfferModalView;
