import React, {ChangeEvent} from "react";

interface StakeModalViewProps {
  closeModal: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleChange: (event?: ChangeEvent<Element>) => void;
  handleSubmit: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  stake_amount: string;
}
const StakeModalView: React.SFC<StakeModalViewProps> = (props) => {
  const {closeModal, handleChange, handleSubmit, stake_amount} = props;
  return(
    <div className='coming-soon-modal' onClick={closeModal}>
      <div className='coming-soon-modal-inner' onClick={e => e.stopPropagation()}>
        <p></p>
        <h2>Stake Amount</h2>
        <input type="number" min="0" onChange={handleChange} value={stake_amount}>
        </input>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
};
export default StakeModalView;
