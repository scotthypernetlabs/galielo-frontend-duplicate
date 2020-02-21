import React from 'react';
import {Button, Typography} from "@material-ui/core";
interface BuyModalProps {
    // e: any,
    handleChange: any,
    tokenSelector: any,
    handleSubmit: any,
    deposit_payment: any,
    closeModal: any
    handle: any

}
const BuyModalView: React.SFC<BuyModalProps> = (props) => {
    return(
        <div className="create-station-modal-container">
        <div className="create-group-modal-title">Accept Offer</div>
        <p>Please indicate amount to deposit</p>
        <label>Amount</label>
        <input type="number" value={props.deposit_payment} onChange={props.handleChange('deposit_payment')} />
        {props.tokenSelector()}
        <Button onClick={props.handleSubmit(props.handle)}>
          Submit
        </Button>
      </div>
      )
    }
    export default BuyModalView;


