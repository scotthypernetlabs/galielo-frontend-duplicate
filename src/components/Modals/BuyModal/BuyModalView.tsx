import { Button, Typography } from "@material-ui/core";
import React from "react";
interface BuyModalProps {
  // e: any,
  handleChange: any;
  tokenSelector: any;
  handleSubmit: any;
  deposit_payment: any;
  closeModal: any;
  handle: any;
}
const BuyModalView: React.SFC<BuyModalProps> = (props: BuyModalProps) => {
  const {
    handleChange,
    tokenSelector,
    handleSubmit,
    deposit_payment,
    closeModal,
    handle
  } = props;
  return (
    <div className="create-station-modal-container">
      <div className="create-group-modal-title">Accept Offer</div>
      <p>Please indicate amount to deposit</p>
      <label>Amount</label>
      <input
        type="number"
        value={deposit_payment}
        onChange={handleChange("deposit_payment")}
      />
      {tokenSelector()}
      <Button onClick={handleSubmit(handle)}>Submit</Button>
    </div>
  );
};
export default BuyModalView;
